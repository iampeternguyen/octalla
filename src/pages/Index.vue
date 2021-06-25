<template>
  <q-page class="row items-center justify-evenly">
    <q-btn color="primary" icon="check" label="logout" @click="onLogOut" />
  </q-page>
</template>

<script lang="ts">
import Store from 'src/stores';
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const store = inject(Store.StoreKey);
    async function onLogOut() {
      await store?.onUserLoggedOut();
    }
    return {
      onLogOut,
    };
  },
});
</script>
