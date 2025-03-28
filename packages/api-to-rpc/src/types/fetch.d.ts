import { FetchOptions } from "ofetch";
import { Payload } from ".";
export type HttpRequestParameters = {
    url: string,
    method: string,
    payload: Partial<Record<Payload, any>>,
    fetchOptions?: Omit<
        FetchOptions<'json', any>,
        'method' | Payload
    >
}