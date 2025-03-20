<script setup lang="ts">
import rpc from 'api-to-rpc'
import type { API } from './.nuxt/.rpc-definition'
const { api } = rpc<API>({
  baseURL: 'http://localhost:3000',
})
const a = await api.$get()
</script>
<template>
  <div>
    {{ a }}
  </div>
</template>
