import { route } from 'quasar/wrappers';
import workspaceStore from 'src/stores/workspace';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { userHasReadWorkspacePermission, isAuthenticated } from './guards';
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
  // TODO route guard for workspace
  Router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!(await isAuthenticated())) {
        next({ name: 'login' });
        return;
      }
    }

    if (
      to.matched.some((record) => record.meta.requiresReadWorkspacePermission)
    ) {
      await workspaceStore.setActiveWorkspace(
        to.params.workspace_id.toString()
      );

      if (!userHasReadWorkspacePermission()) {
        next({ name: 'login' });
        return;
      }
    }

    next();
  });

  return Router;
});
