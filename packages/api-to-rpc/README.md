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
- [] file
- [] SSE