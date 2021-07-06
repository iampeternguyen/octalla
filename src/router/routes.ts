import UserViewModel from 'src/viewmodels/UserViewModel';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/LandingPageLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/LandingPage.vue') },
    ],
  },
  {
    path: '/app/',
    component: () => import('src/layouts/AppLayout.vue'),
    beforeEnter: (to, from, next) => {
      // TODO workspace should also jump to mose recent
      console.log(UserViewModel.settings.value);
      if (
        !UserViewModel.settings.value ||
        (!UserViewModel.settings.value.most_recent_workspace &&
          UserViewModel.settings.value.workspaces.length == 0)
      ) {
        next({ name: 'onboarding' });
      } else if (
        UserViewModel.settings.value.most_recent_project &&
        UserViewModel.settings.value.most_recent_workspace
      ) {
        next({
          name: 'project',
          params: {
            workspace_id: UserViewModel.settings.value.most_recent_workspace,
            project_id: UserViewModel.settings.value.most_recent_project,
          },
        });
      } else if (
        !UserViewModel.settings.value.most_recent_project &&
        UserViewModel.settings.value.most_recent_workspace
      ) {
        next({
          name: 'workspace',
          params: {
            workspace_id: UserViewModel.settings.value.most_recent_workspace,
          },
        });
      } else {
        next({
          name: 'workspace',
          params: {
            workspace_id: UserViewModel.settings.value.workspaces[0],
          },
        });
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
    component: () => import('src/layouts/LandingPageLayout.vue'),
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
    children: [
      {
        name: 'project',
        path: '',
        component: () => import('pages/ProjectManager.vue'),
        meta: {
          requiresAuth: true,
          requiresReadWorkspacePermission: true,
          requiresCRUProjectPermissions: true,
        },
      },
    ],
  },
  {
    path: '/invite',
    component: () => import('src/layouts/LandingPageLayout.vue'),
    children: [
      {
        name: 'invite',
        path: '',
        component: () =>
          import('components/UserRegistration/UserLoginInvite.vue'),
      },
    ],
  },

  {
    path: '/app/login',
    component: () => import('src/layouts/LandingPageLayout.vue'),
    children: [
      {
        name: 'login',
        path: '',
        component: () => import('components/UserRegistration/UserLogin.vue'),
      },
    ],
  },
  // TODO fix this for everything except join
  // // Always leave this as last one,
  // // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
