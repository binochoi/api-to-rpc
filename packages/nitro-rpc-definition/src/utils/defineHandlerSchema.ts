type PayloadParameter = { [K in 'query' | 'body' | 'params']?: { [K: string]: any } | ((i: unknown) => any) };
export const defineHandlerSchema = <TPayload extends PayloadParameter>(payload: TPayload): TPayload => {
    return payload;
}