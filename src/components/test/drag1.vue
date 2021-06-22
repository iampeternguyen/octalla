<template>
  <draggable
    class="list-group"
    :list="list1"
    group="people"
    @change="log"
    itemKey="name"
  >
    <template #item="{ element, index }">
      <div class="list-group-item">{{ element.name }} {{ index }}</div>
    </template>
  </draggable>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

export default defineComponent({
  name: 'drag1',
  components: {
    draggable,
  },
  setup() {
    const list1 = ref([
      { name: 'John', id: 1 },
      { name: 'Joao', id: 2 },
      { name: 'Jean', id: 3 },
      { name: 'Gerard', id: 4 },
    ]);
    return {
      list1,
      log: function (evt: Event) {
        window.console.log(evt);
      },
    };
  },
});
</script>

<style lang="scss" scoped></style>
