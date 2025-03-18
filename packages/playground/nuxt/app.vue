<script setup lang="ts">
import type { API } from './.nuxt/.rpc-definition.d.ts'
import rpc from 'api-to-rpc'
declare module "api-to-rpc" {
  export interface Window<T> {
    type: 'sival'
  }
}
const { api } = rpc<API>({
  baseURL: 'http://localhost:3000',
  interceptor(params, next) {
    return useAsyncData(() => next(params)) as any;
  },
})
const a = await api.$get({
  query: {
    sival_query:'True'
  }
});
</script>
<template>
  <div>
    {{ a }}
  </div>
</template>
