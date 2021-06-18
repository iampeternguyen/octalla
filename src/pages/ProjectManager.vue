<template>
  <q-page class="row" padding>
    <div class="column col-2 q-gutter-md">
      <q-card class="project-list-category-card">
        <q-card-section class="q-py-sm">
          <div class="project-list-category-card__name-text">In-Progress</div>
        </q-card-section>
      </q-card>

      <q-card class="">
        <q-card-section>
          <div class="task-name">This is a task</div>
        </q-card-section>
      </q-card>

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

export default defineComponent({
  setup() {
    const text = ref('');
    function addTask() {
      const task = new Task(text.value);
      task.save().catch((err) => console.log(err));
      text.value = '';
    }
    return {
      text,
      addTask,
    };
  },
});
</script>

<style lang="scss"></style>
