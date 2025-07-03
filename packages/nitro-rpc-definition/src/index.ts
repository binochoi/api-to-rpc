import type { NitroModule } from 'nitropack'
import { arrayToNestedObject } from './utils/arrayToNestedObject';
import defu from 'defu'
import * as fs from 'fs';
import { injectValueToDeepProperties } from './utils/injectValueToDeepProperties';
import { fileURLToPath } from 'url';
import { generateOpenAPIFromRoutes, type OpenAPIInfo } from './utils/openapi';
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
            
            // Generate OpenAPI spec
            const openAPIInfo: OpenAPIInfo = {
                title: 'Nitro RPC API',
                version: '1.0.0',
                description: 'Auto-generated OpenAPI specification from Nitro RPC definitions'
            };
            
            // Example schemas that could be extracted from handlers
            const handlerSchemas = {
              '/users:POST': {
                body: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', minLength: 1, maxLength: 100 },
                    email: { type: 'string', format: 'email' },
                    age: { type: 'number', minimum: 0, maximum: 150 }
                  },
                  required: ['name', 'email']
                },
                response: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    age: { type: 'number' },
                    createdAt: { type: 'string', format: 'date-time' }
                  }
                }
              },
              '/:GET': {
                query: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', default: 'World' },
                    count: { type: 'number', default: 1 }
                  }
                },
                response: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                    count: { type: 'number' }
                  }
                }
              }
            };
            
            const openAPISpec = generateOpenAPIFromRoutes(openAPIInfo, apiRoutes, handlerSchemas);
            
            // Write OpenAPI spec
            if (fs.existsSync('./.nuxt')) {
                fs.writeFileSync('./.nuxt/openapi.json', JSON.stringify(openAPISpec, null, 2));
            } else if (fs.existsSync('./.nitro')) {
                fs.writeFileSync('./.nitro/openapi.json', JSON.stringify(openAPISpec, null, 2));
            }
        }
        nitro.hooks.addHooks({
            'dev:reload': makeRpcDefinition,
        })
    },
  }) satisfies NitroModule;
