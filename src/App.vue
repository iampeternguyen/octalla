<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, provide } from 'vue';
import 'src/firebase/index';
import firebase from 'firebase/app';
import Store from 'src/stores/';
export default defineComponent({
  name: 'App',
  setup() {
    const store = Store.getInstance();
    provide(Store.StoreKey, store);

    const userState = store.userState;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.onUserLoggedIn(user);
      }
    });

    return { userState };
  },
});
</script>
