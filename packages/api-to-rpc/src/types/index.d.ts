import { MakeFetchThroughRequest } from "./utils/MakeFetchThroughRequest";
import { RPCPayloadMatcher } from "./utils/RPCPayloadMatcher";

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type Payload = 'query' | 'body' | 'params';
/**
 * ```ts
 * api.health.$get(params: ActionParams)
 * ```
*/
export type ActionParams = Payload | 'response';
export type Action = Method;

export type RPCOptions = {
    baseURL: string;
}

export type Context = RPCOptions;

export type RPCMethodAction = `$${Method}`;
export type RPCPayloadAction = `$${Payload}`;
export type RPCAction = RPCMethodAction | RPCPayloadAction;
type AsyncFetch = any;
export type RPCResult = {
    [key in RPCAction]: {
        (requestParam: Record<RPCPayloadMatcher<key>, any>): AsyncFetch,
    };
}
export type RecurseApiDeep<Tapi extends { [K: string]: any }> = {
    [K in keyof Tapi]: K extends RPCMethodAction
    ? MakeFetchThroughRequest<Tapi, K>
    : RecurseApiDeep<Tapi[K]>
}