export const convertUrlParams = (path: string, params: Record<string, string | number>) => {
    return Object.entries(params).reduce(
        (p, [key, value]) => p.replace(`:${key}`, value.toString()),
        path
    )
}
