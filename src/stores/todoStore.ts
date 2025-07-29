import { defineStore } from 'pinia'
import { todoService, type Todo, type CreateTodoData, type UpdateTodoData, type TodoFilters, type TodoStats } from '@/services/todoService'

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
      status: undefined,
      user_id: undefined
    }
  }),

  getters: {
    completedTodos: (state) => state.todos.filter(todo => todo.is_completed),
    incompleteTodos: (state) => state.todos.filter(todo => !todo.is_completed),
    overdueTodos: (state) => state.todos.filter(todo => todo.is_overdue),
    todosCount: (state) => state.todos.length
  },

  actions: {
    async fetchTodos(filters: TodoFilters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await todoService.getTodos({ ...this.filters, ...filters })
        this.todos = response.data
        return response
      } catch (error: any) {
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
        this.stats = await todoService.getTodoStats()
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
    }
  }
})
