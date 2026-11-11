<script setup lang="ts">
import { computed } from 'vue'
import { getPosts } from '@/api'
import AsyncStatus from '@/components/AsyncStatus.vue'
import { useAsync } from '@/composables/useAsync'

const { data: posts, error, loading, run } = useAsync((signal) => getPosts({ signal }))
const isEmpty = computed(() => posts.value?.length === 0)
</script>

<template>
  <section>
    <h1>Posts</h1>

    <AsyncStatus :loading :error :empty="isEmpty" empty-text="No posts found." @retry="run">
      <ul class="list">
        <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
      </ul>
    </AsyncStatus>
  </section>
</template>
