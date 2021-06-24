<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="task-edit-modal">
      <q-card-section class="task-edit-modal__header bg-grey-3">
        Lorem ipsum dolor sit amet
      </q-card-section>
      <q-card-section horizontal class="task-edit-modal__body">
        <q-card-section class="col-6 task-edit-modal__body-left">
          <div class="row justify-between q-mb-md">
            <div class="row">
              <q-btn color="primary" :label="task.status" />
              <q-btn
                dense
                class="q-ml-xs"
                color="primary"
                icon="eva-arrow-ios-forward-outline"
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
              @blur="onBlur"
            />
          </div>
          <div class="row q-mb-md">
            <!-- TODO limit row height (flex-grow?) -->
            <q-editor
              @keydown.enter.exact.prevent="onEnterPressed"
              @blur="onBlur"
              v-model="taskEditModel.description"
              class="full-width"
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
              ]"
            />
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
import { QInput, useDialogPluginComponent } from 'quasar';
import { ref, PropType, reactive } from 'vue';
import { db } from 'src/firebase';

import Task, { TaskData, TASKS_STORENAME } from 'src/models/Task';

export default {
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
  components: {},

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup(props: { task: Task }) {
    const taskEditModel = reactive<Task>(Task.deserialize(props.task));

    const query = db
      .collection(TASKS_STORENAME)
      .where('id', '==', props.task.id);
    const observer = query.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type == 'modified') {
          const taskData = change.doc.data() as TaskData;
          Object.keys(taskData).forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            taskEditModel[key] = taskData[key];
          });
        }
      });
    });
    function onEnterPressed() {
      (document.activeElement as HTMLElement).blur();
    }

    async function onBlur() {
      if (
        Object.keys(taskEditModel).some((key) => {
          return taskEditModel[key] != props.task[key];
        })
      ) {
        await taskEditModel.save();
      }
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
      onBlur,
      onEnterPressed,
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
};
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
