import api from '@/config/api'

export interface Todo {
  id: number
  nama: string
  deskripsi: string
  due_date: string | null
  completed_at: string | null
  is_completed: boolean
  is_overdue: boolean
  user: {
    id: number
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

export interface CreateTodoData {
  nama: string
  deskripsi: string
  due_date?: string
  user_id?: number
}

export interface UpdateTodoData {
  nama?: string
  deskripsi?: string
  due_date?: string
}

export interface TodoFilters {
  status?: 'completed' | 'incomplete' | 'overdue'
  user_id?: number
  username?: string
}

export interface TodoStats {
  total_todos: number
  completed_todos: number
  incomplete_todos: number
  overdue_todos: number
}

export interface AdminTodoStats extends TodoStats {
  total_users: number
  users_with_todos: number
  todos_by_user: Array<{
    id: number
    name: string
    email: string
    todos_count: number
    completed_todos_count: number
  }>
}

export const todoService = {
  // Get all todos
  async getTodos(filters: TodoFilters = {}): Promise<{ data: Todo[], meta: any }> {
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof TodoFilters]
        if (value) {
          params.append(key, value.toString())
        }
      })
      
      const queryString = params.toString()
      const response = await api.get(`/todos?${queryString}`)
      
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Get specific todo
  async getTodo(id: number): Promise<Todo> {
    try {
      const response = await api.get(`/todos/${id}`)
      return response.data.todo
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Create todo
  async createTodo(todoData: CreateTodoData): Promise<{ todo: Todo, message: string }> {
    try {
      const response = await api.post('/todos', todoData)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Update todo
  async updateTodo(id: number, todoData: UpdateTodoData): Promise<{ todo: Todo, message: string }> {
    try {
      const response = await api.put(`/todos/${id}`, todoData)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Delete todo
  async deleteTodo(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/todos/${id}`)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Toggle todo completion
  async toggleTodo(id: number): Promise<{ todo: Todo, message: string }> {
    try {
      const response = await api.patch(`/todos/${id}/toggle`)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Get todo statistics
  async getTodoStats(): Promise<TodoStats> {
    try {
      const response = await api.get('/my-todo-stats')
      return response.data.statistics
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Admin: Get all todo statistics
  async getAdminTodoStats(): Promise<AdminTodoStats> {
    try {
      const response = await api.get('/admin/todo-stats')
      return { ...response.data.statistics, todos_by_user: response.data.todos_by_user }
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  }
}
