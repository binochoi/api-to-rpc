import { defineValibotSchema } from 'nitro-rpc-definition/imports';
import * as v from 'valibot';

// Define Valibot schemas
const QuerySchema = v.object({
  name: v.optional(v.string(), 'World'),
  count: v.optional(v.pipe(v.string(), v.transform(Number)), 1)
});

const ResponseSchema = v.object({
  message: v.string(),
  timestamp: v.string(),
  count: v.number()
});

export const schema = defineValibotSchema({
  query: QuerySchema,
  response: ResponseSchema
});

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { name = 'World', count = 1 } = query;
  
  return {
    message: `Hello ${name}! (${count})`,
    timestamp: new Date().toISOString(),
    count: Number(count)
  };
});
