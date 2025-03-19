export const schema = {} as {
    query: {
      query_visible: 'True',
    }
}
export default defineEventHandler((event) => {
  console.log('accesss ')
    return {a: 'Hello World'};
});