import { HttpRequestPayload } from "src/types";

export const isHttpRequestPayload = (payload: string): payload is HttpRequestPayload => {
    return payload === 'query' || payload === 'body' || payload === 'params';
}