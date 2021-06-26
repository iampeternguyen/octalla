import { RouteRecordRaw } from 'vue-router';
import { canReadWorkspace } from './guards';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/app/',
    component: () => import('src/layouts/AppLayout.vue'),
    children: [
      {
        name: 'app',
        path: '',
        component: () => import('src/pages/AppHome.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/app/onboarding',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        name: 'onboarding',
        path: '',
        component: () => import('src/pages/CreateWorkspace.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/app/:workspace_id/',
    component: () => import('src/layouts/AppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      if (await canReadWorkspace(to.params.workspace_id.toString())) {
        next();
      } else {
        next({ name: 'login' });
      }
    },
    children: [
      {
        name: 'workspace',
        path: '',
        component: () => import('pages/ProjectManager.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: '/app/:workspace_id/:project_id',
    component: () => import('src/layouts/AppLayout.vue'),
    children: [
      {
        name: 'project',
        path: '',
        component: () => import('pages/ProjectManager.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: '/app/login',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        name: 'login',
        path: '',
        component: () => import('components/UserRegistration/UserLogin.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
