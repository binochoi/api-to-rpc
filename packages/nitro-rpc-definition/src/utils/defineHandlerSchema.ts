import type { BaseSchema } from 'valibot'

type PayloadParameter = { 
  [K in 'query' | 'body' | 'params']?: { [K: string]: any } | ((i: unknown) => any) | BaseSchema<any, any, any>
};

export const defineHandlerSchema = <TPayload extends PayloadParameter>(payload: TPayload): TPayload => {
    return payload;
}

// Valibot schema helper
export const defineValibotSchema = <
  TQuery extends BaseSchema<any, any, any> | undefined = undefined,
  TBody extends BaseSchema<any, any, any> | undefined = undefined,
  TParams extends BaseSchema<any, any, any> | undefined = undefined,
  TResponse extends BaseSchema<any, any, any> | undefined = undefined
>(schema: {
  query?: TQuery
  body?: TBody
  params?: TParams
  response?: TResponse
}) => {
  return schema
}