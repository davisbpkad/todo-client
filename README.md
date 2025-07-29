# Todo Client - Vue.js Frontend

A modern Vue.js 3 + TypeScript + Vite frontend application that connects to the Laravel Todo API backend. Features role-based authentication, complete todo management, and a responsive UI built with Tailwind CSS.

## 🚀 Features

- **Authentication System**
  - User registration and login
  - Role-based access control (User & Admin)
  - JWT token authentication with Laravel Sanctum
  - Auto-redirect on token expiration

- **Todo Management**
  - Create, read, update, delete todos
  - Todo completion with visual line-through
  - Due date tracking with overdue detection
  - Rich todo descriptions
  - Real-time statistics dashboard

- **Admin Features**
  - View all users' todos
  - Create todos for any user
  - Advanced filtering by user and status
  - System-wide todo statistics

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Clean, intuitive interface
  - Loading states and error handling
  - Modal forms for todo creation/editing

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

### 3. Start Development Server

```bash
npm run dev
```

Your application will be available at: `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # Vue components
│   ├── LoginForm.vue    # Login form component
│   ├── RegisterForm.vue # Registration form component
│   ├── TodoForm.vue     # Todo creation/editing modal
│   └── TodoList.vue     # Main todo list with stats
├── config/
│   └── api.ts           # Axios configuration with interceptors
├── router/
│   └── index.ts         # Vue Router configuration
├── services/
│   ├── authService.ts   # Authentication API calls
│   └── todoService.ts   # Todo management API calls
├── stores/
│   ├── authStore.ts     # Pinia store for authentication
│   └── todoStore.ts     # Pinia store for todo management
├── App.vue              # Root component
├── main.ts              # Application entry point
└── style.css            # Global styles with Tailwind CSS
```

## 🔐 Authentication Documentation

### AuthStore (Pinia Store)

The `useAuthStore()` manages all authentication state and operations.

#### State Properties

```typescript
interface AuthState {
  user: User | null        // Current authenticated user
  token: string | null     // JWT access token
  loading: boolean         // Loading state for auth operations
  error: string | null     // Error message from auth operations
}
```

#### Getters

```typescript
// Check if user is authenticated
const isAuthenticated = computed(() => !!state.token)

// Check if user has admin role
const isAdmin = computed(() => state.user?.role === 'admin')

// Get user display name
const userName = computed(() => state.user?.name || 'Guest')
```

#### Actions

**Login**
```typescript
await authStore.login({
  email: 'user@example.com',
  password: 'password'
})
```

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
