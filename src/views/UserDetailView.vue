<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getPostsByUser, getUserById } from '@/api'
import AsyncStatus from '@/components/AsyncStatus.vue'
import { useAsync } from '@/composables/useAsync'

const props = defineProps<{ id: number }>()

// The route component is re-created per id (see router `key`), so loading once is enough.
const { data, error, loading, run } = useAsync(async (signal) => {
  const [user, posts] = await Promise.all([
    getUserById(props.id, { signal }),
    getPostsByUser(props.id, { signal }),
  ])
  return { user, posts }
})

const user = computed(() => data.value?.user)
const posts = computed(() => data.value?.posts ?? [])
</script>

<template>
  <section>
    <p><RouterLink to="/users">← All users</RouterLink></p>

    <AsyncStatus :loading :error @retry="run">
      <template v-if="user">
        <h1>{{ user.name }}</h1>
        <dl class="details">
          <dt>Username</dt>
          <dd>{{ user.username }}</dd>
          <dt>Email</dt>
          <dd>{{ user.email }}</dd>
          <template v-if="user.company">
            <dt>Company</dt>
            <dd>{{ user.company.name }}</dd>
          </template>
        </dl>

        <h2>Posts ({{ posts.length }})</h2>
        <ul class="list">
          <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
        </ul>
      </template>
    </AsyncStatus>
  </section>
</template>

<style scoped>
.details {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.25rem 1rem;
  margin: 1rem 0 2rem;
}

.details dt {
  color: var(--color-text-muted);
}
</style>
