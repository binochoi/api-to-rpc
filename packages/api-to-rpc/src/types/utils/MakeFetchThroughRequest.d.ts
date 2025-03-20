import { ActionParams, Payload } from "..";

/**
 * parameter로 fetch 타입 제작
 */
export type MakeFetchThroughRequest<Tapi extends { [K: string]: any }, K extends keyof Tapi> = keyof Tapi[K] extends ActionParams
    ? FetchFn<Tapi[K]>
    : () => Promise<Tapi[K]['response']>
/**
 * @example
 * ```ts
 * api.users.$get(...)
 * ```
 * 들어온 object에서 Payload인 property만 남기고 제외
 */
export type FetchRequestParam<T> = RemoveNeverProps<RPCObjectRecurse<T>>;

type IsAllPropertiesOptional<T> = {
  [K in keyof T]-?: undefined extends T[K] ? true : false
}[keyof T] extends true ? true : false;

type RPCObjectRecurse<T> = {
  [K in keyof T]: K extends Payload ? T[K] : never
}
type RemoveNeverProps<T> = {
[K in keyof T as T[K] extends never ? never : K]: T[K]
};
/**
 * FetchRequestParam<T>가 빈 객체 타입인 경우 params를 선택적으로 만드는 타입
 * 예를 들어 get일 경우에는 파라미터 자체가 아예 없이 url만으로 요청이 갈 수도 있다
 */
type FetchFn<T extends {[K: string]: any}> = IsAllPropertiesOptional<FetchRequestParam<T>> extends true
  ? (params?: FetchRequestParam<T>) => Promise<T['response']>
  : (params: FetchRequestParam<T>) => Promise<T['response']>