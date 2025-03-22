<script setup lang="ts">
import rpc from 'api-to-rpc'
import type { API } from './.nuxt/.rpc-definition'
const { api } = rpc<API>({
  baseURL: 'http://localhost:3000',
})
onMounted(async () => {
  const get = await api.$post({ body: {sival: true} });
  // const { data, error } = await useAsyncData(async () => await api.$post({ body: { sival: true} }))
  console.log(get)
})
</script>
<template>
  <div>
  </div>
</template>
