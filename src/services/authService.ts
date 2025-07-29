import api from '@/config/api'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role?: 'user' | 'admin'
}

export interface AuthResponse {
  message: string
  user: User
  access_token: string
  token_type: string
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/login', credentials)
      const { access_token, user } = response.data
      
      // Store token and user info
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/register', userData)
      const { access_token, user } = response.data
      
      // Store token and user info
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/user')
      return response.data.user
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },

  // Get user from localStorage
  getUser(): User | null {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getUser()
    return user?.role === 'admin'
  }
}
