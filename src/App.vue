<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import userStore from './stores/user/userStore';
import projectStore from './stores/project/projectStore';
import workspaceStore from './stores/workspace/workspaceStore';
import uiStore from './stores/ui/uiStore';
import UserViewModel from './viewmodels/UserViewModel';
import WorkspaceViewModel from './viewmodels/WorkspaceViewModel';

export default defineComponent({
  name: 'App',
  setup() {
    const userState = {
      isLoggedIn: UserViewModel.isLoggedIn(),
    };
    const projectState = projectStore.state;
    const uiState = uiStore.state;

    const settings = UserViewModel.settings;
    const isLoggedIn = UserViewModel.isLoggedIn();
    const role = UserViewModel.role;
    const competencies = WorkspaceViewModel.competencies;

    return {
      projectState,
      userState,
      uiState,
      settings,
      isLoggedIn,
      role,
      competencies,
    };
  },
});
</script>
