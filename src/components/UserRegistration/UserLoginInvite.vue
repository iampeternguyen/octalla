<template>
  <q-page class="bg-secondary row justify-center items-center" padding>
    <q-card
      class="login-card column justify-center items-center q-pa-xl"
      v-if="token"
    >
      <section id="firebaseui-auth-container"></section>
      <div class="q-mt-md">
        Get ready to make something awesome. Register/Sign-In to get started.
      </div>
    </q-card>
    <q-card
      class="login-card column justify-center items-center q-pa-xl"
      v-else
    >
      <div class="q-mt-md">
        Invalid invite token. Please ask the person who invited you to send you
        a new one.
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import firebase from 'firebase/app';
import 'firebaseui/dist/firebaseui.css';
import { auth, ui } from 'src/firebase';
import { useRoute, useRouter } from 'vue-router';
import { User } from '@firebase/auth-types';
import UserViewModel from 'src/viewmodels/UserViewModel';
import UIViewModel from 'src/viewmodels/UIViewModel';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const token = route.query.token?.toString() || '';

    auth.onAuthStateChanged(async (user: User | null) => {
      const success = route.query.success?.toString();
      console.log(success);
      if (user && success) {
        UIViewModel.updateLoadingMessage('Joining your team... please wait.');
        UIViewModel.showLoading();
        await UserViewModel.setUpUserRoleAndWorkspace(user, success);
        await router.push({ name: 'app' });
        UIViewModel.hideLoading();
      }
    });

    onMounted(() => {
      const uiConfig = {
        signInSuccessUrl: `/invite?success=${token}`,
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
      };
      ui.start('#firebaseui-auth-container', uiConfig);
    });

    return { token };
  },
});
</script>

<style scoped>
.login-card {
  min-height: 40rem;
  min-width: 40rem;
}
</style>
