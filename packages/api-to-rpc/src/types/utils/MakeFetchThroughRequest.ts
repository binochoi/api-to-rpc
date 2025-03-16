import { Payload } from "..";


/**
 * parameter로 fetch 타입 제작
 */
export type MakeFetchThroughRequest<Tapi extends { [K: string]: any }, K extends keyof Tapi> = keyof Tapi[K] extends (Payload | 'response')
    ? (params: FetchRequestParam<Tapi[K]>) => Promise<Tapi[K]['response']>
    : Promise<void>
/**
 * @example
 * ```ts
 * api.users.$get(...)
 * ```
 * 들어온 object에서 Payload인 property만 남기고 제외
 */
export type FetchRequestParam<T> = RemoveNeverProps<RPCObjectRecurse<T>>;


type RPCObjectRecurse<T> = {
  [K in keyof T]: K extends Payload ? T[K] : never
}
type RemoveNeverProps<T> = {
[K in keyof T as T[K] extends never ? never : K]: T[K]
};