<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, provide, watch } from 'vue';
import { useQuasar } from 'quasar';
import { auth } from 'src/firebase';
import NewProjectModal from './components/Projects/NewProjectModal.vue';
import Store from 'src/stores/';

export default defineComponent({
  name: 'App',
  setup() {
    const store = Store.getInstance();
    provide(Store.StoreKey, store);
    watchForNewProjectModal();

    function watchForNewProjectModal() {
      const $q = useQuasar();

      if (store) {
        watch(store.showNewProjectModal.value, (show) => {
          if (show) {
            $q.dialog({
              component: NewProjectModal,
              componentProps: {
                store,
              },
            }).onDismiss(() => {
              store.toggleShowNewProjectModal();
            });
          }
        });
      }
    }

    // debug purposes
    const userState = store.userState;
    const projectState = store.projectState;

    return { userState, projectState };
  },
});
</script>
