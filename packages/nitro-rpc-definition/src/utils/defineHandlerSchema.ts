import { Payload } from 'api-to-rpc/exports'
type PayloadParameter = { [K in Payload]: { [K: string]: any } };
export const defineHandlerSchema = <TPayload extends PayloadParameter>(payload: TPayload): TPayload => {
    return payload;
}