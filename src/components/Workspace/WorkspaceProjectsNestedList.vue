<template>
  <div class="row">
    <div class="col-8">
      <h3>Nested draggable</h3>
      <nested-draggable :tasks="list" />
    </div>
  </div>
</template>

<script lang="ts">
import nestedDraggable from './nestedDraggable.vue';
import { defineComponent, ref, watch } from 'vue';
import workspaceStore from 'src/stores/workspace/workspaceStore';
import Project from 'src/models/Project';
import Folder, { FolderChild } from 'src/models/Folder';
import projectStore from 'src/stores/project/projectStore';

class ListItem {
  name: string;
  projects: ListItem[];

  constructor(name: string) {
    this.name = name;
    this.projects = [];
  }
}

export default defineComponent({
  name: 'nested-example',
  display: 'Nested',
  order: 15,
  components: {
    nestedDraggable,
  },
  setup() {
    const list = ref<Folder[]>(moveToRootFolder(workspaceStore.projects.value));
    // TODO change this to a property on the workspace model. It can just be snippets of projects and folders
    function moveToRootFolder(projects: Project[]) {
      const projectsList = [] as Folder[];

      projects.forEach((proj) => {
        const child = Folder.convertProjectToFolder(proj);
        projectsList.push(child);
      });
      return projectsList;
    }

    watch(workspaceStore.projects.value, (projects) => {
      list.value = moveToRootFolder(projects);
    });
    return { list };
  },
});
</script>
<style scoped></style>
