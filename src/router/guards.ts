import { User } from '@firebase/auth-types';
import { auth } from 'src/firebase';
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
