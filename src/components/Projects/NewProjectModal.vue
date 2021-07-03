<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" id="new-project-modal">
      <!-- <q-btn
        label="Reset"
        push
        color="white"
        text-color="secondary"
        @click="step = 1"
        class="q-mb-md"
      /> -->

      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        color="secondary"
        animated
      >
        <q-step
          :name="1"
          title="Project Name"
          icon="eva-browser-outline"
          :done="step > 1"
          :header-nav="step > 1"
          color="secondary"
        >
          <q-input
            class="new-project__form-input"
            v-model="name"
            type="text"
            placeholder="Project Name"
            input-class="text-center"
            color="secondary"
            lazy-rules
            :rules="[(val) => !!val || 'Name can\'t be empty']"
          />

          <q-stepper-navigation class="row justify-between">
            <q-btn
              @click="onAddProject"
              color="secondary"
              label="Add Project"
              :disable="!name"
            />
            <q-btn
              @click="
                () => {
                  done1 = true;
                  step = 2;
                }
              "
              outline
              color="secondary"
              label="Continue"
              :disable="!name"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          color="secondary"
          :name="2"
          title="Goal"
          icon="eva-bulb-outline"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <q-input
            color="secondary"
            class="new-project__form-input"
            v-model="goal"
            type="text"
            placeholder="The goal of this project is..."
            input-class="text-center"
          />

          <q-stepper-navigation class="row justify-between">
            <q-btn
              @click="onAddProject"
              color="secondary"
              label="Add Project"
              :disable="!name"
            />
            <div>
              <q-btn flat @click="step = 1" color="secondary" label="Back" />
              <q-btn
                class="q-ml-sm"
                outline
                @click="
                  () => {
                    done2 = true;
                    step = 3;
                  }
                "
                color="secondary"
                label="Continue"
              />
            </div>
          </q-stepper-navigation>
        </q-step>

        <q-step
          color="secondary"
          :name="3"
          title="Success"
          icon="eva-award-outline"
          :header-nav="step > 3"
        >
          <q-input
            color="secondary"
            class="new-project__form-input"
            v-model="success"
            type="text"
            placeholder="Success looks like..."
            input-class="text-center"
          />
          <q-stepper-navigation class="row justify-between">
            <q-btn
              color="secondary"
              @click="
                () => {
                  done3 = true;
                  onAddProject();
                }
              "
              label="Finish"
            />
            <q-btn
              flat
              @click="step = 2"
              color="secondary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import ProjectViewModel from 'src/viewmodels/ProjectViewModel';

export default {
  components: {},

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup() {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome
    const name = ref('');
    const goal = ref('');
    const success = ref('');
    const workspaceId = useRoute().params.workspace_id.toString();
    // TODO redirect on create
    async function onAddProject() {
      await ProjectViewModel.createProject(
        name.value,
        workspaceId,
        goal.value,
        success.value
      );

      onDialogHide();
    }

    return {
      step: ref(1),
      name,
      goal,
      success,

      onAddProject,

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

<style scoped>
#new-project-modal {
  position: absolute;
  top: 15vh;
  width: 80vw;
  max-width: 60rem;
}

.new-project__form-input {
  font-size: 3rem;
}
</style>
