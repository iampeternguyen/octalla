<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import userStore from './stores/user/userStore';
import projectStore from './stores/project/projectStore';
import workspaceStore from './stores/workspace/workspaceStore';
import uiStore from './stores/ui/uiStore';

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
