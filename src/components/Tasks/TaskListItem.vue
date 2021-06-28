<template>
  <q-card :class="{ isComplete: isComplete }" @click.prevent="onTaskClicked">
    <div>
      {{ task.sort_by }}
    </div>
    <q-btn color="secondary" :label="task.status" @click="onToggleStatus" />
    <q-card-section>
      <div class="row justify-between items-center">
        <div class="task-name">{{ task.name }}</div>
        <q-btn
          flat
          round
          :text-color="isComplete ? 'green-4' : 'grey-4'"
          icon="eva-checkmark-circle-outline"
          @click="onToggleComplete"
        />
      </div>
      <div class="row justify-between-items-center">
        <q-space />
        <q-btn
          flat
          round
          text-color="red"
          icon="eva-trash-2-outline"
          @click.stop="onDelete"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import Task from 'src/models/Task';
import { defineComponent, ref, PropType } from 'vue';
import TaskEditModal from 'src/components/Tasks/TaskEditModal.vue';

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
  setup(props) {
    const $q = useQuasar();

    const isComplete = ref(props.task.isComplete);
    async function onToggleComplete() {
      await props.task.toggleComplete();
      isComplete.value = !isComplete.value;
    }

    async function onToggleStatus() {
      await props.task.toggleStatus();
    }

    async function onDelete() {
      await props.task.delete();
    }

    function onTaskClicked() {
      $q.dialog({
        component: TaskEditModal,
        componentProps: {
          task: props.task,
        },
      });
      // .onDismiss(() => {})
    }

    return {
      onToggleStatus,
      onToggleComplete,
      onDelete,
      onTaskClicked,
      isComplete,
    };
  },
});
</script>

<style scoped>
.q-card {
  font-size: 1.4rem;
}

.isComplete {
  opacity: 0.7;
}
</style>
