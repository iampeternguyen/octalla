<template>
  <section id="firebaseui-auth-container"></section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import firebase from 'firebase/app';
import 'firebaseui/dist/firebaseui.css';
import { ui } from 'src/firebase';
export default defineComponent({
  setup() {
    onMounted(() => {
      const uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
      };
      ui.start('#firebaseui-auth-container', uiConfig);
    });

    return {};
  },
});
</script>

<style scoped></style>
