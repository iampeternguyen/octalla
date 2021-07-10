<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import UserViewModel from './viewmodels/UserViewModel';
import WorkspaceViewModel from './viewmodels/WorkspaceViewModel';
import UIViewModel from './viewmodels/UIViewModel';
import ProjectViewModel from './viewmodels/ProjectViewModel';
import ChatViewModel from './viewmodels/ChatViewModel';

export default defineComponent({
  name: 'App',
  setup() {
    return {
      chatState: {
        state: ChatViewModel.properties,
      },
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
