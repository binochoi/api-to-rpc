import { defineHandlerSchema } from "nitro-rpc-definition/imports";
import * as v from 'valibot';

export const schema = defineHandlerSchema({
    query: (input: unknown) => v.parse(
        v.object({
            sival: v.string()
        }),
        input
    ),
    body: {} as FormData,
})
export default defineEventHandler(async (e) => {
    getValidatedQuery(e, schema.query);
    const formData = await readFormData(e);
    console.log((formData).get('siva'));
    return "ㅋ";
})