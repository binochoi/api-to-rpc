export const schema = {} as {
    query: {
      sival_query: 'True',
    }
}
export default defineEventHandler((event) => {
  console.log('accesss ')
    return {a: 'Hello World'};
});