<template>
  <div class="row">
    <q-input
      dense
      outlined
      v-model="name"
      type="text"
      label="Name"
      class="q-mr-md"
    />
    <q-input
      dense
      outlined
      v-model="description"
      type="text"
      label="Description"
    />
    <q-btn
      color="red"
      flat
      round
      icon="eva-trash-2-outline"
      @click="onDelete"
      v-if="hasCompetency"
    />
  </div>
</template>
<script lang="ts">
import Competency from 'src/models/Competency';
import UserViewModel from 'src/viewmodels/UserViewModel';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
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

    const hasCompetency = props.competency instanceof Competency;

    if (props.competency) {
      name.value = props.competency.name.toString();
      description.value = props.competency.description.toString();
    }

    watch(props.formState, async (formState) => {
      if (!formState.saving) return;
      if (name.value == '') {
        formState.saving = false;
        return;
      }
      if (
        props.competency &&
        (props.competency.name != name.value.trim() ||
          props.competency.description != description.value.trim())
      ) {
        const competency = Competency.deserialize(props.competency);

        competency.name = name.value;
        competency.description = description.value;
        await competency.save();
        formState.saving = false;
      } else if (
        !props.competency &&
        WorkspaceViewModel.activeSpace.value &&
        UserViewModel.settings.value
      ) {
        const competency = new Competency(
          name.value,
          UserViewModel.settings.value.id,
          WorkspaceViewModel.activeSpace.value.id
        );
        competency.description = description.value;
        name.value = '';
        description.value = '';
        await competency.save();
        formState.saving = false;
      }
    });

    async function onDelete() {
      if (props.competency) {
        console.log('deleting competency');
        await props.competency.delete();
      }
    }
    return {
      name,
      description,
      onDelete,
      hasCompetency,
    };
  },
});
</script>

<style lang="scss" scoped></style>
