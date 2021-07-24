<template>
  <div class="col-2">
    {{ block.title }}
    <block-display
      v-for="block in content"
      :key="block.id"
      :block="block"
      :viewType="'card'"
    ></block-display>
    <add-task-block :addToParent="addToParent"></add-task-block>
  </div>
</template>
<script lang="ts">
import Block from 'src/models/Block';
import { defineComponent, ref, PropType } from 'vue';
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
  },
  setup(props) {
    const content = ref<Block[]>([]);

    function addToParent(block: Block) {
      // TODO fix this
      // eslint-disable-next-line vue/no-mutating-props
      props.block.content.push(block.id);
      content.value.push(block);
    }

    return { addToParent, content };
  },
});
</script>

<style lang="scss" scoped></style>
