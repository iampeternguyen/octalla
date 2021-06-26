import { User } from '@firebase/auth-types';
import { auth, db } from 'src/firebase';
import {
  ROLES_MEMBERS_STORENAME,
  ROLES_STORENAME,
  WorkspaceRolesMemberData,
} from 'src/models/Role';
import Store from 'src/stores';

export function isAuthenticated(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const store = Store.getInstance();
    if (store.userState.value.isLoggedIn) {
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
            await store.onUserLoggedIn(user);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => reject(err));
    }
  });
}

export async function canReadWorkspace(workspace_id: string) {
  const store = Store.getInstance();
  const doc = await db
    .collection(ROLES_STORENAME)
    .doc(workspace_id)
    .collection(ROLES_MEMBERS_STORENAME)
    .doc(store.userState.value.userSettings?.id)
    .get();
  const role = (doc.data() as WorkspaceRolesMemberData).role;
  return ['ADMIN', 'MANAGER', 'MEMBER', ' GUEST'].includes(role);
}
