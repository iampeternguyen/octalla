<template>
  <q-page class="row q-gutter-md" padding>
    <div
      class="tasks-list column col-2 q-gutter-md"
      v-for="statusOptions in TASKS_STATUS_OPTIONS"
      :key="statusOptions"
    >
      <div class="tasks-"></div>
      <q-card class="project-list-category-card">
        <q-card-section class="q-py-sm">
          <div class="project-list-category-card__name-text">
            {{ statusOptions }}
          </div>
        </q-card-section>
      </q-card>

      <task-list-item
        v-for="task in filteredTasks(statusOptions)"
        :key="task.id"
        :task="task"
        draggable="true"
      >
      </task-list-item>

      <q-input
        ref="addTaskInputRef"
        v-model="text"
        dense
        placeholder="+ New Task"
        borderless
        lazy-rules
        @keydown.enter.prevent="addTask"
        :rules="[(val) => !!val || 'Task can\'t be empty']"
      >
      </q-input>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import 'src/idb/index';
import Task, { TASKS_STATUS_OPTIONS } from 'src/models/Task';
import TaskListItem from 'components/Tasks/TaskListItem.vue';
import Store from 'src/stores';
import { QInput } from 'quasar';

export default defineComponent({
  components: {
    TaskListItem,
  },
  setup() {
    const store = inject(Store.StoreKey);
    const route = useRoute();
    if (!store) return;

    const addTaskInputRef = ref<QInput | null>(null);
    const tasks = store.projectTasks;

    const text = ref('');

    async function addTask() {
      if (!text.value) return;
      const task = new Task(text.value);
      task.project_id = route.params.project_id.toString();
      await task.save();
      text.value = '';
      addTaskInputRef.value?.resetValidation();
      addTaskInputRef.value?.blur();
    }

    function filteredTasks(status: string) {
      return tasks.value.filter((t) => t.status == status);
    }

    return {
      text,
      addTask,
      filteredTasks,
      tasks,
      addTaskInputRef,
      TASKS_STATUS_OPTIONS,
    };
  },
});
</script>

<style lang="scss"></style>
