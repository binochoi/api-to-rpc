import { Action, Method, Payload, RPCContextOutput } from "src/types";
import { createFetcher, fetchRequest } from "./fetchRequest";

type Options = {
    startPath: string,
};
const methods = new Set<Method>(['get', 'post', 'put', 'delete', 'patch']);
const get = (options: Options, context: RPCContextOutput) => (_: any, prop: string) => {
    const { transform } = context;
    const { startPath: path } = options;
    const isAction = prop.startsWith('$');
    const restPath = isAction ? path : (path ? `${path}/${prop}` : `/${prop}`);
    if(isAction) {
        const action = prop.slice(1) as Action;
        if(methods.has(action)) {
            return (payload: Partial<Record<Payload, any>> = {}) => transform({
                payload,
                method: action,
                url: restPath,
            }, createFetcher)
        }
    }
    return recurseSegments({ startPath: restPath, context });
}
export const recurseSegments = (options: {
    startPath: string,
    context: RPCContextOutput,
}) => {
    return new Proxy({}, {
        get: get(options, options.context),
    })
}