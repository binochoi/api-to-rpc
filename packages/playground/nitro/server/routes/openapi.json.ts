import * as fs from 'fs'
import * as path from 'path'

export default defineEventHandler((event) => {
  try {
    // Try to read the generated OpenAPI spec
    let openAPIPath: string
    
    if (fs.existsSync('./.nitro/openapi.json')) {
      openAPIPath = './.nitro/openapi.json'
    } else if (fs.existsSync('./.nuxt/openapi.json')) {
      openAPIPath = './.nuxt/openapi.json'
    } else {
      // Fallback to a basic OpenAPI spec
      return {
        openapi: '3.0.3',
        info: {
          title: 'Nitro RPC API',
          version: '1.0.0',
          description: 'Auto-generated OpenAPI specification from Nitro RPC definitions'
        },
        paths: {}
      }
    }
    
    const openAPIContent = fs.readFileSync(openAPIPath, 'utf-8')
    return JSON.parse(openAPIContent)
  } catch (error) {
    console.error('Error reading OpenAPI spec:', error)
    
    // Return fallback OpenAPI spec
    return {
      openapi: '3.0.3',
      info: {
        title: 'Nitro RPC API',
        version: '1.0.0',
        description: 'Auto-generated OpenAPI specification from Nitro RPC definitions'
      },
      paths: {}
    }
  }
})