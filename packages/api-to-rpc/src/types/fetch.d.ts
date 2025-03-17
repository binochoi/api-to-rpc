import { FetchOptions } from "ofetch";
import { Payload } from ".";

export type RPCHttpRequestPayload = 'query' | 'body' | 'params';
export type HttpRequestParameters = {
    url: string,
    method: string,
    payload: Partial<Record<Payload, any>>,
    fetchOptions?: Omit<
        FetchOptions<'json', any>,
        'method' | 'query' | 'body'
    >
}