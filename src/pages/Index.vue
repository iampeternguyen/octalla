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
import UIViewModel from 'src/viewmodels/UIViewModel';
import UserViewModel from 'src/viewmodels/UserViewModel';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    async function onLogOut() {
      await UserViewModel.logOutuser();
    }

    function onShowLoading() {
      UIViewModel.updateLoadingMessage('Deleting stuff. Do not leave page!');
      UIViewModel.showLoading();
    }

    return {
      onLogOut,
      onShowLoading,
    };
  },
});
</script>
