<template>
  <div>
    <q-input
      ref="workspaceNameInput"
      class="q-ml-lg"
      flat
      borderless
      :placeholder="'workspaceName'"
      v-model="name"
      input-class="edit-workspace-name__input"
      @keydown.enter.prevent="onEnterPressed"
      @blur="onWorkspaceNameSave"
    >
    </q-input>

    <q-btn
      color="red"
      icon="delete"
      label="delete workspace"
      @click="onDeleteWorkspace"
    />
  </div>
</template>
<script lang="ts">
import { QInput } from 'quasar';
import eventsStore from 'src/stores/events/eventsStore';
import workspaceStore from 'src/stores/workspace/workspaceStore';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'WorkspaceSettings',
  setup() {
    const name = ref(workspaceStore.activeWorkspace.value?.name || '');
    const router = useRouter();

    const workspaceNameInput = ref<QInput | null>(null);

    function onEnterPressed() {
      if (workspaceNameInput.value) workspaceNameInput.value.blur();
    }

    async function onWorkspaceNameSave() {
      if (name.value == workspaceStore.activeWorkspace.value?.name) return;
      await workspaceStore.updateWorkspaceName(name.value);
    }

    const onDeleteWorkspace = async () => {
      await eventsStore.workspace.onWorkspaceDelete();
      await router.push({ name: 'app' });
    };

    return {
      name,
      workspaceNameInput,
      onWorkspaceNameSave,
      onEnterPressed,
      onDeleteWorkspace,
    };
  },
});
</script>

<style lang="scss" scoped></style>
