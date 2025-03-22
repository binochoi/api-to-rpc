export const schema = defineSchema({
    body: {} as { sival: true },
})
export default defineEventHandler(async (e) => {
    console.log('post accessed !')
    return readBody(e);
})