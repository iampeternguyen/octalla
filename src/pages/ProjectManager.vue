<template>
  <q-page class="row q-gutter-md" padding>
    <tasks-list
      v-for="status in TASKS_STATUS_OPTIONS"
      :key="status"
      :status="status"
    ></tasks-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import 'src/idb/index';
import { TASKS_STATUS_OPTIONS } from 'src/models/Task';
import Store from 'src/stores';
import TasksList from 'src/components/Tasks/TasksList.vue';

export default defineComponent({
  components: {
    TasksList,
  },
  setup() {
    const store = inject(Store.StoreKey);
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
