import rpc from 'api-to-rpc';

type API = {
    users: {
        ':id': {
            $get: {
                query?: {
                    get_query_sival: true,
                },
                response: {
                    res_true: 'ok'
                },
            },
            $post: {},
        },
    },
    posts: {},
    sessions: {},
}
const api = rpc<API>({ baseURL: '/api' });
api.users[':id'].$get({
});