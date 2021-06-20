import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/ProjectManagementLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ProjectManager.vue') },
    ],
  },

  {
    path: '/login',
    component: () => import('src/layouts/ProjectManagementLayout.vue'),
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
