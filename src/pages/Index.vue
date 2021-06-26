<template>
  <q-page class="row items-center justify-evenly">
    <q-btn color="primary" icon="check" label="logout" @click="onLogOut" />
  </q-page>
</template>

<script lang="ts">
import userStore from 'src/stores/user';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    async function onLogOut() {
      await userStore.onUserLoggedOut();
    }
    return {
      onLogOut,
    };
  },
});
</script>
