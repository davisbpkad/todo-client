<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ authStore.isAdmin ? 'Todo Management' : 'My Todos' }}
            </h1>
            <p class="text-sm text-gray-600">
              Welcome back, {{ authStore.userName }}
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                    :class="authStore.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                {{ authStore.user?.role }}
              </span>
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showCreateForm = true"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Todo
            </button>
            <button
              @click="handleLogout"
              class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Filters -->
      <div class="px-4 py-4 sm:px-0">
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="flex flex-wrap gap-4 items-center">
            <div>
              <label for="status-filter" class="block text-sm font-medium text-gray-700">Filter by Status</label>
              <select
                id="status-filter"
                v-model="filters.status"
                @change="fetchTodos"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <div v-if="authStore.isAdmin">
              <label for="user-filter" class="block text-sm font-medium text-gray-700">Filter by User ID</label>
              <input
                id="user-filter"
                v-model.number="filters.user_id"
                @input="fetchTodos"
                type="number"
                min="1"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter user ID"
              />
            </div>

            <button
              @click="refreshData"
              class="mt-6 px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Todo Stats -->
      <div v-if="todoStore.stats" class="px-4 sm:px-0 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">T</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Todos</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ todoStore.stats.total_todos }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ todoStore.stats.completed_todos }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">○</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Incomplete</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ todoStore.stats.incomplete_todos }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">!</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ todoStore.stats.overdue_todos }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="todoStore.loading" class="px-4 sm:px-0">
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p class="mt-2 text-gray-600">Loading todos...</p>
        </div>
      </div>

      <!-- Todo List -->
      <div v-else class="px-4 sm:px-0">
        <div v-if="todoStore.todos.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No todos found</p>
          <button
            @click="showCreateForm = true"
            class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Create your first todo
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="todo in todoStore.todos"
            :key="todo.id"
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
                    @click="toggleTodo(todo.id)"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    :class="todo.is_completed 
                      ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500' 
                      : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'"
                  >
                    {{ todo.is_completed ? 'Undo' : 'Complete' }}
                  </button>
                  
                  <button
                    @click="editTodo(todo)"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  
                  <button
                    @click="deleteTodo(todo.id)"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Todo Modal -->
    <TodoForm
      v-if="showCreateForm || editingTodo"
      :todo="editingTodo"
      @close="closeForm"
      @saved="handleTodoSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useTodoStore } from '@/stores/todoStore'
import TodoForm from './TodoForm.vue'
import type { Todo, TodoFilters } from '@/services/todoService'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

const showCreateForm = ref(false)
const editingTodo = ref<Todo | null>(null)

const filters = reactive<TodoFilters>({
  status: undefined,
  user_id: undefined
})

const fetchTodos = async () => {
  await todoStore.fetchTodos(filters)
}

const toggleTodo = async (id: number) => {
  try {
    await todoStore.toggleTodo(id)
  } catch (error) {
    console.error('Toggle error:', error)
  }
}

const editTodo = (todo: Todo) => {
  editingTodo.value = todo
}

const deleteTodo = async (id: number) => {
  if (confirm('Are you sure you want to delete this todo?')) {
    try {
      await todoStore.deleteTodo(id)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingTodo.value = null
}

const handleTodoSaved = () => {
  closeForm()
  fetchTodos()
  todoStore.fetchTodoStats() // Refresh stats
}

const refreshData = async () => {
  await Promise.all([
    fetchTodos(),
    todoStore.fetchTodoStats()
  ])
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

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

onMounted(async () => {
  await Promise.all([
    fetchTodos(),
    todoStore.fetchTodoStats()
  ])
})
</script>
