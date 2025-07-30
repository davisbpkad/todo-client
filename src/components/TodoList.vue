<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Component -->
    <TodoHeader 
      :is-admin="authStore.isAdmin"
      :user-name="authStore.userName"
      :user-role="authStore.user?.role || 'user'"
      @create-todo="showCreateForm = true"
      @logout="handleLogout"
    />

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Filters Component -->
      <TodoFiltersComponent 
        :filters="filters"
        :is-admin="authStore.isAdmin"
        @update:filters="handleFiltersUpdate"
        @refresh="refreshData"
      />


      <!-- Stats Component -->
      <TodoStats />


      <!-- Loading State -->
      <TodoLoadingState v-if="todoStore.loading" />

      <!-- Empty State -->
      <TodoEmptyState 
        v-else-if="todoStore.filteredTodos.length === 0"
        @create-todo="showCreateForm = true"
      />

      <!-- Todo List -->
      <div v-else class="px-4 sm:px-0">
        <div class="space-y-4">
          <TodoItem
            v-for="todo in todoStore.filteredTodos"
            :key="todo.id"
            :todo="todo"
            @toggle="toggleTodo"
            @edit="editTodo"
            @delete="deleteTodo"
          />
        </div>
        
        <!-- Show count of filtered vs total -->
        <div v-if="todoStore.filteredTodos.length !== todoStore.todos.length" class="mt-4 text-center text-sm text-gray-500">
          Showing {{ todoStore.filteredTodos.length }} of {{ todoStore.todos.length }} todos
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useTodoStore } from '@/stores/todoStore'

// Components
import TodoHeader from './TodoHeader.vue'
import TodoFiltersComponent from './TodoFilters.vue'
import TodoStats from './TodoStats.vue'
import TodoItem from './TodoItem.vue'
import TodoLoadingState from './TodoLoadingState.vue'
import TodoEmptyState from './TodoEmptyState.vue'
import TodoForm from './TodoForm.vue'

import type { Todo, TodoFilters } from '@/services/todoService'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

const showCreateForm = ref(false)
const editingTodo = ref<Todo | null>(null)

const filters = reactive<TodoFilters>({
  status: undefined,
  user_id: undefined,
  username: undefined
})

// Watch for filter changes
watch(filters, (newFilters) => {
  todoStore.updateFilters(newFilters)
  fetchTodos()
}, { deep: true })

// Also watch store filters to ensure UI updates
watch(() => todoStore.filters, (newStoreFilters) => {
  // Store filters updated
}, { deep: true })

const fetchTodos = async () => {
  await todoStore.fetchTodos(filters)
}

const handleFiltersUpdate = (newFilters: TodoFilters) => {
  Object.assign(filters, newFilters)
  todoStore.updateFilters(newFilters)
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

onMounted(async () => {
  await Promise.all([
    fetchTodos(),
    todoStore.fetchTodoStats()
  ])
})
</script>
