/**
 * /api/users/:id/:filter
 * 에서 id, filter를 object의 property에 매핑
 */
export const convertUrlParams = (path: string, params: Record<string, string | number>) => {
    return Object.entries(params).reduce(
        (p, [key, value]) => p.replace(`:${key}`, value.toString()),
        path
    )
}
