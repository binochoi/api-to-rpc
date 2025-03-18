<script setup lang="ts">
import rpc from 'api-to-rpc'
import type { API } from './.nuxt/.rpc-definition.d.ts'
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
