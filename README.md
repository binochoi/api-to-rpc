library that using proxy api to implement the rpc client with only the type of the backend endpoints at runtime

```ts
npm i --save ofetch api-to-rpc
```

# Example
## basic
```ts
import rpc from 'api-to-rpc';
type API = {
    users: {
        ':id': {
            query: {
                queryHere: true,
            },
            params: {
                id: 'zzz',
            }
        },
    },
    posts: {},
    sessions: {},
}
const { users } = rpc<API>({
    baseURL: '/api',
    onRequest: (payload, fetcher) => fetcher(payload),
    onResponse: (data) => data,
});
const res = await users[':id'].$query();
```
## form-data
### client-side
```ts
  formData.append('file', new File([''], 'test.txt', { type: 'text/plain' }));
  const data = await api.$post({ body: formData });
```
### server-side (nitro)
```ts

```

# options
```ts
rpc({
    transform() {
        
    }
})
```

# SuperJSON
### client-side


### server-side


# TODO
- [x] formdata
- [] SSE
- [] infer type
- openAPI (nitro)
- query, body 등에서 props가 전부 optional일 경우 body: {} 를 하지 않아도 문제 없도록
- then 할 경우 promise가 두 개라 promise가 가져와짐.
- beforeRequest, beforeResponse
