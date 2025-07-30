# Vue.js Todo Client

A modern, responsive Vue.js 3 frontend for the Laravel Todo API system with real-time statistics, role-based access control, comprehensive filtering, and modular architecture.

## 🏗️ **Project Structure**

This is the **frontend client** for the complete full-stack todo application:
- **Backend API**: `../laravel-api/` - Laravel API with authentication and todo management
- **Frontend Client** (this repo): Vue.js 3 SPA with modular component architecture

## ✨ **Features**

### 🔐 **Authentication & Authorization**
- **Laravel Sanctum** token-based authentication
- **Role-based access control** (Admin vs Regular User)
- **Persistent sessions** with automatic token refresh
- **Protected routes** with navigation guards
- **CSRF protection** for enhanced security

### ✅ **Todo Management**
- **Real-time CRUD operations** (Create, Read, Update, Delete)
- **Instant status updates** with optimistic UI updates
- **Status badges** (Pending, Completed, Overdue)
- **Due date management** with automatic overdue detection
- **User ownership** - Users see only their todos, Admins see all

### 🔍 **Advanced Filtering System**
- **Status Filtering**: All Status, Completed, Incomplete, Overdue
- **User ID Filtering**: Admin can filter by specific user ID
- **Username Search**: Real-time search by username or email
- **Hybrid Filtering**: Both client-side and server-side filtering
- **Real-time Filter Updates**: Instant results without page refresh

### 📊 **Smart Statistics**
- **Real-time stats** calculated on the frontend for responsiveness
- **Role-based statistics**:
  - **Users**: Personal todo statistics
  - **Admins**: System-wide statistics for all users  
- **Visual progress indicators** with animated progress bars
- **Auto-updating stats** that respond to any todo changes
- **Background sync** with backend periodically

### 🎨 **User Experience**
- **Modular component architecture** for maintainability
- **Responsive design** with Tailwind CSS
- **Smooth animations** and transitions
- **Loading states** and error handling
- **Empty states** with helpful messaging
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

### 3. Development

```bash
# Start development server
npm run dev
```

## 🏗️ **Modular Architecture**

The application follows a modular component architecture for better maintainability:

```
src/
├── 📁 components/          # Modular Vue components
│   ├── TodoHeader.vue      # Header with user info and actions
│   ├── TodoFilters.vue     # Advanced filtering component
│   ├── TodoStats.vue       # Real-time statistics display
│   ├── TodoItem.vue        # Individual todo item component
│   ├── TodoLoadingState.vue # Loading state component
│   ├── TodoEmptyState.vue  # Empty state with helpful messaging
│   └── HelloWorld.vue      # Example component
├── 📁 composables/         # Vue 3 composables (hooks)
│   ├── useTodoStats.ts     # Smart statistics management
│   ├── useWebSocket.ts     # Real-time WebSocket integration
│   └── ...
├── 📁 services/            # API service layer
│   ├── authService.ts      # Authentication API calls
│   ├── todoService.ts      # Todo management with filtering
│   └── api.ts              # Axios configuration with Sanctum
├── 📁 stores/              # Pinia state management
│   ├── authStore.ts        # Authentication state
│   ├── todoStore.ts        # Todo management with filtering
│   └── ...
├── 📁 views/               # Page components
│   ├── TodoList.vue        # Main todo list (refactored modular)
│   ├── LoginView.vue       # Login page
│   ├── RegisterView.vue    # Registration page
│   └── ...
├── 📁 router/              # Vue Router configuration
├── 📁 config/              # App configuration
└── main.ts                 # App entry point
```

## 🔧 **Key Components**

### **Modular Component Architecture**

#### **TodoFilters.vue**
Advanced filtering component with:
- **Status Dropdown**: Filter by All Status, Completed, Incomplete, Overdue
- **User ID Input**: Admin-only feature to filter by specific user ID
- **Username Search**: Real-time search by username or email
- **Responsive Layout**: Adapts to mobile and desktop screens

#### **TodoStats.vue**
Real-time statistics display with:
- **Frontend Calculation**: Instant updates without API calls
- **Role-based Data**: Personal stats for users, system-wide for admins
- **Visual Progress**: Animated progress bars and counters
- **Auto-refresh**: Updates automatically when todos change

#### **TodoItem.vue**
Individual todo component featuring:
- **Quick Toggle**: One-click status change
- **Inline Editing**: Edit directly in the list
- **Status Badges**: Visual indicators for pending/completed/overdue
- **Due Date Display**: Clear date formatting with overdue warnings

#### **TodoList.vue (Refactored)**
Main container component (reduced from 380 to ~100 lines):
- **Component Composition**: Uses all modular components
- **Filtered Data**: Displays filtered todos from store
- **Event Handling**: Manages filter updates and user interactions
- **Loading States**: Proper loading and empty states

### **Smart State Management**
- **Hybrid Filtering**: Both client-side (instant) and server-side filtering
- **Optimistic Updates**: UI updates immediately, syncs with backend
- **Role Awareness**: Different behavior for admin vs regular users
- **Error Handling**: Graceful handling of network issues

## 🔍 **Filtering System**

### **Status Filtering**
```typescript
// Filter by completion status
filters: {
  status: 'completed' | 'incomplete' | 'overdue' | undefined
}
```

### **User Filtering (Admin Only)**
```typescript
// Filter by specific user ID
filters: {
  user_id: number | undefined
}
```

### **Username Search**
```typescript
// Search by username or email
filters: {
  username: string | undefined
}
```

## 🎯 **Usage Examples**

### **Authentication**
```typescript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// Register new user
await authStore.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: 'user'
})

// Login user
await authStore.login({
  email: 'john@example.com',
  password: 'password123'
})
```

### **Todo Management**
```typescript
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()

// Create new todo
await todoStore.createTodo({
  nama: 'Complete project',
  deskripsi: 'Finish the todo application',
  due_date: '2025-08-01'
})

// Toggle todo status
await todoStore.toggleTodo(todoId)

// Update todo
await todoStore.updateTodo(todoId, {
  nama: 'Updated todo name',
  deskripsi: 'Updated description'
})
```

### **Filtering Todos**
```typescript
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()

// Get filtered todos (computed getter)
const filteredTodos = todoStore.filteredTodos

// Update filters
todoStore.updateFilters({
  status: 'completed',
  user_id: 5,
  username: 'john'
})

// Fetch todos with server-side filtering
await todoStore.fetchTodos({
  status: 'incomplete',
  username: 'john'
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

### **Todo Operations**
1. **User Action** → Component calls store method
2. **Optimistic Update** → UI updates immediately  
3. **API Call** → Request sent to Laravel backend
4. **State Sync** → Store updates with server response
5. **Statistics Update** → Stats automatically recalculated

### **Filtering Flow**
1. **Filter Change** → TodoFilters.vue emits update:filters
2. **Store Update** → TodoList.vue calls todoStore.updateFilters()
3. **Client Filtering** → filteredTodos getter filters todos array
4. **Server Filtering** → Optional API call with filter parameters
5. **UI Update** → Filtered results displayed instantly

This ensures the UI feels instant while maintaining data consistency.

## 🧪 **Development Features**

### **TypeScript Support**
Full TypeScript integration with type checking and IntelliSense for:
- **Component Props**: Strongly typed component interfaces
- **Store State**: Type-safe Pinia stores
- **API Responses**: Comprehensive type definitions
- **Filter Interfaces**: TodoFilters interface for filtering system

### **Hot Module Replacement**
Development server supports HMR for instant updates during development.

### **Production Ready**
- All debugging features removed for production deployment
- Clean, maintainable code with modular architecture
- Optimized build configuration with Vite

## 🌐 **API Integration**

The frontend integrates with these Laravel API endpoints:

### **Authentication (Laravel Sanctum)**
- `POST /api/register` - User registration with role assignment
- `POST /api/login` - User login with token generation
- `POST /api/logout` - User logout with token revocation
- `GET /api/user` - Get current authenticated user

### **Todo Management**
- `GET /api/todos` - List todos with filtering support
  - Query params: `status`, `user_id`, `username`
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo
- `PATCH /api/todos/{id}/toggle` - Toggle completion status

### **Statistics**
- `GET /api/my-todo-stats` - Personal statistics (users)
- `GET /api/admin/todo-stats` - System-wide statistics (admins)

### **Enhanced Security**
- **CSRF Protection**: Automatic CSRF token handling
- **Bearer Token**: Authorization header for all requests
- **Request Interceptors**: Automatic token attachment
- **Response Interceptors**: Error handling and token refresh

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
## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### **API Configuration** (`src/config/api.ts`)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // For CSRF cookie
})
```

### **Router Configuration** (`src/router/index.ts`)
- **Protected routes** with authentication guards
- **Role-based route access** (admin vs user)
- **Automatic redirects** for unauthenticated users
- **Route meta** for role requirements

## 🚀 **Deployment**

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

## 🛡️ **Security Features**

- **Laravel Sanctum** token-based authentication with CSRF protection
- **Protected API requests** with automatic authorization headers
- **Role-based access control** throughout the UI
- **XSS protection** through Vue.js templating and sanitization
- **Input validation** on both frontend and backend
- **Secure token storage** with automatic cleanup on logout

## 📊 **Performance Features**

- **Frontend-calculated statistics** for instant responsiveness
- **Optimistic UI updates** for better user experience
- **Hybrid filtering** (client-side + server-side)
- **Lazy loading** and code splitting with Vite
- **Tree shaking** for optimized bundle size
- **Hot Module Replacement** for fast development

## 🔄 **Real-time Features**

### **WebSocket Integration** (`useWebSocket.ts`)
Ready for real-time collaboration with:
- **Auto-reconnection** with exponential backoff
- **Real-time todo updates** across multiple users
- **Live statistics** updates
- **Connection status** indicators

### **Reactive Data Flow**
- **Pinia reactivity** for automatic UI updates
- **Computed properties** for derived state
- **Watchers** for side effects and API calls

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
## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the modular architecture
4. Add TypeScript types if applicable
5. Test your changes with both user and admin roles
6. Commit your changes: `git commit -m 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

## 📄 **License**

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🙏 **Acknowledgments**

- **Vue.js 3** - The Progressive JavaScript Framework with Composition API
- **Pinia** - Intuitive state management for Vue
- **Tailwind CSS** - Utility-first CSS framework
- **Laravel Sanctum** - Simple SPA authentication
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and development server

## 📞 **Support**

If you encounter any issues:

1. **Development Issues:**
   - Check the browser console for errors
   - Verify the Laravel API is running on `http://localhost:8000`
   - Ensure CORS is properly configured in Laravel
   - Check network requests in browser dev tools

2. **Authentication Issues:**
   - Verify Sanctum configuration in Laravel
   - Check token storage in browser localStorage
   - Ensure API routes are properly protected

3. **Filtering Issues:**
   - Check browser console for filter-related errors
   - Verify filter parameters in network requests
   - Test both client-side and server-side filtering

For API-related issues, refer to the Laravel API documentation.

## 📚 **Learning Resources**

- [Vue.js 3 Documentation](https://vuejs.org/) - Official Vue.js guide
- [Pinia State Management](https://pinia.vuejs.org/) - Modern Vue state management
- [Vue Router](https://router.vuejs.org/) - Official router for Vue.js
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with type safety
- [Laravel Sanctum](https://laravel.com/docs/sanctum) - SPA authentication

---

## 🎯 **Project Status**

✅ **Complete Features:**
- ✅ Authentication with Laravel Sanctum
- ✅ Role-based access control (Admin/User)
- ✅ CRUD operations for todos
- ✅ Advanced filtering system (status, user_id, username)
- ✅ Real-time frontend statistics
- ✅ Modular component architecture
- ✅ TypeScript integration
- ✅ Production-ready codebase

This project demonstrates a modern Vue.js 3 SPA with clean architecture, comprehensive filtering, and real-time features, perfect for learning advanced frontend development patterns.

**Happy coding! 🎉**
