import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD8mL3yPR-ppEgJowXm82wUGDqKEtOYJaI',
  authDomain: 'octalla.firebaseapp.com',
  projectId: 'octalla',
  storageBucket: 'octalla.appspot.com',
  messagingSenderId: '169426520377',
  appId: '1:169426520377:web:8bcf61a9743afbb48b00e8',
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const ui = new firebaseui.auth.AuthUI(firebase.auth());
const auth = firebase.auth();
const db = firebase.firestore();

export { ui, auth, db, firebaseApp };
