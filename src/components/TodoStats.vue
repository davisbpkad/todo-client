<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Todo Statistics</h3>
        <p class="text-xs text-gray-500 mt-1">
          {{ isAdmin ? 'Showing stats for all users' : 'Showing your personal stats' }}
        </p>
      </div>
      
      <!-- Sync controls -->
      <div class="flex items-center gap-2">
        <button
          @click="handleSync"
          :disabled="syncing"
          class="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          title="Sync with server"
        >
          <svg 
            :class="{ 'animate-spin': syncing }" 
            class="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <!-- Real-time indicator -->
        <div class="flex items-center gap-1 text-xs text-green-600">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Real-time
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total Todos -->
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {{ statsWithPercentages.total_todos }}
        </div>
        <div class="text-sm text-gray-600">Total</div>
      </div>

      <!-- Completed Todos -->
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">
          {{ statsWithPercentages.completed_todos }}
        </div>
        <div class="text-sm text-gray-600">Completed</div>
        <div class="text-xs text-green-500">
          {{ statsWithPercentages.completed_percentage }}%
        </div>
      </div>

      <!-- Incomplete Todos -->
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">
          {{ statsWithPercentages.incomplete_todos }}
        </div>
        <div class="text-sm text-gray-600">Pending</div>
        <div class="text-xs text-blue-500">
          {{ statsWithPercentages.incomplete_percentage }}%
        </div>
      </div>

      <!-- Overdue Todos -->
      <div class="text-center">
        <div class="text-2xl font-bold text-red-600">
          {{ statsWithPercentages.overdue_todos }}
        </div>
        <div class="text-sm text-gray-600">Overdue</div>
        <div class="text-xs text-red-500">
          {{ statsWithPercentages.overdue_percentage }}%
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mt-6">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{{ statsWithPercentages.completed_percentage }}% Complete</span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${statsWithPercentages.completed_percentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Last Updated -->
    <div class="mt-4 text-xs text-gray-500 text-center">
      Updates automatically as you work
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTodoStats } from '@/composables/useTodoStats'

const { statsWithPercentages, isAdmin, syncStats, startAutoSync, stopAutoSync } = useTodoStats()

const syncing = ref(false)

const handleSync = async () => {
  syncing.value = true
  try {
    await syncStats()
  } finally {
    syncing.value = false
  }
}

onMounted(() => {
  // Start auto-sync every 5 minutes
  startAutoSync(300000)
})

onUnmounted(() => {
  stopAutoSync()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
