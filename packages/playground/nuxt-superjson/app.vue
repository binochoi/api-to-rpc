<script setup lang="ts">
import rpc from 'api-to-rpc'
import superjson from 'superjson'
// import type { API } from './.nuxt/.rpc-definition'
import type { API } from './.nuxt/.rpc-definition'
const { api } = rpc<API>({
  baseURL: 'http://localhost:3001',
  onRequest: (params, fetcher) => {
    const { payload } = params;
    if(payload.body) {
      payload.body = superjson.serialize(payload.body);
    }
    return fetcher({
      ...params,
      payload,
    });
  },
  onResponse: (data) => {
    function isSuperJSON(obj: any): boolean {
      return (
        obj !== null &&
        typeof obj === 'object' &&
        'json' in obj &&
        'meta' in obj &&
        typeof obj.meta === 'object'
      );
    }
    return isSuperJSON(data) ? superjson.deserialize(data) : data;
  }
})

const data = await api.$post({ body: { createdAt: new Date() } });
</script>
<template>
  <div>
    {{ data }}
  </div>
</template>
