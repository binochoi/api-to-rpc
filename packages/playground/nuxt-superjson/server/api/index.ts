import * as v from 'valibot';

export const schema = defineSchema({
  query: {} as { suvaa: true },
});
export default defineEventHandler(async (e) => {
  const { suvaa } = await getValidatedQuery(e, schema.query);
  return {suvaa};
});