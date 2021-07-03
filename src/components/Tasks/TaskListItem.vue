<template>
  <q-card
    :class="{ isComplete: isComplete }"
    @click.stop="onTaskClicked"
    @mouseenter="taskHovered = true"
    @mouseleave="taskHovered = false"
  >
    <q-card-section>
      <div class="row q-py-sm justify-between">
        <div>{{ task.name }}</div>
        <q-btn
          size="sm"
          color="grey-5 q-pa-none"
          icon="eva-calendar-outline"
          flat
          dense
          rounded
          @click.stop
          :label="task.due_date ? dueDateFriendly : ''"
        >
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 20]"
            @hide="checkDueDate"
          >
            <q-list bordered>
              <q-date v-model="dueDate" minimal mask="YYYY-MM-DD HH:mm" />
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-pb-sm">
        <q-icon size="xs" color="grey-5" name="notes"> </q-icon>
      </div>
    </q-card-section>
    <q-card-section v-if="taskHovered" class="bg-deep-purple-1">
      <div class="row q-py-sm justify-between">
        <q-btn
          size="sm"
          class="q-px-xs"
          color="grey-5"
          icon="eva-pricetags-outline"
          flat
          rounded
        >
          <q-tooltip class="bg-secondary">Add Tags</q-tooltip>
        </q-btn>

        <div>
          <q-btn
            size="sm"
            class="q-px-xs"
            color="grey-5"
            icon="eva-checkmark-outline"
            flat
            rounded
          >
            <q-tooltip class="bg-secondary">Mark Complete</q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            class="q-px-xs"
            color="grey-5"
            icon="eva-more-horizontal-outline"
            flat
            rounded
          >
            <q-tooltip class="bg-secondary">More Options</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { useQuasar, date } from 'quasar';
import Task from 'src/models/Task';
import { defineComponent, ref, PropType, computed } from 'vue';
import TaskEditModal from 'src/components/Tasks/TaskEditModal.vue';
import TaskViewModel from 'src/viewmodels/TaskViewModel';

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

    const taskHovered = ref(false);
    async function onToggleComplete() {
      await props.task.toggleComplete();
      isComplete.value = !isComplete.value;
    }

    async function onDelete() {
      await TaskViewModel.saveTask(props.task.serialize());
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

    const dueDateFriendly = computed(() =>
      date.formatDate(props.task.due_date, 'MMM D')
    );

    const format = date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm');
    const dueDate = ref(format);

    async function checkDueDate() {
      if (
        props.task.due_date !=
        date.extractDate(dueDate.value, 'YYYY-MM-DD HH:mm').getTime()
      ) {
        const task = props.task;
        task.due_date = date
          .extractDate(dueDate.value, 'YYYY-MM-DD HH:mm')
          .getTime();
        await TaskViewModel.saveTask(task.serialize());
      }
    }

    return {
      onToggleComplete,
      onDelete,
      onTaskClicked,
      checkDueDate,
      isComplete,
      dueDate,
      dueDateFriendly,
      taskHovered,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-card__section {
  padding: 0 1rem;
}

.q-card {
  font-size: 1.4rem;
  :hover {
    cursor: pointer;
  }
}

.isComplete {
  opacity: 0.7;
}

.q-btn {
  :hover {
    color: $secondary;
  }
}
</style>
