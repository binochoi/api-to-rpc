Type-safe inference to the client by returning the handler to the rpc type

# Installation
```bash
npm i --save nitro-rpc-definition
```
```ts
/** nitro */
import rpc from 'nitro-rpc-definition'
export default defineNitroConfig({
  modules: [rpc()],
});
/** nuxt */
export default defineNuxtConfig({
    nitro: {
        modules: [rpc()],
    }
})
```

You can find the d.ts file in the .nuxt folder in nuxt and in the .nitro folder in nuxt.