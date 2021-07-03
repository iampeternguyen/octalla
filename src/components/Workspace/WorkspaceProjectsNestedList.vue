<template>
  <div class="q-pl-md">
    <nested-draggable class="draggable" :folders="folders" />
  </div>
</template>

<script lang="ts">
import nestedDraggable from './NestedDraggable.vue';
import { defineComponent, ref, watch } from 'vue';
import { FolderData } from 'src/models/Folder';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';

export default defineComponent({
  name: 'nested-example',
  display: 'Nested',
  order: 15,
  components: {
    nestedDraggable,
  },
  setup() {
    const folders = ref<FolderData[]>(
      WorkspaceViewModel.workspaceFolderStructure.value
    );

    // TODO save folder structure computed with setter? check the other draggable for reacting to changes

    return { folders };
  },
});
</script>
<style scoped>
.draggable {
  width: 100%;
}
</style>
