import { Action, Method, Payload } from "src/types";

type Options = {
    startPath: string,
};
const methods = new Set<Method>(['get', 'post', 'put', 'delete', 'patch']);
const get = (options: Options) => (target: any, prop: string, c: any) => {
    const { startPath: path } = options;
    const isAction = prop.startsWith('$');
    const restPath = isAction ? path : (path ? `${path}/${prop}` : `/${prop}`);
    if(isAction) {
        const action = prop.slice(1) as Action;
        if(methods.has(action)) {
            return (payload: Payload) => ({
                target,
                fullPath: restPath,
                url: restPath,
                method: action,
                payload
            })
        }
    }
    return recurseSegments(options);
}
export const recurseSegments = (options: {
    startPath: string,
}) => {
    return new Proxy({}, {
        get: get(options),
    })
}