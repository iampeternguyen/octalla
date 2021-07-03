import Project from 'src/models/Project';
import { WORKSPACE_ROLE } from 'src/models/Role';
import userStore from 'src/stores/user/userStore';
import UserViewModel from 'src/viewmodels/UserViewModel';

// TODO think about what guest permissions allow

function userHasReadWorkspacePermission() {
  if (
    UserViewModel.role.value &&
    [
      WORKSPACE_ROLE.ADMIN,
      WORKSPACE_ROLE.MANAGER,
      WORKSPACE_ROLE.MEMBER,
      WORKSPACE_ROLE.GUEST,
    ].includes(UserViewModel.role.value)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasUpdateWorkspacePermission() {
  if (
    UserViewModel.role.value &&
    [WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.MANAGER].includes(
      UserViewModel.role.value
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasDeleteWorkspacePermission() {
  if (
    UserViewModel.role.value &&
    [WORKSPACE_ROLE.ADMIN].includes(UserViewModel.role.value)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasDeleteProjectPermission(project: Project) {
  if (
    UserViewModel.role.value &&
    ([WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.MANAGER].includes(
      UserViewModel.role.value
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
    UserViewModel.role.value &&
    [
      WORKSPACE_ROLE.ADMIN,
      WORKSPACE_ROLE.MANAGER,
      WORKSPACE_ROLE.MEMBER,
    ].includes(UserViewModel.role.value) &&
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
    // isAuth: isAuthenticated,
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
