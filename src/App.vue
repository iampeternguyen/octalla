<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import UserViewModel from './viewmodels/UserViewModel';
import WorkspaceViewModel from './viewmodels/WorkspaceViewModel';
import UIViewModel from './viewmodels/UIViewModel';
import ProjectViewModel from './viewmodels/ProjectViewModel';

export default defineComponent({
  name: 'App',
  setup() {
    return {
      projectState: {
        state: ProjectViewModel.properties,
      },
      userState: {
        state: UserViewModel.properties,
      },
      uiState: {
        showNewProjectModal: UIViewModel.showNewProjectModal,
      },
      workspace: {
        state: WorkspaceViewModel.properties,
      },
    };
  },
});
</script>
