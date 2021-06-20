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

      <q-card class="q-pa-sm">
        <q-input v-model="text" borderless>
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click="addTask" />
          </template>
        </q-input>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import 'src/idb/index';
import Task from 'src/models/Task';
import TaskListItem from 'components/Tasks/TaskListItem.vue';

export default defineComponent({
  components: {
    TaskListItem,
  },
  setup() {
    const tasks = ref<Task[]>([]);

    const text = ref('');

    function addTask() {
      const task = new Task(text.value);
      task.save().catch((err) => console.log(err));
      tasks.value.push(task);
      text.value = '';
    }

    Task.GetAll()
      .then((dbTasks) => {
        tasks.value = tasks.value.concat(dbTasks);
      })
      .catch((err) => console.log(err));

    return {
      text,
      addTask,
      tasks,
    };
  },
});
</script>

<style lang="scss"></style>
