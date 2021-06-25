<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-white text-primary shadow-2" height-hint="98">
      <q-toolbar class="row justify-between">
        <q-btn dense flat round icon="menu" @click="onToggleLeftDrawer" />

        <div v-if="activeProject">
          <edit-project-name :project="activeProject"></edit-project-name>

          <edit-project-goal
            class="col-grow"
            :project="activeProject"
          ></edit-project-goal>
        </div>

        <q-btn dense flat round icon="menu" @click="onToggleRightDrawer" />
      </q-toolbar>
    </q-header>

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
            <router-link
              v-if="projects"
              class="left-drawer-project-link"
              v-for="project in projects"
              :key="project.id"
              :to="{ name: 'project', params: { project_id: project.id } }"
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
            </router-link>
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
          @click="miniState = true"
        />
      </div>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered overlay>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Store from 'src/stores';
import { defineComponent, ref, inject, watch } from 'vue';
import { useRoute } from 'vue-router';
import EditProjectGoal from 'src/components/Projects/ProjectManagementLayout/EditProjectGoal.vue';
import EditProjectSuccess from 'src/components/Projects/ProjectManagementLayout/EditProjectSuccess.vue';
import EditProjectName from 'src/components/Projects/ProjectManagementLayout/EditProjectName.vue';

export default defineComponent({
  name: 'ProjectManagerLayout',

  components: { EditProjectGoal, EditProjectSuccess, EditProjectName },

  setup() {
    const store = inject(Store.StoreKey);
    const route = useRoute();
    if (!store) return;

    // watch(
    //   route,
    //   () => {
    //     store.setActiveProject(route.params.project_id.toString());
    //   },
    //   { immediate: true }
    // );

    const projects = store.projectsList;
    const activeProject = store.activeProject;

    function isActive(project_id: string) {
      return project_id == activeProject.value?.id;
    }
    const leftDrawerOpen = ref(true);
    const rightDrawerOpen = ref(false);
    const miniState = ref(false);
    function onToggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    function onToggleRightDrawer() {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    }

    function onDrawerClick(e: Event) {
      // if in "mini" state and user
      // click on drawer, we switch it to "normal" mode
      if (miniState.value) {
        miniState.value = false;

        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        e.stopPropagation();
      }
    }

    function onNewProject() {
      if (!store) return;
      console.log('new project');
      store.toggleShowNewProjectModal();
    }

    return {
      leftDrawerOpen,
      onToggleLeftDrawer,
      miniState,
      onToggleRightDrawer,
      onDrawerClick,
      rightDrawerOpen,
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
