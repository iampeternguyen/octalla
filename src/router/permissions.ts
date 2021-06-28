import Project from 'src/models/Project';
import { WORKSPACE_ROLE } from 'src/models/Role';
import userStore from 'src/stores/user/userStore';

// TODO think about what guest permissions allow

function isAuthenticated(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (userStore.isLoggedIn.value) {
      resolve(true);
    } else {
      userStore
        .userIsAuthenticated()
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    }
  });
}

function userHasReadWorkspacePermission() {
  if (
    userStore.role.value &&
    [
      WORKSPACE_ROLE.ADMIN,
      WORKSPACE_ROLE.MANAGER,
      WORKSPACE_ROLE.MEMBER,
      WORKSPACE_ROLE.GUEST,
    ].includes(userStore.role.value)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasUpdateWorkspacePermission() {
  if (
    userStore.role.value &&
    [WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.MANAGER].includes(
      userStore.role.value
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasDeleteWorkspacePermission() {
  if (
    userStore.role.value &&
    [WORKSPACE_ROLE.ADMIN].includes(userStore.role.value)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasDeleteProjectPermission(project: Project) {
  if (
    userStore.role.value &&
    ([WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.MANAGER].includes(
      userStore.role.value
    ) ||
      project.created_by == userStore.state.value.settings?.id)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasCRUProjectPermission(project: Project) {
  if (
    userStore.role.value &&
    [
      WORKSPACE_ROLE.ADMIN,
      WORKSPACE_ROLE.MANAGER,
      WORKSPACE_ROLE.MEMBER,
    ].includes(userStore.role.value) &&
    // just adding for now.
    // TODO project should have its own exceptions or inclusions based on user or teams
    project
  ) {
    return true;
  } else {
    return false;
  }
}

const permissions = {
  user: {
    isAuth: isAuthenticated,
  },

  workspace: {
    canRead: userHasReadWorkspacePermission,
    canDelete: userHasDeleteWorkspacePermission,
    canUpdate: userHasUpdateWorkspacePermission,
  },
  project: {
    canDelete: userHasDeleteProjectPermission,
    canCRU: userHasCRUProjectPermission,
  },
};

export default permissions;
