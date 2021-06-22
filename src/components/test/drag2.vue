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
      { name: 'Juan', id: 5 },
      { name: 'Edgard', id: 6 },
      { name: 'Johnson', id: 7 },
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
