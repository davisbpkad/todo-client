<template>
  <div class="px-4 sm:px-0">
    <div class="text-center py-12">
      <div class="mx-auto h-16 w-16 text-gray-400 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      </div>
      <p class="text-gray-500 text-lg">{{ message || 'No todos found' }}</p>
      <button
        @click="$emit('create-todo')"
        class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
      >
        {{ buttonText || 'Create your first todo' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  buttonText?: string
}

interface Emits {
  (e: 'create-todo'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
