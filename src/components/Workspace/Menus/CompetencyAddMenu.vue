<template>
  <q-form @submit.prevent="onSave" @reset="onReset" class="q-gutter-md q-pa-md">
    <competency-field-input
      :formState="formState"
      v-for="competency in competencies"
      :key="competency.id"
      :competency="competency"
    ></competency-field-input>
    <competency-field-input :formState="formState"></competency-field-input>
    <div>
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>
<script lang="ts">
import workspaceStore from 'src/stores/workspace/workspaceStore';
import { defineComponent, ref, reactive } from 'vue';
import CompetencyFieldInput from './CompetencyFieldInput.vue';
export default defineComponent({
  name: 'CompetencyAddMenu',
  components: {
    CompetencyFieldInput,
  },
  setup() {
    const name = ref('');
    const description = ref('');
    const formState = reactive({
      saving: false,
    });

    const competencies = workspaceStore.state.value.competencies;

    function onFormSubmit() {
      console.log('submitting form');
    }

    function onSave() {
      formState.saving = !formState.saving;
    }
    return {
      name,
      description,
      formState,
      onFormSubmit,
      onSave,
      competencies,
    };
  },
});
</script>

<style lang="scss" scoped></style>
