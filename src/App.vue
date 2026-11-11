<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="header">
    <nav aria-label="Main">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/users">Users</RouterLink>
      <RouterLink to="/posts">Posts</RouterLink>
    </nav>
  </header>

  <main>
    <!-- Keyed by path so /users/1 → /users/2 re-creates the view and reloads its data. -->
    <RouterView :key="$route.fullPath" />
  </main>
</template>

<style scoped>
.header {
  padding: 1rem 0 2rem;
}

nav {
  display: flex;
  gap: 1.25rem;
}

nav a.router-link-exact-active {
  color: var(--color-heading);
  font-weight: 600;
}
</style>
