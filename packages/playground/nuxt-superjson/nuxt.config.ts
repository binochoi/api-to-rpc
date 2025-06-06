import rpc from 'nitro-rpc-definition'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-03-19',
  devtools: { enabled: true },
  nitro: {
    modules: [rpc()]
  },
})