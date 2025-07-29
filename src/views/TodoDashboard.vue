<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Todo Dashboard</h1>
      <p class="mt-2 text-gray-600">Manage your tasks with real-time updates</p>
    </div>

    <!-- Stats Component - Updates in real-time -->
    <div class="mb-8">
      <TodoStats />
    </div>

    <!-- Todo Management -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Todo List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Your Todos</h2>
        
        <!-- Add new todo form -->
        <form @submit.prevent="handleCreateTodo" class="mb-6">
          <div class="flex gap-2">
            <input
              v-model="newTodo.nama"
              type="text"
              placeholder="Add a new todo..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              :disabled="todoStore.loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>

        <!-- Todo List -->
        <div class="space-y-2">
          <div
            v-for="todo in todoStore.todos"
            :key="todo.id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-md"
            :class="{
              'bg-green-50 border-green-200': todo.is_completed,
              'bg-red-50 border-red-200': todo.is_overdue,
              'bg-gray-50': !todo.is_completed && !todo.is_overdue
            }"
          >
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="todo.is_completed"
                @change="handleToggleTodo(todo.id)"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <div 
                  class="font-medium"
                  :class="{
                    'line-through text-gray-500': todo.is_completed,
                    'text-red-600': todo.is_overdue
                  }"
                >
                  {{ todo.nama }}
                </div>
                <div class="text-sm text-gray-500">{{ todo.deskripsi }}</div>
              </div>
            </div>

            <!-- Status Badge -->
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-green-100 text-green-800': todo.is_completed,
                'bg-red-100 text-red-800': todo.is_overdue,
                'bg-blue-100 text-blue-800': !todo.is_completed && !todo.is_overdue
              }"
            >
              {{ todo.is_completed ? 'Completed' : todo.is_overdue ? 'Overdue' : 'Pending' }}
            </span>

            <!-- Delete Button -->
            <button
              @click="handleDeleteTodo(todo.id)"
              class="ml-2 p-1 text-red-600 hover:text-red-800"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Real-time Stats Details -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Real-time Insights</h2>
        
        <!-- Completion Rate Chart (simplified) -->
        <div class="mb-6">
          <h3 class="text-md font-medium mb-2">Completion Rate</h3>
          <div class="relative pt-1">
            <div class="flex mb-2 items-center justify-between">
              <div>
                <span class="text-xs font-semibold inline-block text-green-600">
                  {{ statsWithPercentages.completed_percentage }}%
                </span>
              </div>
            </div>
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
              <div 
                :style="{ width: `${statsWithPercentages.completed_percentage}%` }"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-2">
          <button
            @click="markAllCompleted"
            :disabled="todoStore.incompleteTodos.length === 0"
            class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark All Complete ({{ todoStore.incompleteTodos.length }})
          </button>
          
          <button
            @click="deleteCompleted"
            :disabled="todoStore.completedTodos.length === 0"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Completed ({{ todoStore.completedTodos.length }})
          </button>
        </div>

        <!-- Real-time updates notice -->
        <div class="mt-6 p-3 bg-blue-50 rounded-md">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-blue-700">Stats update automatically as you work!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { useTodoStats } from '@/composables/useTodoStats'
import TodoStats from '@/components/TodoStats.vue'

const todoStore = useTodoStore()
const { statsWithPercentages } = useTodoStats()

const newTodo = ref({
  nama: '',
  deskripsi: ''
})

// Initialize the store
onMounted(async () => {
  await todoStore.initialize()
})

// Handlers
const handleCreateTodo = async () => {
  try {
    await todoStore.createTodo({
      nama: newTodo.value.nama,
      deskripsi: newTodo.value.deskripsi
    })
    newTodo.value = { nama: '', deskripsi: '' }
  } catch (error) {
    console.error('Failed to create todo:', error)
  }
}

const handleToggleTodo = async (id: number) => {
  try {
    await todoStore.toggleTodo(id)
  } catch (error) {
    console.error('Failed to toggle todo:', error)
  }
}

const handleDeleteTodo = async (id: number) => {
  if (confirm('Are you sure you want to delete this todo?')) {
    try {
      await todoStore.deleteTodo(id)
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }
}

const markAllCompleted = async () => {
  try {
    const incompleteTodos = todoStore.incompleteTodos
    await Promise.all(
      incompleteTodos.map(todo => todoStore.toggleTodo(todo.id))
    )
  } catch (error) {
    console.error('Failed to mark all as completed:', error)
  }
}

const deleteCompleted = async () => {
  if (confirm('Are you sure you want to delete all completed todos?')) {
    try {
      const completedTodos = todoStore.completedTodos
      await Promise.all(
        completedTodos.map(todo => todoStore.deleteTodo(todo.id))
      )
    } catch (error) {
      console.error('Failed to delete completed todos:', error)
    }
  }
}
</script>
