<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ isAdmin ? 'Todo Management' : 'My Todos' }}
          </h1>
          <p class="text-sm text-gray-600">
            Welcome back, {{ userName }}
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
              {{ userRole }}
            </span>
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="$emit('create-todo')"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Todo
          </button>
          <button
            @click="$emit('logout')"
            class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  isAdmin: boolean
  userName: string
  userRole: string
}

interface Emits {
  (e: 'create-todo'): void
  (e: 'logout'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
