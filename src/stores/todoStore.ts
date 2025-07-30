import { defineStore } from 'pinia'
import { todoService, type Todo, type CreateTodoData, type UpdateTodoData, type TodoFilters, type TodoStats } from '@/services/todoService'
import { useAuthStore } from '@/stores/authStore'

interface TodoState {
  todos: Todo[]
  stats: TodoStats | null
  loading: boolean
  error: string | null
  filters: TodoFilters
}

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    stats: null,
    loading: false,
    error: null,
    filters: {
      username: undefined
    }
  }),

  getters: {
    completedTodos: (state) => state.todos.filter(todo => todo.is_completed),
    incompleteTodos: (state) => state.todos.filter(todo => !todo.is_completed),
    overdueTodos: (state) => state.todos.filter(todo => todo.is_overdue),
    todosCount: (state) => state.todos.length,
    
    // Computed stats from local todos (real-time)
    computedStats: (state): TodoStats => ({
      total_todos: state.todos.length,
      completed_todos: state.todos.filter(todo => todo.is_completed).length,
      incomplete_todos: state.todos.filter(todo => !todo.is_completed).length,
      overdue_todos: state.todos.filter(todo => todo.is_overdue).length
    }),
    
    // Use computed stats if available, fallback to fetched stats
    currentStats: (state) => state.stats || {
      total_todos: state.todos.length,
      completed_todos: state.todos.filter(todo => todo.is_completed).length,
      incomplete_todos: state.todos.filter(todo => !todo.is_completed).length,
      overdue_todos: state.todos.filter(todo => todo.is_overdue).length
    }
  },

  actions: {
    async fetchTodos(filters: TodoFilters = {}) {
      this.loading = true
      this.error = null
      
      try {
        console.log('🏪 Store: fetchTodos called with filters:', filters)
        console.log('🏪 Store: current store filters:', this.filters)
        
        // Use the passed filters, not the store filters
        const response = await todoService.getTodos(filters)
        this.todos = response.data
        
        console.log('🏪 Store: fetched', response.data.length, 'todos')
        
        return response
      } catch (error: any) {
        console.error('🏪 Store: fetchTodos error:', error)
        this.error = error.message || 'Failed to fetch todos'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTodo(todoData: CreateTodoData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await todoService.createTodo(todoData)
        this.todos.unshift(response.todo)
        
        // Update stats locally for immediate UI response
        this.updateStatsLocally()
        
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to create todo'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTodo(id: number, todoData: UpdateTodoData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await todoService.updateTodo(id, todoData)
        const index = this.todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
          this.todos[index] = response.todo
        }
        
        // Update stats locally for immediate UI response
        this.updateStatsLocally()
        
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to update todo'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTodo(id: number) {
      this.loading = true
      this.error = null
      
      try {
        await todoService.deleteTodo(id)
        this.todos = this.todos.filter(todo => todo.id !== id)
        
        // Update stats locally for immediate UI response
        this.updateStatsLocally()
        
      } catch (error: any) {
        this.error = error.message || 'Failed to delete todo'
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleTodo(id: number) {
      this.loading = true
      this.error = null
      
      try {
        const response = await todoService.toggleTodo(id)
        const index = this.todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
          this.todos[index] = response.todo
        }
        
        // Update stats locally for immediate UI response
        this.updateStatsLocally()
        
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to toggle todo'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTodoStats() {
      try {
        const authStore = useAuthStore()
        
        // Use admin stats endpoint for admins, user stats for regular users
        if (authStore.isAdmin) {
          const adminStats = await todoService.getAdminTodoStats()
          // Convert admin stats to regular TodoStats format
          this.stats = {
            total_todos: adminStats.total_todos,
            completed_todos: adminStats.completed_todos,
            incomplete_todos: adminStats.incomplete_todos,
            overdue_todos: adminStats.overdue_todos
          }
        } else {
          this.stats = await todoService.getTodoStats()
        }
        
        return this.stats
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch statistics'
        throw error
      }
    },

    setFilters(filters: TodoFilters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearError() {
      this.error = null
    },

    // Update stats locally based on current todos
    updateStatsLocally() {
      if (this.stats) {
        // For both admin and regular users, compute stats from current todos in store
        // Since admin sees all todos and user sees only their todos, this works correctly
        this.stats = {
          total_todos: this.todos.length,
          completed_todos: this.todos.filter(todo => todo.is_completed).length,
          incomplete_todos: this.todos.filter(todo => !todo.is_completed).length,
          overdue_todos: this.todos.filter(todo => todo.is_overdue).length
        }
      }
    },

    // Sync with backend stats (call periodically or when needed)
    async syncStatsWithBackend() {
      try {
        const authStore = useAuthStore()
        
        // Use admin stats endpoint for admins, user stats for regular users
        if (authStore.isAdmin) {
          const adminStats = await todoService.getAdminTodoStats()
          // Convert admin stats to regular TodoStats format
          this.stats = {
            total_todos: adminStats.total_todos,
            completed_todos: adminStats.completed_todos,
            incomplete_todos: adminStats.incomplete_todos,
            overdue_todos: adminStats.overdue_todos
          }
        } else {
          this.stats = await todoService.getTodoStats()
        }
        
        return this.stats
      } catch (error: any) {
        console.warn('Failed to sync stats with backend:', error.message)
        // Don't throw error to avoid breaking UI
      }
    },

    // Initialize store with todos and stats
    async initialize() {
      try {
        await Promise.all([
          this.fetchTodos(),
          this.fetchTodoStats()
        ])
      } catch (error) {
        console.error('Failed to initialize todo store:', error)
      }
    }
  }
})
