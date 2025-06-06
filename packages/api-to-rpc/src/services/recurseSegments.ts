import { Action, Method, RPCContextOutput } from "src/types";
import { createFetcher } from "./fetchRequest";
import { RPCObjectRecurse } from "src/types/utils/MakeFetchThroughRequest";

type Options = {
    startPath: string,
};
const methods = new Set<Method>(['get', 'post', 'put', 'delete', 'patch']);
const get = (options: Options, context: RPCContextOutput) => (_: any, prop: string) => {
    const { onRequest, onResponse } = context;
    const { startPath: path } = options;
    const isAction = prop.startsWith('$');
    const restPath = isAction ? path : (path ? `${path}/${prop}` : `/${prop}`);
    if(isAction) {
        const action = prop.slice(1) as Action;
        if(methods.has(action)) {
            return (payload: RPCObjectRecurse<any> = {}) => onResponse(
                onRequest({
                    payload,
                    method: action,
                    url: restPath,
                    fetchOptions: payload.fetchOptions,
                },
                createFetcher
            ),
        );
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