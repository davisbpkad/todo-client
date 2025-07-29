import { defineStore } from 'pinia'
import { authService, type User, type LoginCredentials, type RegisterData } from '@/services/authService'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: authService.getUser(),
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || 'Guest'
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.login(credentials)
        this.user = response.user
        this.token = response.access_token
        return response
      } catch (error: any) {
        this.error = error.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData: RegisterData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.register(userData)
        this.user = response.user
        this.token = response.access_token
        return response
      } catch (error: any) {
        this.error = error.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
