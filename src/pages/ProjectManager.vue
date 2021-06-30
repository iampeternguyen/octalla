<template>
  <div :key="activeProject?.id">
    <q-header class="bg-white text-primary shadow-2" height-hint="98">
      <q-toolbar class="row justify-between">
        <q-btn dense flat round icon="menu" @click="onToggleLeftDrawer" />

        <edit-project-name
          v-if="activeProject"
          :project="activeProject"
        ></edit-project-name>

        <edit-project-goal
          v-if="activeProject"
          class="col-grow"
          :project="activeProject"
        ></edit-project-goal>

        <q-btn
          dense
          flat
          round
          icon="eva-info-outline"
          @click="onToggleRightDrawer"
        />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="rightDrawerOpen" side="right" bordered overlay>
      <!-- <edit-project-success
      v-if="activeProject"
      class="q-my-md"
      :project="activeProject"
    ></edit-project-success> -->

      <workspace-projects-nested-list></workspace-projects-nested-list>
    </q-drawer>

    <q-page class="row q-gutter-md" padding>
      <tasks-list
        v-for="status in TASKS_STATUS_OPTIONS"
        :key="status"
        :status="status"
      ></tasks-list>
    </q-page>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { TASKS_STATUS_OPTIONS } from 'src/models/Task';
import TasksList from 'src/components/Tasks/TasksList.vue';
import projectStore from 'src/stores/project/projectStore';
import EditProjectName from 'src/components/Projects/ProjectManagementLayout/EditProjectName.vue';
import EditProjectGoal from 'src/components/Projects/ProjectManagementLayout/EditProjectGoal.vue';
import EditProjectSuccess from 'src/components/Projects/ProjectManagementLayout/EditProjectSuccess.vue';

import uiStore from 'src/stores/ui/uiStore';
import WorkspaceProjectsNestedList from 'src/components/Workspace/WorkspaceProjectsNestedList.vue';

export default defineComponent({
  components: {
    TasksList,
    EditProjectName,
    EditProjectGoal,
    EditProjectSuccess,
    WorkspaceProjectsNestedList,
  },
  setup() {
    const tasks = projectStore.tasks;
    const activeProject = projectStore.activeProject;

    const text = ref('');
    const rightDrawerOpen = ref(false);

    function filteredTasks(status: string) {
      return tasks.value.filter((t) => t.status == status);
    }

    function onToggleRightDrawer() {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    }

    return {
      text,
      filteredTasks,
      tasks,
      TASKS_STATUS_OPTIONS,
      activeProject,
      onToggleLeftDrawer: uiStore.appLeftDrawer.onToggleProjectLeftDrawer,
      onToggleRightDrawer,
      rightDrawerOpen,
    };
  },
});
</script>

<style lang="scss"></style>
