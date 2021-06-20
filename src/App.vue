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

    // debug purposes
    const userState = store.userState;
    const projectTasks = store.projectTasks;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.onUserLoggedIn(user);
      }
    });

    return { userState, projectTasks };
  },
});
</script>
