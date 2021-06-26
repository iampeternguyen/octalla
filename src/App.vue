<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import userStore from './stores/user';
import projectStore from './stores/project';
import workspaceStore from './stores/workspace';
import uiStore from './stores/ui';

export default defineComponent({
  name: 'App',
  setup() {
    const userState = userStore.state;
    const projectState = projectStore.state;
    const workspaceState = workspaceStore.state;
    const uiState = uiStore.state;

    return { workspaceState, projectState, userState, uiState };
  },
});
</script>
