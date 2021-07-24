<template>
  <task-card-list v-if="isTaskList" :block="block"></task-card-list>
  <task-card v-if="isTaskCard" :block="block"></task-card>
</template>
<script lang="ts">
import Block, { BLOCK_TYPES } from 'src/models/Block';
import { defineComponent, PropType, computed } from 'vue';
import TaskCard from './Cards/TaskCard.vue';
import TaskCardList from './Lists/TaskCardList.vue';

export default defineComponent({
  name: 'BlockDisplay',
  components: {
    TaskCard,
    TaskCardList,
  },
  props: {
    block: {
      type: Object as PropType<Block>,
      required: true,
    },
    viewType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isTaskCard = computed(() => {
      return (
        props.block.type === BLOCK_TYPES.TASK_BLOCK && props.viewType === 'card'
      );
    });

    const isTaskList = computed(() => {
      return props.block.type === BLOCK_TYPES.TASK_LIST_BLOCK;
    });

    return { isTaskCard, isTaskList };
  },
});
</script>

<style lang="scss" scoped></style>
