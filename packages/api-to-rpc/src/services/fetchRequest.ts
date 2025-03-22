import { $fetch } from "ofetch";
import { Payload } from "src/types";
import { HttpRequestParameters } from "src/types/fetch";
import { convertUrlParams } from "src/utils/convertUrlParams";

export const createFetcher = ({
    url: _url,
    method,
    payload: { body, query, params },
    fetchOptions,
}: HttpRequestParameters) => {
    const url = convertUrlParams(_url, params || {});
    return $fetch(url, { ...fetchOptions, body, query, method });
}

/**
 * $get, $post... 에 해당하는 함수
 */
export const fetchRequest = ({ url, method, ...restParams }: Omit<HttpRequestParameters, 'payload'>) => {
    return (payload: Partial<Record<Payload, any>> = {}) => {
        return createFetcher({
            url,
            method,
            payload: payload || {},
            ...restParams,
        })
    }
}