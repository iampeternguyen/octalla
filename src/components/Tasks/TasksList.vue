<template>
  <div class="tasks-list column col-2">
    <q-card class="project-list-category-card q-mb-md">
      <q-card-section class="q-py-sm">
        <div class="project-list-category-card__name-text">
          {{ field.toUpperCase() }}
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
      @blur="onAddTaskBlur"
    >
    </q-input>
  </div>
</template>
<script lang="ts">
import { QInput } from 'quasar';
import TaskBlock from 'src/models/Block';
import Task, { TaskData } from 'src/models/Task';
import ProjectViewModel from 'src/viewmodels/ProjectViewModel';
import TaskViewModel from 'src/viewmodels/TaskViewModel';
import UserViewModel from 'src/viewmodels/UserViewModel';
import BlocksViewModel from 'src/viewmodels/BlocksViewModel';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import draggable, { ChangeEvent } from 'vuedraggable';
import TaskListItem from './TaskListItem.vue';
export default defineComponent({
  name: 'TasksList',
  props: {
    category: {
      type: String,
      required: true,
    },
    field: {
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

    const taskList = computed(() => {
      return filterTaskList(ProjectViewModel.properties.tasks.value || []);
    });

    function filterTaskList(tasks: TaskData[]) {
      return tasks
        .filter((t) => {
          if (props.category == 'status') {
            return t.fields[props.category] == props.field.toString();
          } else if (props.category == 'competency' && props.field != 'Empty') {
            const id =
              WorkspaceViewModel.properties.competencies.value.find(
                (comp) => comp.name == props.field
              )?.id || '';
            return t.fields[props.category] == id;
          } else if (props.category == 'competency' && props.field == 'Empty') {
            return t.fields[props.category] == '';
          }
        })
        .sort((a, b) => a.fields.order - b.fields.order);
    }

    const addTaskInputRef = ref<QInput | null>(null);
    const text = ref('');

    async function addTask() {
      if (!text.value || !UserViewModel.properties.settings.value) {
        addTaskInputRef.value?.validate();
        return;
      }

      const task = new Task(
        text.value,
        UserViewModel.properties.settings.value.id,
        route.params.project_id.toString(),
        route.params.workspace_id.toString()
      );
      if (props.category == 'status' && props.field != 'Empty') {
        task.fields[props.category] = props.field.toString();
      } else if (props.category == 'competency' && props.field != 'Empty') {
        task.fields[props.category] =
          WorkspaceViewModel.properties.competencies.value.find(
            (comp) => comp.name == props.field
          )?.id || '';
      } else if (props.field == 'Empty' && props.category == 'competency') {
        task.fields[props.category] = '';
      }
      await TaskViewModel.updateTask(task.serialize());
      text.value = '';
      addTaskInputRef.value?.resetValidation();
      addTaskInputRef.value?.blur();
    }

    function onAddTaskBlur() {
      console.log('blur');
      addTaskInputRef.value?.resetValidation();
    }

    async function onChange(evt: ChangeEvent<TaskData>) {
      var task: TaskData;
      var newIndex = 0;
      if (evt.added) {
        newIndex = evt.added.newIndex;
        task = evt.added.element;

        if (props.category == 'status' && props.field != 'Empty') {
          task.fields[props.category] = props.field.toString();
        } else if (props.category == 'competency' && props.field != 'Empty') {
          task.fields[props.category] =
            WorkspaceViewModel.properties.competencies.value.find(
              (comp) => comp.name == props.field
            )?.id || '';
        } else if (props.field == 'Empty' && props.category == 'competency') {
          task.fields[props.category] = '';
        }

        if (taskList.value.length <= 1) {
          await TaskViewModel.updateTask(task);
          return;
        }
      } else if (evt.moved) {
        newIndex = evt.moved.newIndex;
        task = evt.moved.element;
      } else {
        return;
      }

      if (newIndex == 0) {
        task.fields.order = taskList.value[newIndex + 1].fields.order / 2;
      } else if (newIndex == taskList.value.length - 1) {
        task.fields.order = taskList.value[newIndex - 1].fields.order + 1;
      } else {
        task.fields.order =
          (taskList.value[newIndex + 1].fields.order +
            taskList.value[newIndex - 1].fields.order) /
          2;
      }
      await TaskViewModel.updateTask(task);
    }

    return {
      taskList,
      addTask,
      addTaskInputRef,
      text,
      onChange,
      onAddTaskBlur,
    };
  },
});
</script>

<style lang="scss" scoped>
.project-list-category-card {
  border-top: 0.3rem solid $secondary;
}

.tasks-list {
  max-width: 20rem;
}
</style>
