import { ProjectData } from 'src/models/Project';
import { WORKSPACE_ROLE } from 'src/models/Role';
import UserViewModel from 'src/viewmodels/UserViewModel';

// TODO think about what guest permissions allow

function userHasReadWorkspacePermission() {
  console.log('role', UserViewModel.role.value);
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

function userHasDeleteProjectPermission(project: ProjectData) {
  if (
    UserViewModel.role.value &&
    ([WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.MANAGER].includes(
      UserViewModel.role.value
    ) ||
      project.created_by == UserViewModel.settings.value?.id)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasCRUProjectPermission(project: ProjectData) {
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
