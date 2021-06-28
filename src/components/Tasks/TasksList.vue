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
      <template #item="{ element }">
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
import Task from 'src/models/Task';
import projectStore from 'src/stores/project/projectStore';
import { defineComponent, ref, computed } from 'vue';
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
    const route = useRoute();

    const taskList = computed(() =>
      projectStore.tasks.value
        .filter((t) => t.status == props.status.toString())
        .sort((a, b) => a.sort_by - b.sort_by)
    );

    const addTaskInputRef = ref<QInput | null>(null);
    const text = ref('');

    async function addTask() {
      if (!text.value) return;
      const task = new Task(
        text.value,
        route.params.project_id.toString(),
        route.params.workspace_id.toString()
      );

      task.status = props.status.toString();
      await task.save();
      text.value = '';
      addTaskInputRef.value?.resetValidation();
      addTaskInputRef.value?.blur();
    }

    async function onChange(evt: ChangeEvent<Task>) {
      var task: Task;
      var newIndex = 0;
      if (evt.added) {
        // in added, newIndex is actually 1 after where the added task should be
        newIndex = evt.added.newIndex;
        task = evt.added.element;
        task.status = props.status.toString();
        console.log(
          'added',
          task.name,
          newIndex,
          taskList.value[newIndex].name,
          taskList.value[newIndex - 1].name
        );

        if (taskList.value.length <= 1) {
          await task.save();
          return;
        }

        if (newIndex == 0) {
          task.sort_by = taskList.value[newIndex].sort_by / 2;
        } else if (newIndex == taskList.value.length - 1) {
          task.sort_by = taskList.value[newIndex].sort_by + 1;
        } else {
          task.sort_by =
            (taskList.value[newIndex].sort_by +
              taskList.value[newIndex - 1].sort_by) /
            2;
        }
        await task.save();
      } else if (evt.moved) {
        // taskList is mutated by the drag event, but is affected different on move and added
        // in moved, newIndex is the location of the moved task
        newIndex = evt.moved.newIndex;
        task = evt.moved.element;

        if (newIndex == 0) {
          task.sort_by = taskList.value[newIndex + 1].sort_by / 2;
        } else if (newIndex == taskList.value.length - 1) {
          task.sort_by = taskList.value[newIndex - 1].sort_by + 1;
        } else {
          task.sort_by =
            (taskList.value[newIndex + 1].sort_by +
              taskList.value[newIndex + -1].sort_by) /
            2;
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
