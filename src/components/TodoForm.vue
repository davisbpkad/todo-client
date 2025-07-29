<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" @click="$emit('close')">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 text-center">
          {{ todo ? 'Edit Todo' : 'Create New Todo' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
          <div>
            <label for="nama" class="block text-sm font-medium text-gray-700">Todo Name</label>
            <input
              id="nama"
              v-model="form.nama"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter todo name"
            />
          </div>
          
          <div>
            <label for="deskripsi" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="deskripsi"
              v-model="form.deskripsi"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter todo description"
            ></textarea>
          </div>
          
          <div>
            <label for="due_date" class="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              id="due_date"
              v-model="form.due_date"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <!-- Admin can assign todos to users -->
          <div v-if="authStore.isAdmin && !todo">
            <label for="user_id" class="block text-sm font-medium text-gray-700">Assign to User (Optional)</label>
            <input
              id="user_id"
              v-model.number="form.user_id"
              type="number"
              min="1"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter user ID (leave empty for yourself)"
            />
            <p class="mt-1 text-xs text-gray-500">Leave empty to assign to yourself</p>
          </div>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Saving...' : (todo ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useTodoStore } from '@/stores/todoStore'
import type { Todo } from '@/services/todoService'

interface Props {
  todo?: Todo | null
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const todoStore = useTodoStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  nama: '',
  deskripsi: '',
  due_date: '',
  user_id: undefined as number | undefined
})

// Watch for changes in todo prop to populate form
watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    form.nama = newTodo.nama
    form.deskripsi = newTodo.deskripsi
    form.due_date = newTodo.due_date || ''
  } else {
    // Reset form for new todo
    form.nama = ''
    form.deskripsi = ''
    form.due_date = ''
    form.user_id = undefined
  }
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (props.todo) {
      // Update existing todo
      const updateData = {
        nama: form.nama,
        deskripsi: form.deskripsi,
        due_date: form.due_date || undefined
      }
      await todoStore.updateTodo(props.todo.id, updateData)
    } else {
      // Create new todo
      const createData = {
        nama: form.nama,
        deskripsi: form.deskripsi,
        due_date: form.due_date || undefined,
        user_id: form.user_id
      }
      await todoStore.createTodo(createData)
    }
    
    emit('saved')
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
