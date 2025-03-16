// import { HttpRequestPayload } from "./fetch";

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';
type Payload = 'query' | 'body' | 'params';

export type RPCOptions = {
    baseURL: string;
}

export type Context = RPCOptions;

export type RPCMethodAction = `$${Method}`;
export type RPCPayloadAction = `$${Payload}`;
export type RPCAction = RPCMethodAction | RPCPayloadAction;

type RPCPayloadMatcher<M extends string> = M extends '$get' | '$delete' 
  ? 'query' | 'params'
  : M extends '$post' | '$put' | '$patch'
    ? 'body' | 'params'
    : never;

type AsyncFetch = any;
export type RPCResult = {
    [key in RPCAction]: {
        (requestParam: Record<RPCPayloadMatcher<key>, any>): AsyncFetch,
    };
}
export type RPCObjectRecurse<T> = {
    [K in keyof T]: K extends Payload ? T[K] : never
}
type RemoveNeverProps<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
};

type MakeFetchThroughRequest<Tapi extends { [K: string]: any }, K extends keyof Tapi> = keyof Tapi[K] extends (Payload | 'response')
    ? (params: RemoveNeverProps<RPCObjectRecurse<Tapi[K]>>) => Promise<Tapi[K]['response']>
    : void
export type RecurseApiDeep<Tapi extends { [K: string]: any }> = {
    [K in keyof Tapi]: K extends RPCMethodAction
    ? MakeFetchThroughRequest<Tapi, K>
    : RecurseApiDeep<Tapi[K]>
}