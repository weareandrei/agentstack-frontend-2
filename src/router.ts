import { createRouter, createWebHistory, type NavigationGuard } from 'vue-router'
import { getToken } from '@/lib/auth'
import HomePage from '@/pages/home/Home.vue'
import DashboardLayout from '@/pages/dashboard/DashboardLayout.vue'
import ProjectLogsPage from '@/pages/dashboard/ProjectLogs.vue'
import ApiKeysPage from '@/pages/dashboard/ApiKeys.vue'
import SignUpPage from '@/pages/sign-up/SignUp.vue'
import SignInPage from '@/pages/sign-in/SignIn.vue'
import DocsPage from '@/pages/docs/Docs.vue'

const requireAuth: NavigationGuard = (to) => {
  if (!getToken()) {
    return { path: '/sign-in', query: { redirect: to.fullPath } }
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: requireAuth,
      children: [
        { path: '', component: ProjectLogsPage },
        { path: 'api-keys', component: ApiKeysPage },
      ],
    },
    { path: '/sign-up', component: SignUpPage },
    { path: '/sign-in', component: SignInPage },
    { path: '/docs', component: DocsPage },
  ],
})

export default router
