import { ref, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { useAuthStore } from '@/stores/authStore'

export function useWebSocket() {
  const todoStore = useTodoStore()
  const authStore = useAuthStore()
  
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectInterval = ref<ReturnType<typeof setTimeout> | null>(null)
  const maxReconnectAttempts = 5
  const reconnectAttempts = ref(0)

  const connect = () => {
    if (!authStore.token) {
      console.warn('No auth token available for WebSocket connection')
      return
    }

    try {
      // Connect to your Laravel WebSocket server (you'll need to implement this)
      socket.value = new WebSocket(`ws://localhost:8080?token=${authStore.token}`)

      socket.value.onopen = () => {
        console.log('WebSocket connected')
        isConnected.value = true
        reconnectAttempts.value = 0
      }

      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      socket.value.onclose = () => {
        console.log('WebSocket disconnected')
        isConnected.value = false
        scheduleReconnect()
      }

      socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        isConnected.value = false
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      scheduleReconnect()
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
    if (reconnectInterval.value) {
      clearTimeout(reconnectInterval.value)
      reconnectInterval.value = null
    }
    isConnected.value = false
  }

  const scheduleReconnect = () => {
    if (reconnectAttempts.value < maxReconnectAttempts) {
      reconnectInterval.value = setTimeout(() => {
        reconnectAttempts.value++
        console.log(`Reconnecting... Attempt ${reconnectAttempts.value}`)
        connect()
      }, Math.pow(2, reconnectAttempts.value) * 1000) // Exponential backoff
    }
  }

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'todo_created':
        // Add new todo to the store
        todoStore.todos.unshift(data.todo)
        todoStore.updateStatsLocally()
        break
        
      case 'todo_updated':
        // Update existing todo
        const updateIndex = todoStore.todos.findIndex(t => t.id === data.todo.id)
        if (updateIndex !== -1) {
          todoStore.todos[updateIndex] = data.todo
          todoStore.updateStatsLocally()
        }
        break
        
      case 'todo_deleted':
        // Remove todo from store
        todoStore.todos = todoStore.todos.filter(t => t.id !== data.todo_id)
        todoStore.updateStatsLocally()
        break
        
      case 'todo_toggled':
        // Update todo completion status
        const toggleIndex = todoStore.todos.findIndex(t => t.id === data.todo.id)
        if (toggleIndex !== -1) {
          todoStore.todos[toggleIndex] = data.todo
          todoStore.updateStatsLocally()
        }
        break
        
      case 'stats_updated':
        // Update stats directly from server
        todoStore.stats = data.stats
        break
        
      default:
        console.log('Unknown WebSocket message type:', data.type)
    }
  }

  const sendMessage = (message: any) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  }
}
