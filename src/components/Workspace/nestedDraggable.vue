<template>
  <draggable
    class="dragArea"
    :list="folders"
    :group="{ name: 'g1' }"
    item-key="name"
  >
    <template #item="{ element }">
      <div>
        <q-expansion-item
          dense
          expand-icon-toggle
          expand-separator
          :label="element.name"
          default-opened
        >
          <nested-draggable
            tag="ul"
            :folders="element.children"
          ></nested-draggable>
        </q-expansion-item>
      </div>
    </template>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  props: {
    folders: {
      required: true,
      type: Array,
    },
  },
  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    draggable,
  },
  name: 'nested-draggable',
};
</script>
<style lang="scss" scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}

.left-drawer-project-link {
  text-decoration: none;
  font-size: 1.4rem;
  color: $grey-8;

  &__active {
    color: $primary;
    font-weight: 500;
  }
}
</style>
