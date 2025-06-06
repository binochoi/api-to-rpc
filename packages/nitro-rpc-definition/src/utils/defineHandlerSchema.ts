import type { Payload } from 'api-to-rpc/exports'
type PayloadParameter = { [K in Payload]: { [K: string]: any } | ((i: unknown) => any) };
type PayloadParameter = { [K in 'query' | 'body' | 'params']: { [K: string]: any } | ((i: unknown) => any) };
import type { Payload } from 'api-to-rpc/exports'
type PayloadParameter = { [K in Payload]: { [K: string]: any } | ((i: unknown) => any) };
    return payload;
}