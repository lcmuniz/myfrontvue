<template>
  <section>
    <h1>Vue 3 API layer example</h1>
    <p>
      A small reference app showing how to keep HTTP concerns out of components: a single configured
      client, typed resource modules, normalized errors and cancellable requests.
    </p>
    <p>
      Data comes from <code>{{ apiUrl }}</code> (set <code>VITE_API_URL</code> to point it
      elsewhere).
    </p>
    <ul>
      <li><RouterLink to="/users">Browse users</RouterLink> and open a user to see their posts.</li>
      <li><RouterLink to="/posts">Browse all posts</RouterLink>.</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { DEFAULT_API_URL } from '@/api'

const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL
</script>
