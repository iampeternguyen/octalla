import { ProjectData } from 'src/models/Project';
import { WORKSPACE_ROLE } from 'src/models/Role';
import UserViewModel from 'src/viewmodels/UserViewModel';

// TODO think about what guest permissions allow

function userHasReadWorkspacePermission() {
  console.log('role', UserViewModel.properties.role);
  if (
    UserViewModel.properties.role &&
    [
      WORKSPACE_ROLE.ADMIN,
      WORKSPACE_ROLE.MANAGER,
      WORKSPACE_ROLE.MEMBER,
      WORKSPACE_ROLE.GUEST,
    ].includes(UserViewModel.properties.role)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasUpdateWorkspacePermission() {
  if (
    UserViewModel.properties.role &&
    [WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.MANAGER].includes(
      UserViewModel.properties.role
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasDeleteWorkspacePermission() {
  if (
    UserViewModel.properties.role &&
    [WORKSPACE_ROLE.ADMIN].includes(UserViewModel.properties.role)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasDeleteProjectPermission(project: ProjectData) {
  if (
    UserViewModel.properties.role &&
    ([WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.MANAGER].includes(
      UserViewModel.properties.role
    ) ||
      project.created_by == UserViewModel.properties.settings?.id)
  ) {
    return true;
  } else {
    return false;
  }
}

function userHasCRUProjectPermission(project: ProjectData) {
  if (
    UserViewModel.properties.role &&
    [
      WORKSPACE_ROLE.ADMIN,
      WORKSPACE_ROLE.MANAGER,
      WORKSPACE_ROLE.MEMBER,
    ].includes(UserViewModel.properties.role) &&
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
