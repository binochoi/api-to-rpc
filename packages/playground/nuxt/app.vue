<script setup lang="ts">
import rpc from 'api-to-rpc'
// import type { API } from './.nuxt/.rpc-definition'
import type { API } from '/Users/bino/Workspaces/api-to-rpc/packages/playground/nuxt/.nuxt/.rpc-definition'
const { api } = rpc<API>({
  baseURL: 'http://localhost:3001',
})

onMounted(async () => {
  const formData = new FormData();
  formData.append('file', new File([''], 'test.txt', { type: 'text/plain' }));
  const get = await api.$post({ body: formData, query: { sival: 'true' } });
  console.log(get)
})
</script>
<template>
  <div>
  </div>
</template>
