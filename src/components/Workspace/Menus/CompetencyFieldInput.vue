<template>
  <div class="row">
    <q-input dense v-model="name" type="text" label="Name" class="q-mr-md" />
    <q-input dense v-model="description" type="text" label="Description" />
  </div>
</template>
<script lang="ts">
import Competency from 'src/models/Competency';
import workspaceStore from 'src/stores/workspace/workspaceStore';
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

    watch(props.formState, async (formState) => {
      if (!formState.saving) return;
      if (
        props.competency &&
        (props.competency.name != name.value.trim() ||
          props.competency.description != description.value.trim())
      ) {
        const competency = Competency.deserialize(props.competency);

        competency.name = name.value;
        competency.description = description.value;
        await competency.save();
      } else if (!props.competency && workspaceStore.activeWorkspace.value) {
        const competency = new Competency(
          name.value,
          workspaceStore.activeWorkspace.value.id
        );
        competency.description = description.value;
        name.value = '';
        description.value = '';
        await competency.save();
      }
    });
    return {
      name,
      description,
    };
  },
});
</script>

<style lang="scss" scoped></style>
