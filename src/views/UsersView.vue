<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getUsers } from '@/api'
import AsyncStatus from '@/components/AsyncStatus.vue'
import { useAsync } from '@/composables/useAsync'

const { data: users, error, loading, run } = useAsync((signal) => getUsers({ signal }))
const isEmpty = computed(() => users.value?.length === 0)
</script>

<template>
  <section>
    <h1>Users</h1>

    <AsyncStatus :loading :error :empty="isEmpty" empty-text="No users found." @retry="run">
      <ul class="list">
        <li v-for="user in users" :key="user.id">
          <RouterLink :to="{ name: 'user', params: { id: user.id } }">{{ user.name }}</RouterLink>
          <span class="muted"> · {{ user.email }}</span>
        </li>
      </ul>
    </AsyncStatus>
  </section>
</template>
