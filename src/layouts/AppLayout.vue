<template>
  <!-- TODO move header to page manager ? or move everything not layout focuses to components aka slots? -->
  <!-- the key helps refresh all components when active project is changed -->

  <q-layout view="lHh lpR fFf" :key="activeProject?.id">
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

          <edit-project-success
            v-if="!miniState && activeProject"
            class="q-my-md"
            :project="activeProject"
          ></edit-project-success>

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
              <router-link
                class="left-drawer-project-link"
                v-for="project in projects"
                :key="project.id"
                :to="{
                  name: 'project',
                  params: {
                    project_id: project.id,
                  },
                }"
                :class="{
                  'left-drawer-project-link__active': isActive(project.id),
                }"
              >
                <q-expansion-item
                  :class="{ 'bg-orange-1': isActive(project.id) }"
                  dense
                  :header-inset-level="1"
                  expand-icon-toggle
                  expand-separator
                  :label="project.name"
                  default-opened
                >
                </q-expansion-item>
                <q-btn
                  color="red"
                  icon="delete"
                  @click.stop="onDeleteProject(project)"
                />
              </router-link>
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import NewProjectModal from 'src/components/Projects/NewProjectModal.vue';
import EditProjectSuccess from 'src/components/Projects/ProjectManagementLayout/EditProjectSuccess.vue';
import workspaceStore from 'src/stores/workspace/workspaceStore';
import projectStore from 'src/stores/project/projectStore';
import userStore from 'src/stores/user/userStore';
import uiStore from 'src/stores/ui/uiStore';
import Project from 'src/models/Project';

export default defineComponent({
  name: 'ProjectManagerLayout',

  components: { EditProjectSuccess },

  setup() {
    if (!userStore.settings.value) return;

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

    const projects = workspaceStore.projects;
    const activeProject = projectStore.activeProject;
    const activeWorkspace = workspaceStore.state.value.activeSpace;

    function isActive(project_id: string) {
      return project_id == activeProject.value?.id;
    }

    function onNewProject() {
      console.log('new project');
      uiStore.toggleShowNewProjectModal();
    }

    async function onDeleteProject(project: Project) {
      await project.delete();
    }

    return {
      leftDrawerOpen: uiStore.appLeftDrawer.open,
      activeWorkspace,
      onToggleLeftDrawer: uiStore.appLeftDrawer.onToggleProjectLeftDrawer,
      miniState: uiStore.appLeftDrawer.mini,
      onDrawerClick: uiStore.appLeftDrawer.onProjectLeftDrawerClicked,
      toMiniDrawer: uiStore.appLeftDrawer.collapseProjectLeftDrawer,
      onNewProject,
      projects,
      isActive,
      activeProject,
      onDeleteProject,
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
