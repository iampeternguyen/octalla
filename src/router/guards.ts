import { User } from '@firebase/auth-types';
import { auth, db } from 'src/firebase';
import {
  ROLES_MEMBERS_STORENAME,
  ROLES_STORENAME,
  WorkspaceRolesMemberData,
} from 'src/models/Role';
import userStore from 'src/stores/user';
import workspaceStore from 'src/stores/workspace';

export function isAuthenticated(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (userStore.isLoggedIn.value) {
      resolve(true);
    } else {
      const authUser: () => Promise<User | null> = () => {
        return new Promise((resolve, reject) => {
          auth.onAuthStateChanged(
            (user: User | null) => {
              resolve(user);
            },
            (error) => {
              console.log(error);
              reject(error);
            }
          );
        });
      };

      authUser()
        .then(async (user) => {
          if (user) {
            await userStore.onUserLoggedIn(user);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => reject(err));
    }
  });
}
// TODO refactor this, redundant code in store
export async function canReadWorkspace(workspace_id: string) {
  if (
    workspaceStore.activeWorkspace.value?.id == workspace_id &&
    userStore.role.value &&
    ['ADMIN', 'MANAGER', 'MEMBER', ' GUEST'].includes(userStore.role.value)
  ) {
    return true;
  }
  console.log('querying db for role', userStore.role.value);
  const doc = await db
    .collection(ROLES_STORENAME)
    .doc(workspace_id)
    .collection(ROLES_MEMBERS_STORENAME)
    .doc(userStore.settings.value?.id)
    .get();
  const role = (doc.data() as WorkspaceRolesMemberData).role;
  return ['ADMIN', 'MANAGER', 'MEMBER', ' GUEST'].includes(role);
}
