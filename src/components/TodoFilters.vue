<template>
  <div class="px-4 py-4 sm:px-0">
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Status Filter -->
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            id="status-filter"
            :value="filters.status || ''"
            @change="handleStatusChange"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        
        <!-- User ID Filter (Admin Only) -->
        <div v-if="isAdmin">
          <label for="user-filter" class="block text-sm font-medium text-gray-700">Filter by User ID</label>
          <input
            id="user-filter"
            :value="filters.user_id || ''"
            @input="handleUserIdChange"
            type="number"
            min="1"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter user ID"
          />
        </div>
        
        <!-- Username Filter -->
        <div>
          <label for="username-filter" class="block text-sm font-medium text-gray-700">Filter by Username</label>
          <input
            id="username-filter"
            :value="filters.username || ''"
            @input="handleUsernameChange"
            type="text"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter username"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 mt-6">
          <button
            @click="handleRefresh"
            class="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
          >
            Refresh
          </button>
          
          <button
            @click="handleClearFilters"
            class="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TodoFilters } from '@/services/todoService'

interface Props {
  filters: TodoFilters
  isAdmin: boolean
}

interface Emits {
  (e: 'update:filters', filters: TodoFilters): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleStatusChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value || undefined
  
  const newFilters: TodoFilters = {
    ...props.filters,
    status: newStatus as TodoFilters['status']
  }
  
  emit('update:filters', newFilters)
}

const handleUserIdChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const userId = target.value ? parseInt(target.value) : undefined
  
  const newFilters: TodoFilters = {
    ...props.filters,
    user_id: userId
  }
  
  emit('update:filters', newFilters)
}

const handleUsernameChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const username = target.value.trim() || undefined
  
  const newFilters: TodoFilters = {
    ...props.filters,
    username
  }
  
  emit('update:filters', newFilters)
}

const handleRefresh = () => {
  emit('refresh')
}

const handleClearFilters = () => {
  const clearedFilters: TodoFilters = {
    status: undefined,
    user_id: undefined,
    username: undefined
  }
  emit('update:filters', clearedFilters)
}
</script>
