<script setup lang="ts">
import type { ApiError } from '@/api'

defineProps<{
  loading: boolean
  error?: ApiError
  empty?: boolean
  emptyText?: string
}>()

defineEmits<{ retry: [] }>()
</script>

<template>
  <p v-if="loading" class="status" role="status" aria-live="polite">Loading…</p>
  <div v-else-if="error" class="status status--error" role="alert">
    <p>{{ error.message }}</p>
    <button type="button" @click="$emit('retry')">Try again</button>
  </div>
  <p v-else-if="empty" class="status">{{ emptyText ?? 'Nothing to show.' }}</p>
  <slot v-else />
</template>

<style scoped>
.status {
  padding: 1rem 0;
  color: var(--color-text-muted);
}

.status--error {
  color: var(--color-error);
}

button {
  margin-top: 0.5rem;
  padding: 0.4rem 0.9rem;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
</style>
