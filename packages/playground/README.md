```ts
import rpc from 'api-to-rpc';

type API = {
    users: {
        ':id': {
            query: {
                sival: true,
            },
            body: {
                thisIsBody: true,
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
```