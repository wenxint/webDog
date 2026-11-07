import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '宠物社区 · 陪毛孩子好好长大' }
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('../views/PostListView.vue'),
    meta: { title: '社区动态' }
  },
  {
    path: '/posts/:id',
    name: 'post-detail',
    component: () => import('../views/PostDetailView.vue'),
    meta: { title: '帖子详情' }
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import('../views/PublishView.vue'),
    meta: { title: '发布动态' }
  },
  {
    path: '/wiki',
    name: 'wiki',
    component: () => import('../views/WikiListView.vue'),
    meta: { title: '养宠百科' }
  },
  {
    path: '/wiki/:id',
    name: 'wiki-detail',
    component: () => import('../views/WikiDetailView.vue'),
    meta: { title: '百科文章' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '页面走丢了' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || '宠物社区'
})

export default router
