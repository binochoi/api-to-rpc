<script setup lang="ts">
import rpc from 'api-to-rpc'
import superjson from 'superjson'
// import type { API } from './.nuxt/.rpc-definition'
import type { API } from './.nuxt/.rpc-definition'
const { api } = rpc<API>({
  baseURL: 'http://localhost:3001',
  interceptor: (params, fetcher) => {
    const { payload } = params;
    if(payload.body) {
      payload.body = superjson.serialize(payload.body);
    }
    return fetcher({
      ...params,
      payload,
    });
  }
})

onMounted(async () => {
  const get = await api.$post({ body: { createdAt: new Date() } });
})
</script>
<template>
  <div>
  </div>
</template>
