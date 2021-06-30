<template>
  <div class="row">
    <q-input dense v-model="name" type="text" label="Name" class="q-mr-md" />
    <q-input dense v-model="description" type="text" label="Description" />
  </div>
</template>
<script lang="ts">
import Competency from 'src/models/Competency';
import { defineComponent, watch, PropType, ref } from 'vue';

export default defineComponent({
  name: 'CompetencyFieldInput',
  props: {
    formState: {
      type: Object,
      required: true,
    },
    competency: {
      type: Object as PropType<Competency>,
    },
  },
  setup(props) {
    const name = ref('');
    const description = ref('');

    if (props.competency) {
      name.value = props.competency.name.toString();
      description.value = props.competency.description.toString();
    }

    watch(props.formState, (formState) => {
      console.log('save form: ', formState.saving);
    });
    return {
      name,
      description,
    };
  },
});
</script>

<style lang="scss" scoped></style>
