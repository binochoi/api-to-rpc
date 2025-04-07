library that using proxy api to implement the rpc client with only the type of the backend endpoints at runtime

```ts
npm i --save ofetch api-to-rpc
```

# Example
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
});
const res = await users[':id'].$query();
```
# options
```ts
rpc({
    transform() {
        
    }
})
```
# TODO
- [x] file
- [] SSE
- [] infer type
- query, body 등에서 props가 전부 optional일 경우 body: {} 를 하지 않아도 문제 없도록
- then 할 경우 promise가 두 개라 promise가 가져와짐.
