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
    // TODO save folder structure computed with setter? check the other draggable for reacting to changes
    // TODO watch changes from other browsers
    // Idea, when adding a new project, workspaceVM sets a flag to false, so the watcher here doesn't update. when the watcher finishes reset the flag to true
    // other changes made in the nested list will trigger a save
    const folders = ref<FolderData[]>(
      WorkspaceViewModel.workspaceFolderStructure.value
    );

    watch(folders.value, (newValue) => {
      console.log(newValue);
    });

    return { folders };
  },
});
</script>
<style scoped>
.draggable {
  width: 100%;
}
</style>
