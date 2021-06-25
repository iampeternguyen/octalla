import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/app/workspace/',
    component: () => import('src/layouts/WorkspaceLayout.vue'),
    children: [
      {
        name: 'project',
        path: '',
        component: () => import('pages/WorkspaceHome.vue'),
      },
    ],
  },

  {
    path: '/app/project/:project_id',
    component: () => import('src/layouts/ProjectManagementLayout.vue'),
    children: [
      {
        name: 'project',
        path: '',
        component: () => import('pages/ProjectManager.vue'),
      },
    ],
  },

  {
    path: '/app/login',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
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
