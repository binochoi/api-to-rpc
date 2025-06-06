import type { Payload } from 'api-to-rpc/exports'
type PayloadParameter = { [K in Payload]: { [K: string]: any } | ((i: unknown) => any) };
export const defineHandlerSchema = <TPayload extends PayloadParameter>(payload: TPayload): TPayload => {
    return payload;
}