
defineHandlerSchema({
  query: {
    query_visible: 'True'
  }
})

export const schema = {} as {
  query: {
    query_visible: 'True',
  }
}
export default defineEventHandler((event) => {
  return "Start by editing <code>server/routes/index.ts</code>.";
});
