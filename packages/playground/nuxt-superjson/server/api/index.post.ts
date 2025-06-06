import { defineHandlerSchema } from "nitro-rpc-definition/imports";
import superjson from 'superjson';

export const schema = defineHandlerSchema({
    body: {} as {
        createdAt: Date,
    },
})
export default defineEventHandler(async (e) => {
    const rawBody = await readRawBody(e);
    const body = superjson.parse(rawBody || '{}');
})