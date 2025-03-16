/**
 * http method에 따른 payload 타입
 */
export type RPCPayloadMatcher<M extends string> = M extends '$get' | '$delete' 
  ? 'query' | 'params'
  : M extends '$post' | '$put' | '$patch'
    ? 'body' | 'params'
    : never;
