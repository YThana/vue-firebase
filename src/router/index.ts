import { createRouter, createWebHistory } from 'vue-router'
import SignInView from '@/views/SignInView.vue'
import { getCurrentUser, useCurrentUser } from 'vuefire'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const currentUser = useCurrentUser()
        return currentUser ? '/home' : '/sign-in'
      },
    },
    {
      path: '/home',
      name: 'home',
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignInView,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/SignUpView.vue'),
    },
  ],
})

router.beforeEach(async (to, from) => {
  const currentUser = await getCurrentUser()
  if (to.meta.requiresAuth && !currentUser) {
    return { path: '/sign-in' }
  }
  if (currentUser && (to.path === '/sign-in' || to.path === '/sign-up')) {
    return { path: from.path }
  }
})

export default router
