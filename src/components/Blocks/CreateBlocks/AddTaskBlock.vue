<template>
  <q-input
    ref="addTaskInputRef"
    v-model="title"
    dense
    placeholder="+ New Task"
    borderless
    lazy-rules
    @keydown.enter.prevent="addTask"
    :rules="[(val) => !!val || 'Task can\'t be empty']"
    @blur="onAddTaskBlur"
  >
  </q-input>
</template>
<script lang="ts">
import { QInput } from 'quasar';
import TaskBlock from 'src/models/Block';
import BlocksViewModel from 'src/viewmodels/BlocksViewModel';
import UserViewModel from 'src/viewmodels/UserViewModel';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
import { defineComponent, ref, PropType } from 'vue';

export default defineComponent({
  name: 'AddTaskBlock',
  props: {
    addToParent: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const addTaskInputRef = ref<QInput | null>(null);
    const title = ref('');

    function addTask() {
      if (
        !title.value ||
        !UserViewModel.properties.settings.value ||
        !WorkspaceViewModel.properties.activeSpace.value
      ) {
        addTaskInputRef.value?.validate();
        return;
      }

      const block = new TaskBlock(
        title.value,
        UserViewModel.properties.settings.value.id,
        WorkspaceViewModel.properties.activeSpace.value.id
      );

      //   if (props.category == 'status' && props.field != 'Empty') {
      //     block.task[props.category] = props.field.toString();
      //   } else if (props.category == 'competency' && props.field != 'Empty') {
      //     block.task[props.category] =
      //       WorkspaceViewModel.properties.competencies.value.find(
      //         (comp) => comp.name == props.field
      //       )?.id || '';
      //   } else if (props.field == 'Empty' && props.category == 'competency') {
      //     block.task[props.category] = '';
      //   }

      // await BlocksViewModel.saveBlock(block.serialize());
      props.addToParent(block);
      title.value = '';
      addTaskInputRef.value?.resetValidation();
      addTaskInputRef.value?.blur();
    }

    function onAddTaskBlur() {
      console.log('blur');
      addTaskInputRef.value?.resetValidation();
    }

    return { addTaskInputRef, title, addTask, onAddTaskBlur };
  },
});
</script>

<style lang="scss" scoped></style>
