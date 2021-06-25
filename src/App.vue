<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, provide, watch } from 'vue';
import { useQuasar } from 'quasar';
import NewProjectModal from './components/Projects/NewProjectModal.vue';
import Store from 'src/stores/';

export default defineComponent({
  name: 'App',
  setup() {
    const store = Store.getInstance();
    provide(Store.StoreKey, store);

    // debug purposes
    const userState = store.userState;
    const projectState = store.projectState;

    return { userState, projectState };
  },
});
</script>
