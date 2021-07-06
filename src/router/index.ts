import { route } from 'quasar/wrappers';
import ProjectViewModel from 'src/viewmodels/ProjectViewModel';
import UIViewModel from 'src/viewmodels/UIViewModel';
import UserViewModel from 'src/viewmodels/UserViewModel';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
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
      if (!(await UserViewModel.isLoggedIn())) {
        next({ name: 'login' });
        return;
      }
    }
    // TODO on new user create, doesn't get sent to onboarding. error reading

    // requiresReadWorkspace
    if (
      to.matched.some((record) => record.meta.requiresReadWorkspacePermission)
    ) {
      if (!WorkspaceViewModel.activeSpace.value) {
        UIViewModel.updateLoadingMessage('processing');
        UIViewModel.showLoading();
      }

      try {
        await WorkspaceViewModel.setActiveWorkspace(
          to.params.workspace_id.toString()
        );
        console.log('has role?:', UserViewModel.role.value);
      } catch (error) {
        console.log(error);
        next({ name: '404' });
        return;
      } finally {
        UIViewModel.hideLoading();
      }

      if (!permissions.workspace.canRead()) {
        console.log("can't read");
        UIViewModel.hideLoading();
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
          console.log('setting active project');
          await ProjectViewModel.setActiveProject(
            to.params.project_id.toString()
          );
        }
      } catch (error) {
        console.log(error);
        next({ name: '404' });
        return;
      }

      const project = ProjectViewModel.activeProject.value;
      if (!project || !permissions.project.canCRU(project)) {
        next({ name: '404' });
        return;
      }
    }

    next();
  });

  return Router;
});
