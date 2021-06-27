import { WORKSPACE_ROLE } from 'src/models/Role';
import userStore from 'src/stores/user/userStore';

export function isAuthenticated(): Promise<boolean> {
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

export function userHasReadWorkspacePermission() {
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

export function userHasUpdateWorkspacePermission() {
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

export function userHasDeleteWorkspacePermission() {
  if (
    userStore.role.value &&
    [WORKSPACE_ROLE.ADMIN].includes(userStore.role.value)
  ) {
    return true;
  } else {
    return false;
  }
}
