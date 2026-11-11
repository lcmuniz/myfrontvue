import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/users', name: 'users', component: () => import('@/views/UsersView.vue') },
  {
    // Only numeric ids match; anything else falls through to the 404 page.
    path: '/users/:id(\\d+)',
    name: 'user',
    component: () => import('@/views/UserDetailView.vue'),
    props: (route) => ({ id: Number(route.params.id) }),
  },
  { path: '/posts', name: 'posts', component: () => import('@/views/PostsView.vue') },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
