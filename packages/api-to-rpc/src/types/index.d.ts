import { createFetcher, fetchRequest } from "src/services/fetchRequest";
import { MakeFetchThroughRequest } from "./utils/MakeFetchThroughRequest";
import { RPCPayloadMatcher } from "./utils/RPCPayloadMatcher";

/** @todo head, options 추가해야 하는지 */
export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type Payload = 'query' | 'body' | 'params';
/**
 * ```ts
 * api.health.$get(params: ActionParams)
 * ```
*/
export type ActionParams = Payload | 'response';
export type Action = Method;

export type RPCContext = {
    baseURL: string;
    onRequest?: (params: Parameters<typeof createFetcher>[0], next: typeof createFetcher) => any;
    onResponse?: (data: any) => any;
}
export type RPCContextOutput = Required<RPCContext>;
export type Context = RPCContext;

export type RPCMethodAction = `$${Method}`;
export type RPCPayloadAction = `$${Payload}`;
export type RPCAction = RPCMethodAction | RPCPayloadAction;
export type RecurseApiDeep<Tapi extends { [K: string]: any }> = {
    [K in keyof Tapi]: K extends RPCMethodAction
    ? MakeFetchThroughRequest<Tapi, K>
    : RecurseApiDeep<Tapi[K]>
}