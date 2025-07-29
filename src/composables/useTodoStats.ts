import { computed, ref, watch } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { useAuthStore } from '@/stores/authStore'
import type { TodoStats } from '@/services/todoService'

export function useTodoStats() {
  const todoStore = useTodoStore()
  const authStore = useAuthStore()
  
  // Auto-sync interval (in milliseconds)
  const syncInterval = ref(300000) // 5 minutes 
  let syncTimer: ReturnType<typeof setTimeout> | null = null

  // Real-time computed stats from local todos
  const realtimeStats = computed((): TodoStats => ({
    total_todos: todoStore.todos.length,
    completed_todos: todoStore.todos.filter(todo => todo.is_completed).length,
    incomplete_todos: todoStore.todos.filter(todo => !todo.is_completed).length,
    overdue_todos: todoStore.todos.filter(todo => todo.is_overdue).length
  }))

  // Combined stats (prioritize realtime, fallback to stored)
  const stats = computed(() => todoStore.currentStats)

  // Start periodic background sync
  const startAutoSync = (intervalMs = 300000) => {
    syncInterval.value = intervalMs
    stopAutoSync() // Clear existing timer
    
    syncTimer = setInterval(() => {
      todoStore.syncStatsWithBackend()
    }, intervalMs)
  }

  // Stop periodic sync
  const stopAutoSync = () => {
    if (syncTimer) {
      clearInterval(syncTimer)
      syncTimer = null
    }
  }

  // Manual sync with backend
  const syncStats = async () => {
    return await todoStore.syncStatsWithBackend()
  }

  // Check if user is admin for stats display purposes
  const isAdmin = computed(() => authStore.isAdmin)

  // Watch for significant changes in todos and update stats
  watch(
    () => todoStore.todos.length,
    () => {
      todoStore.updateStatsLocally()
    }
  )

  // Reactive stats with percentage calculations
  const statsWithPercentages = computed(() => {
    const current = stats.value
    const total = current.total_todos || 1 // Avoid division by zero
    
    return {
      ...current,
      completed_percentage: Math.round((current.completed_todos / total) * 100),
      incomplete_percentage: Math.round((current.incomplete_todos / total) * 100),
      overdue_percentage: Math.round((current.overdue_todos / total) * 100)
    }
  })

  return {
    // Reactive stats
    stats,
    realtimeStats,
    statsWithPercentages,
    
    // User info
    isAdmin,
    
    // Actions
    syncStats,
    startAutoSync,
    stopAutoSync,
    
    // Configuration
    syncInterval
  }
}
