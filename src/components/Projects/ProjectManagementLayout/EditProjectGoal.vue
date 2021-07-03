<template>
  <q-input
    ref="goalInput"
    class="q-ml-lg"
    flat
    borderless
    :placeholder="'What\'s the goal of this project?'"
    v-model="goal"
    input-class="edit-project-goal__input"
    @keydown.enter.prevent="onEnterPressed"
    @blur="onGoalSaved"
  >
  </q-input>
</template>

<script lang="ts">
import { QInput } from 'quasar';
import Project, { ProjectData } from 'src/models/Project';
import ProjectViewModel from 'src/viewmodels/ProjectViewModel';
import { defineComponent, ref, PropType } from 'vue';

export default defineComponent({
  name: 'EditProjectGoal',
  props: {
    project: {
      type: Object as PropType<ProjectData>,
      required: true,
    },
  },
  setup(props) {
    const goal = ref(props.project.primary_goal);
    const goalInput = ref<QInput | null>(null);

    function onEnterPressed() {
      if (goalInput.value) goalInput.value.blur();
    }

    async function onGoalSaved() {
      if (goal.value == props.project.primary_goal) return;

      console.log('saving');
      const project = props.project;
      project.primary_goal = goal.value.trim();
      await ProjectViewModel.saveProject(project);
    }

    return { goal, goalInput, onGoalSaved, onEnterPressed };
  },
});
</script>

<style lang="scss">
.edit-project-goal__input {
  font-size: 2rem;
  font-weight: 300;
}
</style>
