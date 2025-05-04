import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/admin/Dashboard.vue'
import Overview from '../views/admin/Overview.vue'
import Users from '../views/admin/Users.vue'
import Companies from '../views/admin/Companies.vue'
import Jobs from '../views/admin/Jobs.vue'
import JobCategories from '../views/admin/JobCategories.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Forbidden from '../views/Forbidden.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Đăng nhập - Admin',
      requiresAuth: false
    }
  },
  {
    path: '/admin',
    component: Dashboard,
    //meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminOverview',
        component: Overview,
        meta: { title: 'Tổng quan - Admin' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: Users,
        meta: { title: 'Quản lý người dùng - Admin' }
      },
      {
        path: 'companies',
        name: 'AdminCompanies',
        component: Companies,
        meta: { title: 'Quản lý công ty - Admin' }
      },
      {
        path: 'jobs',
        name: 'AdminJobs',
        component: Jobs,
        meta: { title: 'Quản lý tin tuyển dụng - Admin' }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: JobCategories,
        meta: { title: 'Quản lý danh mục - Admin' }
      }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: { title: '403 - Truy cập bị từ chối' }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404 - Không tìm thấy trang' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Sbwork Admin'

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is logged in
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // Check if route requires admin role
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      // Check if user is admin
      const userRole = localStorage.getItem('role')
      if (userRole !== 'admin') {
        next('/403')
        return
      }
    }
  }

  next()
})

export default router 