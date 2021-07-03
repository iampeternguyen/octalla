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
    const activeProject = ProjectViewModel.activeProject;
    const tasks = ProjectViewModel.tasks;
    const showNewProjectModal = UIViewModel.showNewProjectModal;

    const settings = UserViewModel.settings;
    const isLoggedIn = UserViewModel.isLoggedIn();
    const role = UserViewModel.role;

    const competencies = WorkspaceViewModel.competencies;
    const projects = WorkspaceViewModel.projects;

    return {
      projectState: {
        activeProject,
        tasks,
      },
      userState: {
        isLoggedIn,
        settings,
        role,
      },
      uiState: {
        showNewProjectModal,
      },
      workspace: {
        competencies,
        projects,
      },
    };
  },
});
</script>
