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
      <q-toolbar class="bg-purple text-white">
        <q-toolbar-title> Toolbar </q-toolbar-title>
        <q-btn
          flat
          dense
          icon="apps"
          class="q-mr-xs"
          :label="`Group by: ${groupCategory}`"
        >
          <q-menu transition-show="jump-down" transition-hide="jump-up">
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Open...</q-item-section>
              </q-item>
              <q-item clickable @click="groupBy('status')">
                <q-item-section>Status</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                class="items-center"
                clickable
                @click="groupBy('competency')"
                @mouseenter="isCompetencyHovered = true"
                @mouseleave="isCompetencyHovered = false"
              >
                <q-item-section>Competencies</q-item-section>
                <q-item-section
                  side
                  :class="{ invisible: !isCompetencyHovered }"
                >
                  <q-btn
                    color="primary"
                    flat
                    icon="eva-edit-outline"
                    round
                    @click.stop.prevent
                  >
                    <q-menu anchor="top end" self="top start">
                      <competency-add-menu></competency-add-menu>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered overlay>
      <edit-project-success
        v-if="activeProject"
        class="q-my-md"
        :project="activeProject"
      ></edit-project-success>
    </q-drawer>

    <q-page>
      <q-scroll-area class="scroll-area q-pa-md" visible>
        <div class="row q-gutter-md no-wrap">
          <tasks-list
            v-for="field in group"
            :key="field"
            :category="groupCategory"
            :field="field"
          ></tasks-list>
          <tasks-list
            v-if="groupCategory != 'status'"
            :category="groupCategory"
            field="Empty"
          ></tasks-list>
        </div>
      </q-scroll-area>
    </q-page>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';

import { TASKS_STATUS_OPTIONS } from 'src/models/Task';
import TasksList from 'src/components/Tasks/TasksList.vue';
import EditProjectName from 'src/components/Projects/ProjectManagementLayout/EditProjectName.vue';
import EditProjectGoal from 'src/components/Projects/ProjectManagementLayout/EditProjectGoal.vue';
import EditProjectSuccess from 'src/components/Projects/ProjectManagementLayout/EditProjectSuccess.vue';
import CompetencyAddMenu from 'src/components/Workspace/Menus/CompetencyAddMenu.vue';

import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
import ProjectViewModel from 'src/viewmodels/ProjectViewModel';
import UIViewModel from 'src/viewmodels/UIViewModel';

export default defineComponent({
  components: {
    TasksList,
    EditProjectName,
    EditProjectGoal,
    EditProjectSuccess,
    CompetencyAddMenu,
  },
  setup() {
    const tasks = ProjectViewModel.tasks;
    const activeProject = ProjectViewModel.activeProject;

    const text = ref('');
    const rightDrawerOpen = ref(false);
    const group = computed(() => {
      if (groupCategory.value == 'competency') {
        const competencies = WorkspaceViewModel.competencies.value;
        return competencies.map((comp) => comp.name);
      } else {
        return TASKS_STATUS_OPTIONS;
      }
    });

    const groupCategory = ref('status');
    const isCompetencyHovered = ref(false);

    watch(
      ProjectViewModel.activeProject,
      (project) => {
        if (project?.group_by) groupTasks(project.group_by);
      },
      { immediate: true }
    );

    // TODO watch competencies changes

    function groupTasks(groupBy: string) {
      if (groupBy == 'competency') {
        groupCategory.value = groupBy;
      } else if (groupBy == 'status') {
        groupCategory.value = groupBy;
      }
    }

    function filteredTasks(status: string) {
      return tasks.value.filter((t) => t.status == status);
    }

    function onToggleRightDrawer() {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    }

    async function groupBy(field: string) {
      if (field != activeProject.value?.group_by) {
        await ProjectViewModel.projectGroupBy(field);
      }
    }

    return {
      text,
      filteredTasks,
      tasks,
      TASKS_STATUS_OPTIONS,
      activeProject,
      onToggleLeftDrawer: UIViewModel.appLeftDrawer.onToggleProjectLeftDrawer,
      onToggleRightDrawer,
      rightDrawerOpen,
      groupBy,
      group,
      isCompetencyHovered,
      groupCategory,
    };
  },
});
</script>

<style lang="scss">
.scroll-area {
  height: 60vh;
}
</style>
