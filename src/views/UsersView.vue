<template>
  <div>
    <h1>Usuários</h1>

    <ul v-if="users.length">
      <li v-for="user in users" :key="user.id">{{ user.name }} ({{ user.email }})</li>
    </ul>

    <p v-else>Carregando...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '@/api'

const users = ref([])

onMounted(async () => {
  try {
    const response = await getUsers()
    users.value = response.data
  } catch (error) {
    console.error('Erro ao carregar usuários', error)
  }
})
</script>
