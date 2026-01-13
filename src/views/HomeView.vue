<template>
  <div>
    <h1>Posts</h1>

    <ul v-if="posts.length">
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>

    <p v-else>Carregando...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPosts } from '@/api'

const posts = ref([])

onMounted(async () => {
  try {
    const response = await getPosts()
    posts.value = response.data
  } catch (error) {
    console.error('Erro ao carregar posts', error)
  }
})
</script>
