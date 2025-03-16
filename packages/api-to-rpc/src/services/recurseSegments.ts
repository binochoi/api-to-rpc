import { Context } from "src/types";
import { isHttpRequestPayload } from "src/utils/isHttpRequestPayload";

const get = (path: string, context: Context) => (target: any, prop: string) => {
    const restPath = path ? `${path}/${prop}` : `/${prop}`;
    if(prop.startsWith('$')) {
        const action = prop.slice(1);
        let method: string = action;
        // if(isHttpRequestPayload(action)) {
        //     
        // }
        return () => ({
            target,
            fullPath: restPath,
            url: context.baseURL + restPath,
            method,
        })
    }
    return recurseSegments(path, context);
}
export const recurseSegments = (path: string, c: Context) => {
    return new Proxy({}, {
        get: get(path, c),
    })
}