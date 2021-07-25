<template>
  <div id="EditorBlock">
    <tip-tap></tip-tap>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TipTap from './TipTap.vue';

export default defineComponent({
  name: 'EditorBlock',
  components: {
    TipTap,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped></style>
