import * as v from 'valibot';
import { InferOutput } from 'valibot';


type RequestParam = 'query' | 'body' | 'params';
type SchemaParams = { [K in RequestParam]?: any }
type SchemaResult<TSchema extends SchemaParams> = {
    [K in keyof TSchema]: (input: unknown) => TSchema[K] extends v.BaseSchema<any, any, any> ? InferOutput<TSchema[K]> : TSchema[K];
  }
function isEmpty(obj: any) {
  return Object.keys(obj || {}).length === 0;
}
function valibot<TSchema extends v.BaseSchema<any, any, any>>(schema: TSchema): v.InferOutput<TSchema> {
  return (input: unknown) => v.parse(schema, input);
}

export const defineSchema = <TParams extends SchemaParams>({ body, params, query }: TParams): SchemaResult<TParams> => ({
  query: isEmpty(query) ? () => true : valibot(query),
  body: isEmpty(body) ? () => true : valibot(body),
  params: isEmpty(params) ? () => true : valibot(params),
} as any);
