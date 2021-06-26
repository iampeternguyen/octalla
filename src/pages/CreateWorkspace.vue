<template>
  <q-stepper
    v-model="step"
    header-nav
    ref="stepper"
    color="secondary"
    animated
    class="constrain"
    vertical
  >
    <q-step
      :name="1"
      title="Workspace Name"
      icon="eva-browser-outline"
      :done="step > 1"
      :header-nav="step > 1"
      color="secondary"
    >
      <div>
        For working with organizations, this could be the name of your org,
        department, committee. It depends on who you see yourself working with.
        For solo or team work, this could be your name, the team, or the big
        project your working on. It depends on you, workspaces just help
        organize the various projects you are working on.
      </div>
      <q-input
        class="new-workspace__form-input"
        v-model="name"
        type="text"
        placeholder="Workspace Name"
        input-class="text-center"
        color="secondary"
        lazy-rules
        :rules="[(val) => !!val || 'Name can\'t be empty']"
      />

      <q-stepper-navigation class="row justify-between">
        <q-btn
          @click="onAddWorkspace"
          color="secondary"
          label="Add Workspace"
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

    <!-- <q-step
          color="secondary"
          :name="2"
          title="Goal"
          icon="eva-bulb-outline"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <q-input
            color="secondary"
            class="new-workspace__form-input"
            v-model="goal"
            type="text"
            placeholder="The goal of this project is..."
            input-class="text-center"
          />

          <q-stepper-navigation class="row justify-between">
            <q-btn
              @click="onAddWorkspace"
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
            class="new-workspace__form-input"
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
                  onAddWorkspace();
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
        </q-step> -->
  </q-stepper>
</template>

<script lang="ts">
import Store from 'src/stores';
import { defineComponent, ref, inject } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const name = ref('');
    const store = inject(Store.StoreKey);
    const router = useRouter();

    async function onAddWorkspace() {
      const workspaceId = await store?.onCreateWorkspace(name.value);
      if (workspaceId)
        await router.push({
          name: 'workspace',
          params: { workspace_id: workspaceId },
        });
    }

    return { step: ref(1), name, onAddWorkspace };
  },
});
</script>

<style lang="scss">
.new-workspace__form-input {
  font-size: 3rem;
}
</style>
