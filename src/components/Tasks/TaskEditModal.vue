<template>
  <!-- notice dialogRef here -->
  <q-dialog
    ref="dialogRef"
    :model-value="showTaskModal"
    @update:model-value="onValueChanged"
  >
    <q-card class="task-edit-modal">
      <q-card-section class="task-edit-modal__header bg-grey-3">
        Lorem ipsum dolor sit amet
      </q-card-section>
      <q-card-section horizontal class="task-edit-modal__body">
        <q-card-section class="col-6 task-edit-modal__body-left">
          <div class="row justify-between q-mb-md">
            <div class="row">
              <q-btn
                color="primary"
                :label="task.status"
                @click="toggleStatus"
              />
              <q-btn
                dense
                class="q-ml-xs"
                color="primary"
                icon="eva-arrow-ios-forward-outline"
                @click="toggleComplete"
              />
              <q-btn color="primary" icon="eva-person-add-outline" round flat />
            </div>
            <div class="row">
              <div class="column q-ml-sm">
                <div class="text-grey-6 text-caption">Start Date</div>
                <div class="text-grey-8">March 1, 2021</div>
              </div>
              <div class="column q-ml-sm">
                <div class="text-grey-6 text-caption">Due Date</div>
                <div class="text-grey-8">March 1, 2021</div>
              </div>
            </div>
          </div>
          <div class="row q-mb-md">
            <q-input
              outlined
              type="text"
              v-model="taskEditModel.name"
              class="full-width"
              @keydown.enter.exact.prevent="onEnterPressed"
              @blur="saveTask"
            />
          </div>
          <div class="column q-mb-md">
            <!-- TODO limit row height (flex-grow?) -->
            <q-editor
              :model-value="taskEditModel.description"
              @update:model-value="onUpdateDescription"
              class="full-width"
              :class="{ notSaved: isNotSaved }"
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                      'size-6',
                      'size-7',
                    ],
                  },
                ],
                ['bold', 'italic', 'strike', 'underline'],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                ['undo', 'redo'],
              ]"
            >
            </q-editor>
            <div v-if="isNotSaved && !isSaving">
              <q-linear-progress :value="100" color="red" />
              <div class="text-caption q-mt-sm">
                Unsaved changes. Will auto-save when you stop typing.
              </div>
            </div>
            <div v-else-if="!isNotSaved && isSaving">
              <q-linear-progress :value="100" color="green" />
              <div class="text-caption q-mt-sm">Changes saved!</div>
            </div>
            <div v-else-if="isSaving">
              <q-linear-progress indeterminate color="yellow" />
              <div class="text-caption q-mt-sm">Saving changes</div>
            </div>
          </div>
        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-6 task-edit-modal__body-right"
          >Right</q-card-section
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { watch, PropType, reactive, ref, defineComponent } from 'vue';
import { debounce } from 'ts-debounce';

import Task, { TaskData } from 'src/models/Task';
import ProjectViewModel from 'src/viewmodels/ProjectViewModel';
import TaskViewModel from 'src/viewmodels/TaskViewModel';
export default defineComponent({
  props: {
    task: {
      type: Object as PropType<TaskData>,
      required: true,
    },
  },
  components: {},

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup(props: { task: TaskData }) {
    const taskEditModel = reactive<TaskData>(
      Task.deserialize(props.task).serialize()
    );
    const isNotSaved = ref(false);
    const isSaving = ref(false);
    const showTaskModal = ref(true);

    watch(ProjectViewModel.properties.tasks, (tasks) => {
      const task = tasks.find((t) => t.id == props.task.id);
      Object.assign(taskEditModel, task);
    });

    function onEnterPressed() {
      (document.activeElement as HTMLElement).blur();
    }

    const debouncedSaveTask = debounce(saveTask, 2000);

    async function onUpdateDescription(value: string) {
      isNotSaved.value = true;
      isSaving.value = false;

      taskEditModel.description = value;
      await debouncedSaveTask();
    }

    function resetIsSavingValue() {
      isSaving.value = false;
    }

    const debounceResetIsSaving = debounce(resetIsSavingValue, 2000);

    async function saveTask() {
      console.log('saving');
      if (
        (Object.keys(taskEditModel) as Array<keyof TaskData>).some((key) => {
          return taskEditModel[key] != props.task[key];
        })
      ) {
        isSaving.value = true;
        await TaskViewModel.updateTask(taskEditModel);
        isNotSaved.value = false;
        await debounceResetIsSaving();
      } else {
        console.log('no changes');
      }
    }

    function onValueChanged(val: boolean) {
      if (isNotSaved.value) {
      } else {
        // Prevents error on closing dialog while editor is focused
        (document.activeElement as HTMLElement).blur();
        showTaskModal.value = val;
      }
    }

    async function toggleStatus() {
      await TaskViewModel.toggleStatus(taskEditModel);
    }

    async function toggleComplete() {
      await TaskViewModel.toggleComplete(taskEditModel);
    }

    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    return {
      taskEditModel,
      toggleStatus,
      toggleComplete,
      isSaving,
      onUpdateDescription,
      saveTask,
      onEnterPressed,
      isNotSaved,
      showTaskModal,
      onValueChanged,
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK();
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      onSubmitSuccess: onDialogHide,
    };
  },
});
</script>

<style lang="scss">
.task-edit-modal {
  width: 85vw;
  min-width: 85vw;
  height: 95vh;
  display: flex;
  flex-direction: column;
  &__body {
    flex-grow: 1;
  }
}
</style>
