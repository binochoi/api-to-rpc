import rpc from 'api-to-rpc';

type API = {
    users: {
        messages: {
            ':id': {
                $get: {
                    params: {
                        id: string,
                    },
                    query: {
                        get_query: true,
                    },
                    response: {
                        res_true: 'ok'
                    },
                },
                $post: {
                    response: {
                        
                    }
                },
            },
        }
    },
    posts: {
        $post: {
            response: {
                
            }
        },
    },
    sessions: {},
}
const api = rpc<API>({
    baseURL: '/api',
    interceptor(context, fetcher) {
        return fetcher(context);
    },
});

const a = api.users.messages[':id'].$get({
    params: {
        id: '1231',
    },
    query: {
        get_query: true,
    }
})
console.log(a);