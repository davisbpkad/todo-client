import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/LoginForm.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/components/RegisterForm.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/todos',
    name: 'Todos',
    component: () => import('@/components/TodoList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/todos'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, _from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/todos')
  } else {
    next()
  }
})

export default router
