import { boot } from 'quasar/wrappers';
import { auth, firebaseApp } from 'src/firebase';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot((/* { app, router, ... } */) => {
  console.log('Firebase app', firebaseApp);
  console.log('Firebase auth', auth);
});
