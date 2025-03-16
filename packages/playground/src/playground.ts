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
api.posts.$post()


const a = api.users[':id'].$get({
    query: {
        get_query_sival: true,
    }
})
console.log(a);