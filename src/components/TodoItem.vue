<template>
  <div
    class="bg-white shadow rounded-lg border-l-4"
    :class="{
      'border-l-green-500': todo.is_completed,
      'border-l-red-500': todo.is_overdue && !todo.is_completed,
      'border-l-blue-500': !todo.is_completed && !todo.is_overdue
    }"
  >
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <!-- Todo Title -->
          <h3 
            class="text-lg font-medium"
            :class="{ 
              'line-through text-gray-500': todo.is_completed,
              'text-gray-900': !todo.is_completed 
            }"
          >
            {{ todo.nama }}
          </h3>
          
          <!-- Todo Description -->
          <p 
            class="mt-1 text-sm"
            :class="{ 
              'line-through text-gray-400': todo.is_completed,
              'text-gray-600': !todo.is_completed 
            }"
          >
            {{ todo.deskripsi }}
          </p>
          
          <!-- Todo Meta Information -->
          <div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span v-if="todo.due_date" class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Due: {{ formatDate(todo.due_date) }}
            </span>
            
            <span v-if="todo.completed_at" class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Completed: {{ formatDate(todo.completed_at) }}
            </span>
            
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ todo.user.name }}
            </span>
            
            <!-- Status Badge -->
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': todo.is_completed,
                'bg-red-100 text-red-800': todo.is_overdue && !todo.is_completed,
                'bg-blue-100 text-blue-800': !todo.is_completed && !todo.is_overdue
              }"
            >
              {{ todo.is_completed ? 'Completed' : todo.is_overdue ? 'Overdue' : 'Pending' }}
            </span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center space-x-2 ml-4">
          <button
            @click="$emit('toggle', todo.id)"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="todo.is_completed 
              ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500' 
              : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'"
          >
            {{ todo.is_completed ? 'Undo' : 'Complete' }}
          </button>
          
          <button
            @click="$emit('edit', todo)"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
          
          <button
            @click="$emit('delete', todo.id)"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '@/services/todoService'

interface Props {
  todo: Todo
}

interface Emits {
  (e: 'toggle', id: number): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: number): void
}

defineProps<Props>()
defineEmits<Emits>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(dateString.includes('T') ? {
      hour: '2-digit',
      minute: '2-digit'
    } : {})
  })
}
</script>
