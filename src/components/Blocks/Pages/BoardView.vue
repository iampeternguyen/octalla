<template>
  <div class="row">
    <block-display
      v-for="block in page.content"
      :key="block.id"
      :block="block"
      :viewType="page.type"
    ></block-display>
  </div>
</template>
<script lang="ts">
import Block, { BLOCK_TYPES } from 'src/models/Block';
import UserViewModel from 'src/viewmodels/UserViewModel';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';

import { defineComponent, reactive } from 'vue';
import BlockDisplay from '../BlockDisplay.vue';

export default defineComponent({
  name: 'BoardToDo',
  components: {
    BlockDisplay,
  },
  setup() {
    if (
      !UserViewModel.properties.settings.value ||
      !WorkspaceViewModel.properties.activeSpace.value
    ) {
      return;
    }
    const page = reactive({
      title: 'To Do Board Template',
      content: [] as Block[],
      type: 'card',
    });

    page.content.push(
      new Block(
        'To Do',
        UserViewModel.properties.settings.value.id,
        WorkspaceViewModel.properties.activeSpace.value.id,
        BLOCK_TYPES.TASK_LIST_BLOCK
      ),
      new Block(
        'In Progress',
        UserViewModel.properties.settings.value.id,
        WorkspaceViewModel.properties.activeSpace.value.id,
        BLOCK_TYPES.TASK_LIST_BLOCK
      ),
      new Block(
        'Completed',
        UserViewModel.properties.settings.value.id,
        WorkspaceViewModel.properties.activeSpace.value.id,
        BLOCK_TYPES.TASK_LIST_BLOCK
      )
    );

    return { page };
  },
});
</script>

<style lang="scss" scoped></style>
