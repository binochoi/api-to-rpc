import { $fetch } from "ofetch";
import { Context, Payload, RPCContext } from "src/types";
import { HttpRequestParameters } from "src/types/fetch";
import { convertUrlParams } from "src/utils/convertUrlParams";

export const createFetcher = ({
    url: _url,
    method,
    payload: { body, query, params },
    fetchOptions,
}: HttpRequestParameters, context?: Context) => {
    const {
        onRequestError,
        onResponseError,
    } = context || {};
    const url = convertUrlParams(_url, params || {});
    return $fetch(url, {
        ...fetchOptions,
        body, query, method,
        onRequestError,
        onResponseError,
    });
}

/**
 * $get, $post... 에 해당하는 함수
 */
export const fetchRequest = ({ url, method, ...restParams }: Omit<HttpRequestParameters, 'payload'>, context: RPCContext) => {
    return (payload: Partial<Record<Payload, any>> = {}) => {
        return createFetcher({
            url,
            method,
            payload: payload || {},
            ...restParams,
            ...context,
        }, context)
    }
}