import { boot } from 'quasar/wrappers';
import { auth, firebaseApp } from 'src/firebase';
import Store from 'src/stores';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot((/* { app, router, ... } */) => {
  console.log('Firebase app', firebaseApp);
  console.log('Firebase auth', auth);
  const store = Store.getInstance();
  auth.onAuthStateChanged((user) => {
    if (user) {
      store.onUserLoggedIn(user).catch((err) => console.log(err));
    }
  });
});
