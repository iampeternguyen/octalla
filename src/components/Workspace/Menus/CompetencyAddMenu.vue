<template>
  <q-form @submit.prevent="onSave" @reset="onReset" class="q-gutter-md q-pa-md">
    <!-- TODO allow multiple saving and only save competencies that have been changed -->
    <competency-field-input
      :formState="formState"
      v-for="competency in competencies"
      :key="competency.id"
      :competency="competency"
    ></competency-field-input>
    <competency-field-input
      :formState="formState"
      v-for="index in count"
      :key="index"
    ></competency-field-input>
    <q-btn color="accent" flat label="+ Competency" @click="addField" />
    <div>
      <q-btn label="Save" type="submit" color="primary" />
    </div>
  </q-form>
</template>
<script lang="ts">
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
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
    const count = ref(0);

    const competencies = WorkspaceViewModel.competencies.value;

    function onFormSubmit() {
      console.log('submitting form');
    }

    function onSave() {
      formState.saving = !formState.saving;
    }
    function addField() {
      count.value++;
    }

    function onReset() {
      console.log('reset');
    }
    return {
      name,
      description,
      formState,
      addField,
      onFormSubmit,
      onSave,
      onReset,
      competencies,
      count,
    };
  },
});
</script>

<style lang="scss" scoped></style>
