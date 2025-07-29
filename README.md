# Vue.js Todo Client

A modern, responsive Vue.js 3 frontend for the Laravel Todo API system with real-time statistics, role-based access control, and seamless state management.

## 🏗️ **Project Structure**

This is the **frontend client** for the complete full-stack todo application:
- **Backend API**: `../laravel-api/` - Laravel API with authentication and todo management
- **Frontend Client** (this repo): Vue.js 3 SPA with Pinia state management

## ✨ **Features**

### 🔐 **Authentication & Authorization**
- **User Registration & Login** with token-based authentication
- **Role-based UI** (Admin vs Regular User views)
- **Persistent sessions** with automatic token refresh
- **Protected routes** with navigation guards

### ✅ **Todo Management**
- **Real-time CRUD operations** (Create, Read, Update, Delete)
- **Instant status updates** with optimistic UI updates
- **Status badges** (Pending, Completed, Overdue)
- **Due date management** with overdue detection
- **Bulk operations** (Mark all complete, Delete completed)

### 📊 **Smart Statistics**
- **Real-time stats** that update without API calls
- **Role-based statistics**:
  - **Users**: Personal todo statistics
  - **Admins**: System-wide statistics for all users  
- **Visual progress indicators** with animated progress bars
- **Background sync** with backend every 5 minutes
- **Manual sync** capability with loading states

### 🎨 **User Experience**
- **Responsive design** with Tailwind CSS
- **Smooth animations** and transitions
- **Loading states** and error handling
- **Confirmation dialogs** for destructive actions
- **Real-time visual feedback** for all operations

## 📋 Requirements

- Node.js 18+ 
- npm or yarn
- Laravel Todo API Backend running on `http://localhost:8000`

## ⚡ Quick Start

### 1. Installation

```bash
# Install dependencies
npm install
```

**Note**: This project uses the new `@tailwindcss/vite` plugin as recommended in the [official Tailwind CSS documentation for Vite](https://tailwindcss.com/docs/installation/using-vite).

### 2. Configuration

The application is configured to connect to your Laravel API at `http://localhost:8000/api`. If your backend runs on a different URL, update the `API_BASE_URL` in `src/config/api.ts`.

## 📁 **Project Structure**

```
src/
├── 📁 components/          # Reusable Vue components
│   ├── TodoStats.vue       # Real-time statistics component
│   ├── StatsDebugger.vue   # Debug component for development
│   └── ...
├── 📁 composables/         # Vue 3 composables (hooks)
│   ├── useTodoStats.ts     # Smart statistics management
│   ├── useWebSocket.ts     # WebSocket integration (future)
│   └── ...
├── 📁 services/            # API service layer
│   ├── authService.ts      # Authentication API calls
│   ├── todoService.ts      # Todo management API calls
│   └── api.ts              # Axios configuration
├── 📁 stores/              # Pinia state management
│   ├── authStore.ts        # Authentication state
│   ├── todoStore.ts        # Todo management state
│   └── ...
├── 📁 views/               # Page components
│   ├── TodoDashboard.vue   # Main dashboard
│   ├── LoginView.vue       # Login page
│   └── ...
├── 📁 router/              # Vue Router configuration
├── 📁 config/              # App configuration
└── main.ts                 # App entry point
```

## 🔧 **Key Components**

### **TodoStats Component**
Real-time statistics display with:
- Automatic updates when todos change
- Role-based data (personal vs system-wide)
- Visual progress indicators
- Manual sync capability

### **TodoDashboard View**
Main application interface featuring:
- Interactive todo list with status badges
- Real-time statistics panel
- Quick actions for bulk operations
- Responsive grid layout

### **Smart State Management**
- **Optimistic updates**: UI updates immediately, syncs with backend
- **Background sync**: Periodic synchronization with server
- **Error handling**: Graceful handling of network issues
- **Role awareness**: Different behavior for admin vs regular users

## 🎯 **Usage Examples**

### **User Registration**
```typescript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

await authStore.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: 'user'
})
```

### **Creating Todos**
```typescript
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()

await todoStore.createTodo({
  nama: 'Complete project',
  deskripsi: 'Finish the todo application',
  due_date: '2025-08-01'
})
```

### **Real-time Statistics**
```typescript
import { useTodoStats } from '@/composables/useTodoStats'

const { 
  stats,                    // Current statistics
  statsWithPercentages,     // Stats with percentage calculations
  realtimeStats,           // Live computed stats from local data
  syncStats,               // Manual sync function
  isAdmin                  // User role detection
} = useTodoStats()
```

## 🔄 **State Management Flow**

1. **User Action** → Component calls store method
2. **Optimistic Update** → UI updates immediately  
3. **API Call** → Request sent to Laravel backend
4. **State Sync** → Store updates with server response
5. **Statistics Update** → Stats automatically recalculated

This ensures the UI feels instant while maintaining data consistency.

## 🧪 **Development Features**

### **Debug Component**
Use `StatsDebugger.vue` to verify statistics accuracy:

```vue
<template>
  <div>
    <!-- Shows comparison between list count and stats -->
    <StatsDebugger />
    <TodoStats />
  </div>
</template>
```

### **Hot Module Replacement**
Development server supports HMR for instant updates during development.

### **TypeScript Support**
Full TypeScript integration with type checking and IntelliSense.

## 🌐 **API Integration**

The frontend integrates with these Laravel API endpoints:

### **Authentication**
- `POST /api/register` - User registration
- `POST /api/login` - User login  
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### **Todo Management**
- `GET /api/todos` - List todos (filtered by role)
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo
- `PATCH /api/todos/{id}/toggle` - Toggle completion

### **Statistics**
- `GET /api/my-todo-stats` - Personal statistics (users)
- `GET /api/admin/todo-stats` - System statistics (admins)

## 🔧 **Configuration**

### **API Configuration** (`src/config/api.ts`)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})
```

### **Router Configuration** (`src/router/index.ts`)
- Protected routes with authentication guards
- Role-based route access
- Automatic redirects for unauthenticated users

## 🚀 **Deployment**

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build
# Files generated in dist/ directory
```

### **Production Deployment**
1. Build the application: `npm run build`
2. Upload `dist/` contents to your web server
3. Configure your web server to serve the SPA
4. Update `VITE_API_BASE_URL` to point to production API

### **Environment Variables**
Create appropriate `.env.production` file:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME="Todo Application"
```

## 🛡️ **Security Features**

- **Token-based authentication** with automatic refresh
- **Protected API requests** with authorization headers
- **Role-based access control** in UI
- **XSS protection** through Vue.js templating
- **CSRF protection** via Laravel Sanctum

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 **License**

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🙏 **Acknowledgments**

- **Vue.js** - The Progressive JavaScript Framework
- **Pinia** - The Vue Store that you will enjoy using
- **Tailwind CSS** - Rapidly build modern websites
- **Laravel** - The PHP Framework For Web Artisans
- **Vite** - Next Generation Frontend Tooling

---

## 📞 **Support**

If you encounter any issues:

1. Check the browser console for errors
2. Verify the Laravel API is running and accessible
3. Ensure CORS is properly configured
4. Check network requests in browser dev tools

For API-related issues, refer to the Laravel API documentation in `../laravel-api/README.md`.

**Register**
```typescript
await authStore.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: 'user' // optional, defaults to 'user'
})
```

**Logout**
```typescript
await authStore.logout()
```

**Clear Errors**
```typescript
authStore.clearError()
```

### AuthService

Low-level authentication service that handles API calls.

#### Methods

```typescript
// Login user
authService.login(credentials: LoginCredentials): Promise<AuthResponse>

// Register user
authService.register(userData: RegisterData): Promise<AuthResponse>

// Logout user
authService.logout(): Promise<void>

// Get current user
authService.getCurrentUser(): Promise<User>

// Check authentication status
authService.isAuthenticated(): boolean

// Get user from localStorage
authService.getUser(): User | null

// Check admin status
authService.isAdmin(): boolean
```

## 📝 Todo Management Documentation

### TodoStore (Pinia Store)

The `useTodoStore()` manages todo state and operations.

#### State Properties

```typescript
interface TodoState {
  todos: Todo[]            // Array of todos
  stats: TodoStats | null  // Todo statistics
  loading: boolean         // Loading state
  error: string | null     // Error messages
  filters: TodoFilters     // Current filters
}
```

#### Getters

```typescript
// Get completed todos
const completedTodos = computed(() => state.todos.filter(todo => todo.is_completed))

// Get incomplete todos  
const incompleteTodos = computed(() => state.todos.filter(todo => !todo.is_completed))

// Get overdue todos
const overdueTodos = computed(() => state.todos.filter(todo => todo.is_overdue))

// Get total count
const todosCount = computed(() => state.todos.length)
```

#### Actions

**Fetch Todos**
```typescript
await todoStore.fetchTodos({
  status: 'completed',  // 'completed' | 'incomplete' | 'overdue' | undefined
  user_id: 2           // Filter by user ID (admin only)
})
```

**Create Todo**
```typescript
await todoStore.createTodo({
  nama: 'Learn Vue.js',
  deskripsi: 'Complete Vue.js tutorial',
  due_date: '2025-12-31',
  user_id: 2  // Optional, admin only
})
```

**Update Todo**
```typescript
await todoStore.updateTodo(todoId, {
  nama: 'Updated name',
  deskripsi: 'Updated description',
  due_date: '2025-12-31'
})
```

**Delete Todo**
```typescript
await todoStore.deleteTodo(todoId)
```

**Toggle Completion**
```typescript
await todoStore.toggleTodo(todoId)
```

**Fetch Statistics**
```typescript
await todoStore.fetchTodoStats()
```

### TodoService

Low-level todo service for API operations.

#### Types

```typescript
interface Todo {
  id: number
  nama: string                    // Todo name
  deskripsi: string              // Todo description
  due_date: string | null        // Due date (YYYY-MM-DD)
  completed_at: string | null    // Completion timestamp
  is_completed: boolean          // Completion status
  is_overdue: boolean           // Overdue status
  user: {                       // Owner information
    id: number
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

interface TodoStats {
  total_todos: number
  completed_todos: number
  incomplete_todos: number
  overdue_todos: number
}
```

## 🎨 Component Documentation

### LoginForm.vue

Login form component with validation and error handling.

**Features:**
- Email/password input with validation
- Loading states during authentication
- Error message display
- Link to registration form
- Test account information display

**Usage:**
```vue
<LoginForm />
```

### RegisterForm.vue

User registration form component.

**Features:**
- Full name, email, password, and confirmation inputs
- Form validation
- Loading states
- Error handling
- Link to login form

**Usage:**
```vue
<RegisterForm />
```

### TodoForm.vue

Modal form for creating and editing todos.

**Props:**
- `todo?: Todo | null` - Todo to edit (null for create mode)

**Events:**
- `@close` - Emitted when modal should close
- `@saved` - Emitted when todo is successfully saved

**Features:**
- Create/edit mode detection
- Form validation
- Admin user assignment (create mode only)
- Loading states and error handling

**Usage:**
```vue
<TodoForm 
  :todo="editingTodo"
  @close="closeModal"
  @saved="handleSaved"
/>
```

### TodoList.vue

Main dashboard component displaying todos and statistics.

**Features:**
- Todo statistics cards
- Filtering by status and user
- Todo list with visual indicators
- Action buttons (complete, edit, delete)
- Responsive design
- Admin-specific features

**Todo Visual Indicators:**
- ✅ **Completed**: Green border, line-through text
- ❗ **Overdue**: Red border and badge
- 🔵 **Pending**: Blue border and badge

**Usage:**
```vue
<TodoList />
```

## 🔧 Configuration Documentation

### API Configuration (`src/config/api.ts`)

Axios instance with request/response interceptors.

**Features:**
- Automatic token injection
- Base URL configuration
- Response error handling
- Auto-logout on 401 responses

**Configuration:**
```typescript
const API_BASE_URL = 'http://localhost:8000/api'

// Request interceptor adds Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor handles 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on token expiration
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Router Configuration (`src/router/index.ts`)

Vue Router setup with authentication guards.

**Routes:**
- `/login` - Login page (guest only)
- `/register` - Registration page (guest only)  
- `/todos` - Todo dashboard (authenticated only)
- `/` - Redirects to `/todos`

**Navigation Guards:**
```typescript
router.beforeEach((to, _from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')  // Redirect to login
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/todos')  // Redirect to todos
  } else {
    next()  // Allow navigation
  }
})
```

## 🔐 Default Test Accounts

| Role  | Email              | Password |
|-------|-------------------|----------|
| Admin | admin@example.com | password |
| User  | user@example.com  | password |

## 📝 Todo Features

### Requirements Implemented:
1. ✅ **Frontend SPA** - Single Page Application with Vue.js
2. ✅ **API Backend Connection** - Connects to Laravel Todo API
3. ✅ **Todo Name** - Each todo has a name field (`nama`)
4. ✅ **Todo Description** - Each todo has a description field (`deskripsi`)
5. ✅ **Due Date** - Each todo has an optional due date
6. ✅ **Completed Line Through** - Completed todos show with line-through styling
7. ✅ **Role-based Access** - Admin can manage all todos, users only their own

### Additional Features:
- Real-time todo statistics
- Overdue detection with visual indicators
- Responsive design for all devices
- Loading states and error handling
- Token-based authentication with auto-logout

## 🚀 Building for Production

```bash
npm run build
```

## 🧪 Testing Guide

### Manual Testing Steps

1. **Authentication Testing**
   ```bash
   # Start both backend and frontend
   # Backend: php artisan serve (Laravel)
   # Frontend: npm run dev (Vue.js)
   ```

2. **Login Testing**
   - Visit `http://localhost:5173`
   - Should redirect to `/login`
   - Try invalid credentials → Should show error
   - Login with `admin@example.com` / `password` → Should redirect to todos

3. **Todo Management Testing**
   - Create new todo with all fields
   - Edit existing todo
   - Mark todo as complete → Should show line-through
   - Delete todo → Should show confirmation

4. **Role Testing**
   - Login as admin → Should see all users' todos
   - Login as user → Should see only own todos
   - Admin should see user filter option

## 🐛 Troubleshooting

### Common Issues

**1. CORS Errors**
```bash
# Ensure Laravel backend CORS is configured for localhost:5173
# In Laravel .env:
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

**2. Authentication Issues**
```javascript
// Clear localStorage in browser console
localStorage.clear()
// Then refresh page
```

**3. API Connection Issues**  
- Verify Laravel backend is running on `http://localhost:8000`
- Check Laravel logs: `storage/logs/laravel.log`
- Test API endpoints with Postman first

**4. Tailwind CSS Issues**
```bash
# Ensure @tailwindcss/vite is installed
npm list @tailwindcss/vite
# Should show version number
```

### Debug Tips

**Store Debugging:**
```vue
<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// Debug current state
console.log('Auth state:', {
  user: authStore.user,
  token: authStore.token,
  isAuthenticated: authStore.isAuthenticated
})
</script>
```

**API Debugging:**
```javascript
// Check network tab in browser DevTools
// Look for API calls and their responses
// Check request headers include Authorization: Bearer token
```

## 📚 Learning Resources

- [Vue.js 3 Documentation](https://vuejs.org/)
- [Pinia State Management](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

---

**Happy coding! 🎉**
