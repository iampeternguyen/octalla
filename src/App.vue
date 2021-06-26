<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, provide } from 'vue';

import Store from 'src/stores/';

export default defineComponent({
  name: 'App',
  setup() {
    const store = Store.getInstance();
    provide(Store.StoreKey, store);

    // TODO remove in production
    const userState = store.userState;
    const projectState = store.projectState;

    return { userState, projectState };
  },
});
</script>
