<template>
  <div class="tasks-list column col-2">
    <q-card class="project-list-category-card q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="project-list-category-card__name-text">
          {{ status }}
        </div>
      </q-card-section>
    </q-card>
    <draggable
      class="list-group q-gutter-md"
      :list="taskList"
      group="people"
      @change="onChange"
      itemKey="name"
    >
      <template #item="{ element, index }">
        <task-list-item :key="element.id" :task="element"> </task-list-item>
      </template>
    </draggable>
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
</template>
<script lang="ts">
import { QInput } from 'quasar';
import Task, { TaskData } from 'src/models/Task';
import Store from 'src/stores';
import { defineComponent, ref, inject, computed } from 'vue';
import { useRoute } from 'vue-router';
import draggable, { ChangeEvent } from 'vuedraggable';
import TaskListItem from './TaskListItem.vue';
export default defineComponent({
  name: 'TasksList',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    draggable,
    TaskListItem,
  },

  setup(props) {
    const store = inject(Store.StoreKey);
    const route = useRoute();
    if (!store) return;

    const taskList = computed(() =>
      store.projectTasks.value
        .filter((t) => t.status == props.status.toString())
        .sort((a, b) => a.sort_by.status - b.sort_by.status)
    );

    const addTaskInputRef = ref<QInput | null>(null);
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

    async function onChange(evt: ChangeEvent<Task>) {
      var task: Task;
      var newIndex = 0;
      if (evt.added) {
        newIndex = evt.added.newIndex;
        task = evt.added.element;
        task.status = props.status.toString();
      } else if (evt.moved) {
        newIndex = evt.moved.newIndex;
        task = evt.moved.element;
      } else {
        return;
      }

      if (evt.moved || evt.added) {
        // in the section, new index is where the moved task is. therefore need to add one or subtract one to get the surrounding tasks
        if (taskList.value.length == 1) {
        } else if (newIndex == 0) {
          task.sort_by.status = taskList.value[newIndex + 1].sort_by.status / 2;
        } else if (newIndex == taskList.value.length - 1) {
          task.sort_by.status = taskList.value[newIndex - 1].sort_by.status + 1;
        } else {
          task.sort_by.status =
            (taskList.value[newIndex + 1].sort_by.status -
              taskList.value[newIndex - 1].sort_by.status) /
              2 +
            taskList.value[newIndex - 1].sort_by.status;
        }
        await task.save();
      }
    }

    return {
      taskList,
      addTask,
      addTaskInputRef,
      text,
      onChange,
    };
  },
});
</script>

<style lang="scss" scoped></style>
