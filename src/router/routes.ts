import projectStore from 'src/stores/project';
import userStore from 'src/stores/user';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/app/',
    component: () => import('src/layouts/AppLayout.vue'),
    beforeEnter: (to, from, next) => {
      if (
        !userStore.settings.value ||
        !userStore.settings.value.most_recent_workspace
      ) {
        next({ name: 'onboarding' });
      } else if (
        userStore.settings.value.most_recent_project &&
        userStore.settings.value.most_recent_workspace
      ) {
        next({
          name: 'project',
          params: {
            workspace_id: userStore.settings.value.most_recent_workspace,
            project_id: userStore.settings.value.most_recent_project,
          },
        });
      } else if (
        !userStore.settings.value.most_recent_project &&
        userStore.settings.value.most_recent_workspace
      ) {
        next({
          name: 'workspace',
          params: {
            workspace_id: userStore.settings.value.most_recent_workspace,
          },
        });
      } else {
        next();
      }
    },
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

    children: [
      {
        name: 'workspace',
        path: '',
        component: () => import('pages/ProjectManager.vue'),
        meta: {
          requiresAuth: true,
          requiresReadWorkspacePermission: true,
        },
      },
    ],
  },

  {
    path: '/app/:workspace_id/settings',
    component: () => import('src/layouts/AppLayout.vue'),

    children: [
      {
        name: 'workspace-settings',
        path: '',
        component: () => import('pages/WorkspaceSettings.vue'),
        meta: { requiresAuth: true, requiresReadWorkspacePermission: true },
      },
    ],
  },

  {
    path: '/app/:workspace_id/:project_id',
    component: () => import('src/layouts/AppLayout.vue'),
    beforeEnter: async (to, from, next) => {
      await projectStore.setActiveProject(to.params.project_id.toString());
      next();
    },
    children: [
      {
        name: 'project',
        path: '',
        component: () => import('pages/ProjectManager.vue'),
        meta: { requiresAuth: true, requiresReadWorkspacePermission: true },
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
