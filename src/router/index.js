import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/post/:slug', name: 'post', component: () => import('../views/PostView.vue') },
    { path: '/archive', name: 'archive', component: () => import('../views/ArchiveView.vue') },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue'),
    },
    { path: '/tags', name: 'tags', component: () => import('../views/TagsView.vue') },
    {
      path: '/category/:name',
      name: 'category',
      component: () => import('../views/FilteredView.vue'),
    },
    { path: '/tag/:name', name: 'tag', component: () => import('../views/FilteredView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 浏览器前进后退时回到原位置，其余情况回到顶部
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
