<template>
  <!-- TODO move header to page manager ? or move everything not layout focuses to components aka slots? -->
  <!-- the key helps refresh all components when active project is changed -->

  <q-layout view="lHh lpR fFf">
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :mini="!leftDrawerOpen || miniState"
      @click.capture="onDrawerClick"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item v-if="!miniState">
            <q-item-section>
              <q-img src="/logo/Logo_Full.png" height="6rem" fit="contain" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item dense clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="eva-bell-outline" />
            </q-item-section>

            <q-item-section class="left-drawer-item">
              Notifications
            </q-item-section>
          </q-item>

          <q-expansion-item
            class="left-drawer-item"
            dense
            expand-separator
            icon="eva-browser-outline"
            label="Projects"
            default-opened
          >
            <q-item dense class="justify-center items-center">
              <q-btn
                flat
                class="q-px-lg left-drawer-item"
                color="primary"
                icon="eva-plus-outline"
                label="New Project"
                @click="onNewProject"
                dense
                rounded
              />
            </q-item>
            <div v-if="projects">
              <workspace-projects-nested-list></workspace-projects-nested-list>
            </div>
          </q-expansion-item>

          <q-item dense active clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>

            <q-item-section class="left-drawer-item"> Star </q-item-section>
          </q-item>

          <q-item dense clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="send" />
            </q-item-section>

            <q-item-section class="left-drawer-item"> Send </q-item-section>
          </q-item>

          <q-item dense clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>

            <q-item-section class="left-drawer-item"> Drafts </q-item-section>
          </q-item>

          <q-item dense clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>
            <!-- TODO this doesn't get updated when workspace deleted and moved back to previous space -->
            <q-item-section class="left-drawer-item" v-if="activeWorkspace">
              <router-link
                :key="activeWorkspace.id"
                class="left-drawer-project-link"
                :to="{
                  name: 'workspace-settings',
                  params: { workspace_id: activeWorkspace.id },
                }"
              >
                {{ activeWorkspace.name }}
              </router-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!--
          in this case, we use a button (can be anything)
          so that user can switch back
          to mini-mode
        -->
      <div class="q-mini-drawer-hide absolute" style="top: 50%; right: -1.5rem">
        <q-btn
          dense
          round
          unelevated
          color="secondary"
          icon="chevron_left"
          @click="toMiniDrawer"
        />
      </div>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import eventsStore from 'src/stores/events/eventsStore';
import NewProjectModal from 'src/components/Projects/NewProjectModal.vue';
import Project from 'src/models/Project';
import projectStore from 'src/stores/project/projectStore';
import uiStore from 'src/stores/ui/uiStore';
import userStore from 'src/stores/user/userStore';
import workspaceStore from 'src/stores/workspace/workspaceStore';
import WorkspaceProjectsNestedList from 'src/components/Workspace/WorkspaceProjectsNestedList.vue';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
export default defineComponent({
  name: 'ProjectManagerLayout',
  components: {
    WorkspaceProjectsNestedList,
  },

  setup() {
    if (!userStore.settings.value) return;

    const router = useRouter();

    watchForNewProjectModal();

    function watchForNewProjectModal() {
      const $q = useQuasar();
      // does not need store

      watch(uiStore.state.value, (state) => {
        if (state.showNewProjectModal) {
          $q.dialog({
            component: NewProjectModal,
          }).onDismiss(() => {
            uiStore.toggleShowNewProjectModal();
          });
        }
      });
    }

    const projects = WorkspaceViewModel.projects;
    const activeProject = projectStore.activeProject;
    const activeWorkspace = WorkspaceViewModel.activeSpace;

    function isActive(project_id: string) {
      return project_id == activeProject.value?.id;
    }

    function onNewProject() {
      console.log('new project');
      uiStore.toggleShowNewProjectModal();
    }
    // TODO move method
    async function onDeleteProject(project: Project) {
      await eventsStore.project.onProjectDelete(project);
      if (project.id == activeProject.value?.id)
        await router.push({ name: 'app' });
    }

    return {
      leftDrawerOpen: uiStore.appLeftDrawer.open,
      activeWorkspace,
      onDeleteProject,
      onToggleLeftDrawer: uiStore.appLeftDrawer.onToggleProjectLeftDrawer,
      miniState: uiStore.appLeftDrawer.mini,
      onDrawerClick: uiStore.appLeftDrawer.onProjectLeftDrawerClicked,
      toMiniDrawer: uiStore.appLeftDrawer.collapseProjectLeftDrawer,
      onNewProject,
      projects,
      isActive,
      activeProject,
    };
  },
});
</script>

<style lang="scss" scoped>
.project-name {
  font-weight: 800;
  font-size: 2rem;
}

.project-goal {
  min-width: 30rem;
  color: $primary;
}

.left-drawer-item {
  font-size: 1.4rem;
}

.left-drawer-project-link {
  text-decoration: none;
  font-size: 1.4rem;
  color: $grey-8;

  &__active {
    color: $primary;
    font-weight: 500;
  }
}
</style>
