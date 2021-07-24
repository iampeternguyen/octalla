<template>
  <div>
    <div v-for="block in boardGroup.content" :key="block.id">
      {{ block.title }}
    </div>
    <add-task-block :addToParent="addToParent"></add-task-block>
  </div>
</template>
<script lang="ts">
import TaskBlock from 'src/models/Block';

import { defineComponent, reactive } from 'vue';
import AddTaskBlock from '../CreateBlocks/AddTaskBlock.vue';

export default defineComponent({
  name: 'BoardToDo',
  components: {
    AddTaskBlock,
  },
  setup() {
    const boardGroup = reactive({
      title: 'Testing',
      content: [] as TaskBlock[],
    });

    function addToParent(block: TaskBlock) {
      boardGroup.content.push(block);
    }

    return { boardGroup, addToParent };
  },
});
</script>

<style lang="scss" scoped></style>
