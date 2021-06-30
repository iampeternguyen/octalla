<template>
  <div class="row">
    <div class="col-8">
      <h3>Nested draggable</h3>
      <nested-draggable :folders="folders" />
    </div>
  </div>
</template>

<script lang="ts">
import nestedDraggable from './NestedDraggable.vue';
import { defineComponent, ref, watch } from 'vue';
import workspaceStore from 'src/stores/workspace/workspaceStore';
import { FolderData } from 'src/models/Folder';

export default defineComponent({
  name: 'nested-example',
  display: 'Nested',
  order: 15,
  components: {
    nestedDraggable,
  },
  setup() {
    const folders = ref<FolderData[]>(workspaceStore.projectsStructure.value);

    watch(workspaceStore.projectsStructure, (projectsStructure) => {
      if (projectsStructure) folders.value = projectsStructure;
    });
    return { folders };
  },
});
</script>
<style scoped></style>
