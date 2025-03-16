import rpc from 'api-to-rpc';

type API = {
    users: {
        ':id': {
            $get: {
                query: {
                    get_query_sival: true,
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
    },
    posts: {
        $post: {
            response: {
                
            }
        },
    },
    sessions: {},
}
const api = rpc<API>({ baseURL: '/api' });
api.users[':id'].$get()
api.posts.$post()