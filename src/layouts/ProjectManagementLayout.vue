<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-primary shadow-2" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="onToggleLeftDrawer" />

        <q-toolbar-title>
          <q-img
            src="/logo/Logo_Main.png"
            height="3rem"
            fit="contain"
            position="0% 50%"
          />
        </q-toolbar-title>

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
        <q-list padding>
          <q-item dense clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="eva-bell-outline" />
            </q-item-section>

            <q-item-section> Notifications </q-item-section>
          </q-item>

          <q-expansion-item
            dense
            expand-separator
            icon="eva-browser-outline"
            label="Projects"
            default-opened
          >
            <q-item dense class="justify-center items-center">
              <q-btn
                flat
                class="q-px-lg"
                color="primary"
                icon="eva-plus-outline"
                label="New Project"
                @click="onNewProject"
                dense
                rounded
              />
            </q-item>
            <router-link
              class="side-menu-link"
              v-for="project in projects"
              :key="project.id"
              :to="{ name: 'project', params: { project_id: project.id } }"
            >
              <q-expansion-item
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

            <q-item-section> Star </q-item-section>
          </q-item>

          <q-item dense clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="send" />
            </q-item-section>

            <q-item-section> Send </q-item-section>
          </q-item>

          <q-item dense clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>

            <q-item-section> Drafts </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!--
          in this case, we use a button (can be anything)
          so that user can switch back
          to mini-mode
        -->
      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
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

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Store from 'src/stores';
import { defineComponent, ref, inject } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const store = inject(Store.StoreKey);
    if (!store) return;
    const projects = store.projectsList;

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
    };
  },
});
</script>

<style lang="scss">
.side-menu-link {
  text-decoration: none;
  color: $grey-8;
}
</style>
