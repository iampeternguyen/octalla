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
      class="bg-blue-grey-9 text-white"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item>
            <q-item-section v-if="miniState">
              <div class="logo-container row items-center justify-center">
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 147 219"
                >
                  <path
                    class="octalla-logo-svg"
                    d="M75.62,123.5c-20.28,0-35.59-3.25-46.81-9.93C14.75,105.2,7.62,91.72,7.62,73.5a68,68,0,0,1,136,0c0,18.22-7.12,31.7-21.18,40.07C111.22,120.25,95.91,123.5,75.62,123.5Z"
                  />
                  <ellipse
                    class="octalla-logo-eyes"
                    cx="58.36"
                    cy="85.93"
                    rx="4.36"
                    ry="5.93"
                  />
                  <ellipse
                    class="octalla-logo-eyes"
                    cx="93.89"
                    cy="85.93"
                    rx="4.36"
                    ry="5.93"
                  />
                  <path
                    class="octalla-logo-svg"
                    d="M37.47,172a15.35,15.35,0,0,1-7.59-2.07,15.69,15.69,0,0,1-7.5-9.78,4,4,0,0,1,7.74-2A7.79,7.79,0,0,0,33.85,163a6.75,6.75,0,0,0,5,.83,6.1,6.1,0,0,0,4-5.29V131a4,4,0,0,1,8,0v28.07a14.07,14.07,0,0,1-9.75,12.42A13.19,13.19,0,0,1,37.47,172Z"
                  />
                  <path
                    class="octalla-logo-svg"
                    d="M44.2,212.5a29.63,29.63,0,0,1-28.15-21.79,5.5,5.5,0,0,1,10.65-2.78A18,18,0,0,0,35.37,199a16.72,16.72,0,0,0,12.5,2c5.37-1.52,9.36-6.67,10-12.84V133a5.5,5.5,0,0,1,11,0v55.68l0,.24c-1,10.78-8.19,19.89-18,22.67A24.47,24.47,0,0,1,44.2,212.5Z"
                  />
                  <path
                    class="octalla-logo-svg"
                    d="M111.78,172a13.19,13.19,0,0,1-3.65-.51,14.07,14.07,0,0,1-9.75-12.42V131a4,4,0,0,1,8,0v27.52a6.1,6.1,0,0,0,4,5.29,6.75,6.75,0,0,0,5-.83,7.79,7.79,0,0,0,3.73-4.82,4,4,0,0,1,7.74,2,15.69,15.69,0,0,1-7.5,9.78A15.35,15.35,0,0,1,111.78,172Z"
                  />
                  <path
                    class="octalla-logo-svg"
                    d="M105.05,212.5a24.47,24.47,0,0,1-6.68-.91c-9.78-2.78-17-11.89-18-22.67l0-.49V133a5.5,5.5,0,0,1,11,0v55.17c.65,6.17,4.64,11.32,10,12.84a16.72,16.72,0,0,0,12.5-2,18,18,0,0,0,8.67-11.11,5.5,5.5,0,0,1,10.65,2.78,29.63,29.63,0,0,1-28.15,21.79Z"
                  />
                </svg>
              </div>
            </q-item-section>
            <q-item-section v-else>
              <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 387 126"
              >
                <path
                  class="octalla-logo-svg"
                  d="M174.52,117.21q-11.62,0-18.18-5.68t-6.55-17q0-11.44,6.83-17T174.79,72a43.63,43.63,0,0,1,8.29.69,29.38,29.38,0,0,1,6.83,2.24V85.33a27.47,27.47,0,0,0-12-2.47q-6.42,0-9.76,2.57c-2.23,1.7-3.34,4.76-3.34,9.15q0,6.14,3.12,8.93t9.89,2.8A26.91,26.91,0,0,0,190,103.56v10.9a29.53,29.53,0,0,1-7.1,2.1A50.21,50.21,0,0,1,174.52,117.21Z"
                />
                <path
                  class="octalla-logo-svg"
                  d="M215.37,117.21q-8.07,0-11.86-4.13t-3.8-11.35V84.05h-5.87V72.88h5.87V63.81l14.74-3.94v13H225l-.64,11.17h-9.89v16.67q0,3.12,1.56,4.35a7.42,7.42,0,0,0,4.67,1.24,17,17,0,0,0,5.4-.92v10A27.44,27.44,0,0,1,215.37,117.21Z"
                />
                <path
                  class="octalla-logo-svg"
                  d="M245.31,117.21a19.77,19.77,0,0,1-7.64-1.47,12.54,12.54,0,0,1-5.64-4.53,13.25,13.25,0,0,1-2.1-7.65q0-6.69,4.53-10.49t13.6-3.8h12.09v-1a5.18,5.18,0,0,0-2.2-4.71q-2.19-1.42-8.24-1.42a47.28,47.28,0,0,0-14.56,2.29V74.89a40.54,40.54,0,0,1,7.83-2.1,55.41,55.41,0,0,1,9.75-.83q10.08,0,15.8,4.12t5.72,13.1v27.11H261.34l-.73-3.66a16.12,16.12,0,0,1-6.09,3.38A30.31,30.31,0,0,1,245.31,117.21Zm4.67-9.07a14.32,14.32,0,0,0,6-1.19,12,12,0,0,0,4.12-3V97.79H249.71c-4.34,0-6.5,1.74-6.5,5.22a4.6,4.6,0,0,0,1.64,3.75Q246.5,108.14,250,108.14Z"
                />
                <path
                  class="octalla-logo-svg"
                  d="M296.51,117.21q-7.15,0-10.26-3.12t-3.11-10V54.56h14.74v48.08a3,3,0,0,0,3.48,3.67,14.15,14.15,0,0,0,4.4-.64v10a22.63,22.63,0,0,1-4.17,1.19A30.05,30.05,0,0,1,296.51,117.21Z"
                />
                <path
                  class="octalla-logo-svg"
                  d="M322.42,117.21q-7.14,0-10.25-3.12t-3.12-10V54.56H323.8v48.08a3,3,0,0,0,3.48,3.67,14,14,0,0,0,4.39-.64v10a22.32,22.32,0,0,1-4.16,1.19A30.18,30.18,0,0,1,322.42,117.21Z"
                />
                <path
                  class="octalla-logo-svg"
                  d="M350.82,117.21a19.86,19.86,0,0,1-7.65-1.47,12.51,12.51,0,0,1-5.63-4.53,13.18,13.18,0,0,1-2.11-7.65q0-6.69,4.53-10.49t13.6-3.8h12.09v-1a5.18,5.18,0,0,0-2.2-4.71q-2.19-1.42-8.24-1.42a47.33,47.33,0,0,0-14.56,2.29V74.89a40.94,40.94,0,0,1,7.83-2.1,55.41,55.41,0,0,1,9.75-.83q10.08,0,15.8,4.12t5.73,13.1v27.11H366.84l-.73-3.66A16.12,16.12,0,0,1,360,116,30.24,30.24,0,0,1,350.82,117.21Zm4.67-9.07a14.27,14.27,0,0,0,6-1.19,12,12,0,0,0,4.12-3V97.79H355.21q-6.49,0-6.5,5.22a4.6,4.6,0,0,0,1.65,3.75Q352,108.14,355.49,108.14Z"
                />
                <path
                  class="octalla-logo-svg"
                  d="M75.62,121.5c-20.28,0-35.59-3.25-46.81-9.93C14.75,103.2,7.62,89.72,7.62,71.5a68,68,0,0,1,136,0c0,18.22-7.12,31.7-21.18,40.07C111.22,118.25,95.91,121.5,75.62,121.5Z"
                />
                <ellipse
                  class="octalla-logo-eyes"
                  cx="58.36"
                  cy="83.93"
                  rx="4.36"
                  ry="5.93"
                />
                <ellipse
                  class="octalla-logo-eyes"
                  cx="93.89"
                  cy="83.93"
                  rx="4.36"
                  ry="5.93"
                />
              </svg>
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
                color="white"
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
            ``
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
    <chat-footer></chat-footer>
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import NewProjectModal from 'src/components/Projects/NewProjectModal.vue';
import Project from 'src/models/Project';
import WorkspaceProjectsNestedList from 'src/components/Workspace/WorkspaceProjectsNestedList.vue';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
import UserViewModel from 'src/viewmodels/UserViewModel';
import ProjectViewModel from 'src/viewmodels/ProjectViewModel';
import UIViewModel from 'src/viewmodels/UIViewModel';
import ChatFooter from 'src/components/Chat/ChatFooter.vue';

export default defineComponent({
  name: 'ProjectManagerLayout',
  components: {
    WorkspaceProjectsNestedList,
    ChatFooter,
  },

  setup() {
    if (!UserViewModel.properties.settings.value) return;

    const router = useRouter();

    watchForNewProjectModal();

    function watchForNewProjectModal() {
      const $q = useQuasar();
      // does not need store

      watch(UIViewModel.showNewProjectModal, (show) => {
        if (show) {
          $q.dialog({
            component: NewProjectModal,
          }).onDismiss(() => {
            UIViewModel.toggleShowNewProjectModal();
          });
        }
      });
    }

    const projects = WorkspaceViewModel.properties.projects.value;

    const activeProject = ProjectViewModel.properties.activeProject;
    const activeWorkspace = WorkspaceViewModel.properties.activeSpace;

    function onNewProject() {
      console.log('new project');
      UIViewModel.toggleShowNewProjectModal();
    }
    // TODO move method
    async function onDeleteProject(project: Project) {
      await ProjectViewModel.methods.deleteProject(project);
      if (project.id == activeProject.value?.id)
        await router.push({ name: 'app' });
    }

    return {
      leftDrawerOpen: UIViewModel.appLeftDrawer.open,
      activeWorkspace,
      onDeleteProject,
      onToggleLeftDrawer: UIViewModel.appLeftDrawer.onToggleProjectLeftDrawer,
      miniState: UIViewModel.appLeftDrawer.mini,
      onDrawerClick: UIViewModel.appLeftDrawer.onProjectLeftDrawerClicked,
      toMiniDrawer: UIViewModel.appLeftDrawer.collapseProjectLeftDrawer,
      onNewProject,
      projects,
      activeProject,
    };
  },
});
</script>

<style lang="scss" scoped>
.logo-container {
  width: 2.4rem;
}
.octalla-logo-svg {
  fill: white;
}

.octalla-logo-eyes {
  fill: $blue-grey-9;
}
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
