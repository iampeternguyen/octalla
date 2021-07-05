<template>
  <q-page class="bg-secondary row justify-center items-center" padding>
    <q-card class="login-card column justify-center items-center q-pa-xl">
      <section id="firebaseui-auth-container"></section>
      <div class="q-mt-md">
        Get ready to make something awesome. Register/Sign-In to get started.
      </div>
    </q-card>
  </q-page>
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
        signInSuccessUrl: '/app/',
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

<style scoped>
.login-card {
  min-height: 40rem;
  min-width: 40rem;
}
</style>
