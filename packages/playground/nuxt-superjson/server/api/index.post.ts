import { defineHandlerSchema } from "nitro-rpc-definition/imports";
import superjson from 'superjson';
import type { H3Event, ValidateFunction } from "h3";

export const schema = defineHandlerSchema({
    body: (i) => i,
})
export default defineEventHandler(async (e) => {
    const readSuperBody = async <T>(e: H3Event, validated: ValidateFunction<T>) => {
        const rawBody = await readRawBody(e);
        const body = superjson.parse(rawBody || '{}');
        return validated(body);
    }
    const body = await readSuperBody(e, schema.body);
    return superjson.serialize(body);
})