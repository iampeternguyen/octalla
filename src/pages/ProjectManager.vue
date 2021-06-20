<template>
  <q-page class="row" padding>
    <div class="column col-2 q-gutter-md">
      <q-card class="project-list-category-card">
        <q-card-section class="q-py-sm">
          <div class="project-list-category-card__name-text">In-Progress</div>
        </q-card-section>
      </q-card>

      <task-list-item v-for="task in tasks" :key="task.id" :task="task">
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
import 'src/idb/index';
import Task from 'src/models/Task';
import TaskListItem from 'components/Tasks/TaskListItem.vue';
import Store from 'src/stores';
import firebase from 'firebase/app';
import { QInput } from 'quasar';

export default defineComponent({
  components: {
    TaskListItem,
  },
  setup() {
    const store = inject(Store.StoreKey);
    if (!store) return;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.watchTasks(user.uid);
      }
    });

    const addTaskInputRef = ref<QInput | null>(null);
    const tasks = store.projectTasks;

    const text = ref('');

    async function addTask() {
      if (!text.value) return;
      const task = new Task(text.value);
      await task.save();
      text.value = '';
      addTaskInputRef.value?.resetValidation();
      addTaskInputRef.value?.blur();
    }

    return {
      text,
      addTask,
      tasks,
      addTaskInputRef,
    };
  },
});
</script>

<style lang="scss"></style>
