<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import userStore from './stores/user';
import projectStore from './stores/project';
import workspaceStore from './stores/workspace';

export default defineComponent({
  name: 'App',
  setup() {
    const userState = userStore.state;
    const projectState = projectStore.state;
    const workspaceState = workspaceStore.state;

    return { workspaceState, projectState, userState };
  },
});
</script>
