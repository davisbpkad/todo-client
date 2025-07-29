<template>
  <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
    <h4 class="text-sm font-medium text-yellow-800 mb-2">Debug: Stats vs Todos Count</h4>
    
    <div class="grid grid-cols-2 gap-4 text-xs">
      <div>
        <strong>From Todo List:</strong>
        <ul class="mt-1 space-y-1">
          <li>Total in list: {{ todoStore.todos.length }}</li>
          <li>Completed in list: {{ todoStore.todos.filter(t => t.is_completed).length }}</li>
          <li>Incomplete in list: {{ todoStore.todos.filter(t => !t.is_completed).length }}</li>
          <li>Overdue in list: {{ todoStore.todos.filter(t => t.is_overdue).length }}</li>
        </ul>
      </div>
      
      <div>
        <strong>From Stats API:</strong>
        <ul class="mt-1 space-y-1">
          <li>Total from stats: {{ stats.total_todos }}</li>
          <li>Completed from stats: {{ stats.completed_todos }}</li>
          <li>Incomplete from stats: {{ stats.incomplete_todos }}</li>  
          <li>Overdue from stats: {{ stats.overdue_todos }}</li>
        </ul>
      </div>
    </div>
    
    <div class="mt-3 pt-2 border-t border-yellow-200">
      <p class="text-xs text-yellow-700">
        <strong>User Role:</strong> {{ isAdmin ? 'Admin (should see all todos)' : 'Regular User (sees own todos)' }}
      </p>
      <p class="text-xs text-yellow-700 mt-1">
        <strong>Stats Endpoint:</strong> {{ isAdmin ? '/admin/todo-stats' : '/my-todo-stats' }}
      </p>
    </div>
    
    <button 
      @click="refreshStats" 
      class="mt-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
    >
      Refresh Stats
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '@/stores/todoStore'
import { useTodoStats } from '@/composables/useTodoStats'

const todoStore = useTodoStore()
const { stats, isAdmin, syncStats } = useTodoStats()

const refreshStats = async () => {
  await syncStats()
}
</script>
