import { toJSONSchema } from '@valibot/to-json-schema'
import type { BaseSchema } from 'valibot'

export interface OpenAPIInfo {
  title: string
  version: string
  description?: string
}

export interface OpenAPIOperation {
  summary?: string
  description?: string
  operationId?: string
  tags?: string[]
  parameters?: any[]
  requestBody?: any
  responses: Record<string, any>
}

export interface OpenAPIRoute {
  path: string
  method: string
  operation: OpenAPIOperation
  schema?: {
    query?: BaseSchema<any, any, any>
    body?: BaseSchema<any, any, any>
    response?: BaseSchema<any, any, any>
  }
}

export function createOpenAPISpec(
  info: OpenAPIInfo,
  routes: OpenAPIRoute[]
): any {
  const spec = {
    openapi: '3.0.3',
    info,
    paths: {} as Record<string, any>,
    components: {
      schemas: {}
    }
  }

  for (const route of routes) {
    const { path, method, operation, schema } = route
    
    if (!spec.paths[path]) {
      spec.paths[path] = {}
    }

    const pathItem = spec.paths[path]
    const operationObj: any = {
      ...operation,
      responses: operation.responses || {
        '200': {
          description: 'Success',
          content: {
            'application/json': {
              schema: schema?.response ? toJSONSchema(schema.response) : {}
            }
          }
        }
      }
    }

    // Add query parameters
    if (schema?.query) {
      let querySchema
      
      if (typeof schema.query === 'object' && 'type' in schema.query) {
        // Already a JSON Schema
        querySchema = schema.query
      } else {
        // Try to convert from Valibot
        try {
          querySchema = toJSONSchema(schema.query)
        } catch {
          querySchema = schema.query
        }
      }
      
      if (querySchema?.type === 'object' && querySchema.properties) {
        operationObj.parameters = Object.entries(querySchema.properties).map(([name, propSchema]) => ({
          name,
          in: 'query',
          required: querySchema.required?.includes(name) || false,
          schema: propSchema
        }))
      }
    }

    // Add request body
    if (schema?.body && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
      let bodySchema
      
      if (typeof schema.body === 'object' && 'type' in schema.body) {
        // Already a JSON Schema
        bodySchema = schema.body
      } else {
        // Try to convert from Valibot
        try {
          bodySchema = toJSONSchema(schema.body)
        } catch {
          bodySchema = schema.body
        }
      }
      
      operationObj.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: bodySchema
          }
        }
      }
    }

    // Update response schema
    if (schema?.response) {
      let responseSchema
      
      if (typeof schema.response === 'object' && 'type' in schema.response) {
        // Already a JSON Schema
        responseSchema = schema.response
      } else {
        // Try to convert from Valibot
        try {
          responseSchema = toJSONSchema(schema.response)
        } catch {
          responseSchema = schema.response
        }
      }
      
      operationObj.responses['200'] = {
        description: 'Success',
        content: {
          'application/json': {
            schema: responseSchema
          }
        }
      }
    }

    pathItem[method.toLowerCase()] = operationObj
  }

  return spec
}

export function generateOpenAPIFromRoutes(
  info: OpenAPIInfo,
  apiRoutes: Record<string, any>,
  handlerSchemas: Record<string, any> = {}
): any {
  const routes: OpenAPIRoute[] = []
  
  function extractRoutes(obj: any, basePath = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) {
        // This is a method definition
        const method = key.slice(1)
        const path = basePath || '/'
        
        // Find corresponding schema
        const routeKey = `${path}:${method.toUpperCase()}`
        const schema = handlerSchemas[routeKey]
        
        routes.push({
          path,
          method: method.toUpperCase(),
          operation: {
            operationId: `${method}${path.replace(/\//g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`,
            summary: `${method.toUpperCase()} ${path}`,
            responses: {
              '200': {
                description: 'Success'
              }
            }
          },
          schema
        })
      } else if (typeof value === 'object' && value !== null) {
        // Recursive call for nested paths
        extractRoutes(value, `${basePath}/${key}`)
      }
    }
  }
  
  extractRoutes(apiRoutes)
  
  return createOpenAPISpec(info, routes)
}