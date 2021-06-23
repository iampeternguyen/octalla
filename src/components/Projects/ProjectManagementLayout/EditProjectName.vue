<template>
  <q-input
    ref="nameInput"
    class="edit-project-name"
    flat
    borderless
    v-model="name"
    @keydown.enter.prevent="onEnterPressed"
    @blur="onNameSaved"
    input-class="text-primary edit-project-name__input"
  >
  </q-input>
</template>

<script lang="ts">
import { QInput } from 'quasar';
import Project from 'src/models/Project';
import { defineComponent, ref, PropType } from 'vue';

export default defineComponent({
  name: 'EditProjectname',
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true,
    },
  },
  setup(props) {
    const name = ref(props.project.name);
    const nameInput = ref<QInput | null>(null);

    function onEnterPressed() {
      if (nameInput.value) nameInput.value.blur();
    }

    async function onNameSaved() {
      if (name.value == props.project.name) return;

      console.log('saving');
      const project = props.project;
      project.name = name.value.trim();
      await project.save();
    }

    return { name, nameInput, onNameSaved, onEnterPressed };
  },
});
</script>

<style lang="scss">
.edit-project-name {
  &__input {
    font-size: 3.5rem;
    font-weight: 300;
  }
}
</style>
