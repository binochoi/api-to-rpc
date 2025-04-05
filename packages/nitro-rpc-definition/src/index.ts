import type { NitroModule } from 'nitropack'
import { arrayToNestedObject } from './utils/arrayToNestedObject';
import defu from 'defu'
import * as fs from 'fs';
import { injectValueToDeepProperties } from './utils/injectValueToDeepProperties';
export default () => ({
    name: "nitro-rpc-definition",
    async setup(nitro) {
        const makeRpcDefinition = () => {
            let apiRoutes = {};
            nitro.options.imports = defu(nitro.options.imports, {
                imports: [{
                    from: 'nitro-rpc-definition/imports',
                    name: 'defineHandlerSchema'
                }]
            });
            nitro.scannedHandlers
            .filter((handler): handler is typeof handler & { route: string } => !!handler.route)
            .map(({ route, method, handler }) => {
                const [_, ...resources] = route.split('/');
                const r = injectValueToDeepProperties(
                    arrayToNestedObject(resources),
                    {
                        [`$${method || 'get'}`]: `~~` + 
                            `{ response: ReturnType<(typeof import('${handler}'))['default']> }` +
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