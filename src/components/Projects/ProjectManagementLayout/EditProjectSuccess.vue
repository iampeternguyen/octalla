<template>
  <div class="column items-center full-width">
    <div class="successHeader">Success looks like...</div>
    <q-input
      ref="successInput"
      class="project-success q-ml-lg full-width q-px-md"
      type="textarea"
      autogrow
      flat
      borderless
      :placeholder="'What does success look like on this project?'"
      v-model="success"
      @keydown.enter.prevent="onEnterPressed"
      @blur="onGoalSaved"
    >
    </q-input>
  </div>
</template>

<script lang="ts">
import { QInput } from 'quasar';
import Project, { ProjectData } from 'src/models/Project';
import ProjectViewModel from 'src/viewmodels/ProjectViewModel';
import { defineComponent, ref, PropType } from 'vue';

export default defineComponent({
  name: 'EditProjectSuccess',
  props: {
    project: {
      type: Object as PropType<ProjectData>,
      required: true,
    },
  },
  setup(props) {
    const success = ref(props.project.success_looks_like);

    const successInput = ref<QInput | null>(null);

    function onEnterPressed() {
      if (successInput.value) successInput.value.blur();
    }

    async function onGoalSaved() {
      if (success.value == props.project.success_looks_like) return;
      const project = props.project;

      project.success_looks_like = success.value.trim();
      await ProjectViewModel.updateProject(project);
    }

    return { success, successInput, onGoalSaved, onEnterPressed };
  },
});
</script>

<style lang="scss" scoped>
.successHeader {
  font-size: 2rem;
}
</style>
