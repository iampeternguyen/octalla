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
  </div>
</template>
<script lang="ts">
import { QInput } from 'quasar';
import workspaceStore from 'src/stores/workspace';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'WorkspaceSettings',
  setup() {
    const name = ref(workspaceStore.activeWorkspace.value?.name || '');
    const workspaceNameInput = ref<QInput | null>(null);

    function onEnterPressed() {
      if (workspaceNameInput.value) workspaceNameInput.value.blur();
    }

    async function onWorkspaceNameSave() {
      if (name.value == workspaceStore.activeWorkspace.value?.name) return;
      await workspaceStore.updateWorkspaceName(name.value);
    }

    return { name, workspaceNameInput, onWorkspaceNameSave, onEnterPressed };
  },
});
</script>

<style lang="scss" scoped></style>
