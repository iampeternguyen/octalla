<template>
  <q-page class="row items-center justify-evenly">
    <q-btn color="primary" icon="check" label="logout" @click="onLogOut" />
    <q-btn
      color="primary"
      icon="check"
      label="showloading"
      @click="onShowLoading"
    />
    <q-btn
      color="primary"
      icon="check"
      label="hideloading"
      @click="onHideLoading"
    />
  </q-page>
</template>

<script lang="ts">
import uiStore from 'src/stores/ui/uiStore';
import userStore from 'src/stores/user/userStore';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    async function onLogOut() {
      await userStore.onUserLoggedOut();
    }

    function onShowLoading() {
      uiStore.updateLoadingMessage('Deleting stuff. Do not leave page!');
      uiStore.showLoading();
    }

    return {
      onLogOut,
      onShowLoading,
    };
  },
});
</script>
