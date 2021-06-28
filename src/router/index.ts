import { route } from 'quasar/wrappers';
import projectStore from 'src/stores/project/projectStore';
import uiStore from 'src/stores/ui/uiStore';
import workspaceStore from 'src/stores/workspace/workspaceStore';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import permissions from './permissions';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });
  Router.beforeEach(async (to, from, next) => {
    // requiresAuth
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!(await permissions.user.isAuth())) {
        next({ name: 'login' });
        return;
      }
    }

    // requiresReadWorkspace
    if (
      to.matched.some((record) => record.meta.requiresReadWorkspacePermission)
    ) {
      // TODO add custom loading screen for initial db query
      if (!workspaceStore.activeWorkspace.value) {
        uiStore.updateLoadingMessage('processing');
        uiStore.showLoading();
      }

      try {
        await workspaceStore.setActiveWorkspace(
          to.params.workspace_id.toString()
        );
      } catch (error) {
        console.log(error);
        next({ name: '404' });
        return;
      } finally {
        uiStore.hideLoading();
      }
      if (!permissions.workspace.canRead()) {
        uiStore.hideLoading();
        next({ name: '404' });
        return;
      }
    }

    // requires CRU workspace

    if (
      to.matched.some((record) => record.meta.requiresCRUProjectPermissions)
    ) {
      try {
        if (to.params.project_id) {
          await projectStore.setActiveProject(to.params.project_id.toString());
        }
      } catch (error) {
        next({ name: '404' });
        return;
      }

      const project = workspaceStore.projects.value.find(
        (p) => p.id == to.params.project_id.toString()
      );

      console.log('project permissions');
      if (!project || !permissions.project.canCRU(project)) {
        next({ name: '404' });
        return;
      }
    }

    next();
  });

  return Router;
});
