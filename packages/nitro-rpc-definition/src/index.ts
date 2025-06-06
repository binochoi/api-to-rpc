import type { NitroModule } from 'nitropack'
import { arrayToNestedObject } from './utils/arrayToNestedObject';
import defu from 'defu'
import * as fs from 'fs';
import { injectValueToDeepProperties } from './utils/injectValueToDeepProperties';
import { fileURLToPath } from 'url';
export default () => ({
    name: "nitro-rpc-definition",
    async setup(nitro) {
        const makeRpcDefinition = () => {
            if (nitro.options.imports) {
                nitro.options.imports.presets.push({
                    from: fileURLToPath(new URL('imports', import.meta.url)),
                    imports: ['defineHandlerSchema']
                })
            }
            let apiRoutes = {};
            [...nitro.scannedHandlers, ...nitro.options.handlers]
            .filter((handler): handler is typeof handler & { route: string } => !!handler.route)
            .map(({ route, method, handler }) => {
                const [_, ...resources] = route.split('/');
                const r = injectValueToDeepProperties(
                    arrayToNestedObject(resources),
                    {
                        [`$${method || 'get'}`]: `~~` + 
                            `{ response: Awaited<ReturnType<(typeof import('${handler}'))['default']>> }` +
                            `& AssertSchema<(typeof import('${handler}'))>` +
                            `~~`
                    }
                )
                apiRoutes = defu(apiRoutes, r);
            })
            const file = `
            type AssertSchema<T> = 'schema' extends keyof T ? { [K in keyof T['schema']]: T['schema'][K] extends (...args: any[]) => any ? ReturnType<T['schema'][K]> : T['schema'][K] } : {};
            export type API = ${JSON.stringify(apiRoutes).replaceAll('"~~', '').replaceAll('~~"', '')}`;
            if (fs.existsSync('./.nuxt')) {
                fs.writeFileSync('./.nuxt/.rpc-definition.d.ts', file);
            } else if (fs.existsSync('./.nitro')) {
                fs.writeFileSync('./.nitro/.rpc-definition.d.ts', file);
            } else {
                throw new Error('.nitro or .nuxt directory not found');
            }
        }
        nitro.hooks.addHooks({
            'dev:reload': makeRpcDefinition,
        })
    },
  }) satisfies NitroModule;
