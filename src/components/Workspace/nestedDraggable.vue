<template>
  <draggable
    class="dragArea"
    :list="folders"
    :group="{ name: 'g1' }"
    item-key="id"
  >
    <template #item="{ element }">
      <div class="row">
        <q-icon
          name="eva-browser-outline"
          class="handle"
          :class="{ active: element.id == activeProject?.id }"
        />
        <div class="folder">
          <q-expansion-item dense expand-icon-toggle default-opened>
            <template v-slot:header>
              <q-item-section>
                <router-link
                  class="left-drawer-project-link"
                  :class="{ active: element.id == activeProject?.id }"
                  :to="{
                    name: 'project',
                    params: {
                      project_id: element.id,
                    },
                  }"
                >
                  {{ element.name }}
                </router-link>
              </q-item-section>
            </template>

            <nested-draggable :folders="element.children"></nested-draggable>
          </q-expansion-item>
        </div>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { defineComponent, computed } from 'vue';
import ProjectViewModel from 'src/viewmodels/ProjectViewModel';

export default defineComponent({
  props: {
    folders: {
      required: true,
      type: Array,
    },
  },
  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    draggable,
  },
  name: 'nested-draggable',
  setup() {
    const activeProject = ProjectViewModel.properties.activeProject;

    return {
      activeProject,
    };
  },
});
</script>
<style lang="scss" scoped>
.dragArea {
  min-height: 2rem;
  width: 100%;
  //   outline: 1px dashed;
}
.handle {
  padding-top: 0.8rem;
  cursor: move;
}
.folder {
  flex-grow: 1;
  &-header {
    :hover {
      background-color: $grey-3;
    }
  }
}

.left-drawer-project-link {
  text-decoration: none;
  font-size: 1.4rem;
  color: white;
}

.active {
  color: $primary;
  font-weight: 500;
}

ul {
  margin-left: 0rem;
}
</style>
