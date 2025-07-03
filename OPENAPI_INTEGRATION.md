# Nitro OpenAPI Integration with Valibot

Nitro에 OpenAPI 호환성을 추가하고 Valibot을 사용한 스키마 검증 및 자동 OpenAPI 스키마 생성 기능을 구현했습니다.

## 🚀 주요 기능

- **Valibot 스키마 통합**: Valibot을 사용한 강력한 타입 검증
- **자동 OpenAPI 스키마 생성**: API 라우트에서 자동으로 OpenAPI 3.0 스키마 생성
- **Swagger UI 통합**: 브라우저에서 바로 API 문서 확인 및 테스트
- **타입 안전성**: TypeScript와 완벽하게 통합된 타입 안전성

## 📋 설치 및 설정

### 1. 의존성 설치

```json
{
  "dependencies": {
    "valibot": "^1.1.0",
    "nitro-rpc-definition": "latest"
  }
}
```

### 2. Nitro 설정

```typescript
// nitro.config.ts
import rpc from 'nitro-rpc-definition'

export default defineNitroConfig({
  modules: [rpc()],
  // ... 기타 설정
})
```

## 🔧 사용법

### 1. Valibot 스키마로 API 정의

```typescript
// server/routes/users/index.post.ts
import { defineValibotSchema } from 'nitro-rpc-definition/imports';
import * as v from 'valibot';

// 스키마 정의
const CreateUserSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  email: v.pipe(v.string(), v.email()),
  age: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(150))),
});

const UserResponseSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  age: v.optional(v.number()),
  createdAt: v.string()
});

export const schema = defineValibotSchema({
  body: CreateUserSchema,
  response: UserResponseSchema
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Valibot으로 입력 검증
  const userData = v.parse(CreateUserSchema, body);
  
  // 사용자 생성 로직
  const user = {
    id: Math.random().toString(36).substr(2, 9),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  return user;
});
```

### 2. Query Parameter 스키마

```typescript
// server/routes/index.ts
import { defineValibotSchema } from 'nitro-rpc-definition/imports';
import * as v from 'valibot';

const QuerySchema = v.object({
  name: v.optional(v.string(), 'World'),
  count: v.optional(v.pipe(v.string(), v.transform(Number)), 1)
});

const ResponseSchema = v.object({
  message: v.string(),
  timestamp: v.string(),
  count: v.number()
});

export const schema = defineValibotSchema({
  query: QuerySchema,
  response: ResponseSchema
});

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { name = 'World', count = 1 } = query;
  
  return {
    message: `Hello ${name}! (${count})`,
    timestamp: new Date().toISOString(),
    count: Number(count)
  };
});
```

## 📊 OpenAPI 스키마 확인

### 1. OpenAPI JSON 스키마

```bash
curl http://localhost:3000/openapi.json
```

### 2. Swagger UI 접속

브라우저에서 다음 URL로 접속:
```
http://localhost:3000/swagger
```

## 🔍 생성된 OpenAPI 스키마 예시

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Nitro RPC API",
    "version": "1.0.0",
    "description": "Auto-generated OpenAPI specification from Nitro RPC definitions"
  },
  "paths": {
    "/users": {
      "post": {
        "operationId": "post_users",
        "summary": "POST /users",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 100
                  },
                  "email": {
                    "type": "string",
                    "format": "email"
                  },
                  "age": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 150
                  }
                },
                "required": ["name", "email"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "email": { "type": "string" },
                    "age": { "type": "number" },
                    "createdAt": { "type": "string", "format": "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## 🧪 API 테스트

### GET 요청 (Query Parameters)
```bash
curl "http://localhost:3000/?name=OpenAPI&count=5"
```

응답:
```json
{
  "message": "Hello OpenAPI! (5)",
  "timestamp": "2025-07-03T18:12:38.037Z",
  "count": 5
}
```

### POST 요청 (Body Validation)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "age": 25}'
```

응답:
```json
{
  "id": "ck0ztd8se",
  "name": "John Doe", 
  "email": "john@example.com",
  "age": 25,
  "createdAt": "2025-07-03T18:12:39.508Z"
}
```

## ✨ 장점

1. **타입 안전성**: Valibot을 통한 런타임 타입 검증
2. **자동 문서화**: 코드에서 자동으로 OpenAPI 스키마 생성
3. **개발자 경험**: Swagger UI를 통한 인터랙티브 API 문서
4. **검증 기능**: 입력값 자동 검증 및 에러 처리
5. **표준 준수**: OpenAPI 3.0 표준 완전 지원

## 🛠 개발 흐름

1. Valibot 스키마로 API 입력/출력 정의
2. `defineValibotSchema`를 사용해 스키마 등록
3. 자동으로 OpenAPI 스키마 생성
4. Swagger UI에서 API 문서 확인
5. 실제 API 테스트 및 검증

이제 Nitro에서 완전한 OpenAPI 호환성과 Valibot 통합을 통해 타입 안전하고 문서화된 API를 개발할 수 있습니다! 🎉