<template>
  <q-page class="row q-gutter-md" padding>
    <!-- <div class="row">
      <div class="col-3">
        <h3>Draggable 1</h3>
        <drag-1-vue></drag-1-vue>
      </div>

      <div class="col-3">
        <h3>Draggable 2</h3>
        <drag-2-vue></drag-2-vue>
      </div>
    </div> -->
    <tasks-list
      v-for="status in TASKS_STATUS_OPTIONS"
      :key="status"
      :status="status"
    ></tasks-list>

    <!-- <div
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
    </div> -->
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
import TasksList from 'src/components/Tasks/TasksList.vue';

export default defineComponent({
  components: {
    TaskListItem,

    TasksList,
  },
  setup() {
    const store = inject(Store.StoreKey);
    const route = useRoute();
    if (!store) return;

    const tasks = store.projectTasks;

    const text = ref('');

    function filteredTasks(status: string) {
      return tasks.value.filter((t) => t.status == status);
    }

    return {
      text,
      filteredTasks,
      tasks,
      TASKS_STATUS_OPTIONS,
    };
  },
});
</script>

<style lang="scss"></style>
