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
          :class="{
            'text-primary': isActive(element.id),
          }"
        />
        <router-link
          class="left-drawer-project-link folder"
          :to="{
            name: 'project',
            params: {
              project_id: element.id,
            },
          }"
          :class="{
            'left-drawer-project-link__active': isActive(element.id),
          }"
        >
          <q-expansion-item
            dense
            expand-icon-toggle
            :expand-icon-class="{ 'text-primary': isActive(element.id) }"
            default-opened
          >
            <template v-slot:header>
              <q-item-section> {{ element.name }} </q-item-section>

              <q-item-section side>
                <div class="row items-center"></div>
              </q-item-section>
            </template>
            <nested-draggable
              :folders="element.children"
              class="q-pl-md"
            ></nested-draggable>
          </q-expansion-item>
        </router-link>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { defineComponent } from 'vue';
import projectStore from 'src/stores/project/projectStore';

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
    const activeProject = projectStore.activeProject;

    function isActive(project_id: string) {
      return project_id == activeProject.value?.id;
    }
    return {
      isActive,
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
  color: $grey-8;

  &__active {
    color: $primary;
    font-weight: 500;
  }
}

ul {
  margin-left: 0rem;
}
</style>
