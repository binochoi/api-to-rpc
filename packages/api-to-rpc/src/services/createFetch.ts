import { $fetch } from "ofetch";
import { HttpRequestParameters } from "src/types/fetch";

export const fetchRequest = ({
    url,
    payload: { body, query },
    fetchOptions,
}: HttpRequestParameters) => $fetch(url, {
    ...fetchOptions,
    body,
    query,
})