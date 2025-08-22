import type { NitroModule } from 'nitropack'
import { arrayToNestedObject } from './utils/arrayToNestedObject';
import defu from 'defu'
import * as fs from 'fs';
import { injectValueToDeepProperties } from './utils/injectValueToDeepProperties';
import { fileURLToPath } from 'url';
const configExtAll = [
    '.config.js',
    '.config.ts',
    '.config.mjs',
    '.config.cjs'
  ];
const isNuxt = () => configExtAll.some((ext) => fs.existsSync('nuxt' + ext))
const isNitro = () => configExtAll.some((ext) => fs.existsSync('nitro' + ext))
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
            if (isNuxt()) {
                fs.mkdirSync('./.nuxt', { recursive: true });
                fs.writeFileSync('./.nuxt/.rpc-definition.d.ts', file);
            } else if (isNitro()) {
                fs.mkdirSync('./.nitro', { recursive: true });
                fs.writeFileSync('./.nitro/.rpc-definition.d.ts', file);
            }
        }
        nitro.hooks.addHooks({
            'types:extend': makeRpcDefinition,
            'dev:start': makeRpcDefinition,
            'dev:reload': makeRpcDefinition,
        })
    },
  }) satisfies NitroModule;
