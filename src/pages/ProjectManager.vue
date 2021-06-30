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
    <q-toolbar class="bg-purple text-white">
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn flat dense icon="apps" class="q-mr-xs" label="Group by: Status">
        <q-menu transition-show="jump-down" transition-hide="jump-up">
          <div style="min-width: 100px">
            <competency-add-menu></competency-add-menu>
          </div>
        </q-menu>
      </q-btn>
      <q-btn flat round dense icon="assignment_ind" @click="addCompetency" />
    </q-toolbar>
    <q-drawer v-model="rightDrawerOpen" side="right" bordered overlay>
      <edit-project-success
        v-if="activeProject"
        class="q-my-md"
        :project="activeProject"
      ></edit-project-success>
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
import CompetencyAddMenu from 'src/components/Workspace/Menus/CompetencyAddMenu.vue';

import uiStore from 'src/stores/ui/uiStore';
import Competency from 'src/models/Competency';

export default defineComponent({
  components: {
    TasksList,
    EditProjectName,
    EditProjectGoal,
    EditProjectSuccess,
    CompetencyAddMenu,
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

    async function addCompetency() {
      const competency = new Competency(
        'Learning',
        activeProject.value?.workspace_id || ''
      );
      await competency.save();
    }

    return {
      text,
      filteredTasks,
      tasks,
      TASKS_STATUS_OPTIONS,
      activeProject,
      addCompetency,
      onToggleLeftDrawer: uiStore.appLeftDrawer.onToggleProjectLeftDrawer,
      onToggleRightDrawer,
      rightDrawerOpen,
    };
  },
});
</script>

<style lang="scss"></style>
