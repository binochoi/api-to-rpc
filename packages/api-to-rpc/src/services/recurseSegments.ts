import { Action, Method, Payload } from "src/types";
import { fetchRequest } from "./fetchRequest";
import { convertUrlParams } from "src/utils/convertUrlParams";

type Options = {
    startPath: string,
};
const methods = new Set<Method>(['get', 'post', 'put', 'delete', 'patch']);
const get = (options: Options) => (_: any, prop: string) => {
    const { startPath: path } = options;
    const isAction = prop.startsWith('$');
    const restPath = isAction ? path : (path ? `${path}/${prop}` : `/${prop}`);
    if(isAction) {
        const action = prop.slice(1) as Action;
        if(methods.has(action)) {
            return (payload: Record<Payload, any>) => fetchRequest({
                url: convertUrlParams(restPath, payload.params || {}),
                method: action,
                payload: payload || {},
            })
        }
    }
    return recurseSegments({ startPath: restPath });
}
export const recurseSegments = (options: {
    startPath: string,
}) => {
    return new Proxy({}, {
        get: get(options),
    })
}