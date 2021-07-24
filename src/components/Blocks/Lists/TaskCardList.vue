<template>
  <div class="col-2">
    {{ block.title }}
    <!-- <block-vue
      v-for="block in content"
      :key="block.id"
      :block="block"
      :viewType="'card'"
    ></block-vue> -->

    <task-card
      v-for="block in content"
      :key="block.id"
      :block="block"
      :viewType="'card'"
    ></task-card>
    <add-task-block :addToParent="addToParent"></add-task-block>
  </div>
</template>
<script lang="ts">
import Block from 'src/models/Block';
import { defineComponent, ref, PropType } from 'vue';
import TaskCard from '../Cards/TaskCard.vue';
// import BlockVue from '../Block.vue';
import AddTaskBlock from '../CreateBlocks/AddTaskBlock.vue';

export default defineComponent({
  name: 'TaskCardList',
  props: {
    block: {
      type: Object as PropType<Block>,
      required: true,
    },
  },
  components: {
    AddTaskBlock,
    TaskCard,
    // BlockVue,
  },
  setup(props) {
    const content = ref<Block[]>([]);

    function addToParent(block: Block) {
      props.block.content.push(block.id);
      content.value.push(block);
    }

    return { addToParent, content };
  },
});
</script>

<style lang="scss" scoped></style>
