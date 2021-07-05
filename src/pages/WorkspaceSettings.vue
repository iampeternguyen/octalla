<template>
  <div class="column items-center">
    <q-input
      ref="workspaceNameInput"
      class="q-my-lg"
      flat
      borderless
      :placeholder="'workspaceName'"
      v-model="name"
      input-class="edit-workspace-name__input"
      @keydown.enter.prevent="onEnterPressed"
      @blur="onWorkspaceNameSave"
    >
    </q-input>
    <div class="q-mb-md">Invite team members</div>
    <q-card class="my-card q-pa-xl shadow-2">
      <q-form @submit="generateInvite" class="q-gutter-md">
        <q-input
          v-model="invitedName"
          type="text"
          label="Name"
          lazy-rules
          :rules="[(val) => !!val || 'Name can\'t be empty']"
        />
        <q-select
          v-model="invitedRole"
          :options="roleOptions"
          label="Role"
          lazy-rules
          :rules="[(val) => !!val || 'Role can\'t be empty']"
        />

        <div>
          <q-btn label="Generate Invite" flat type="submit" color="primary" />
        </div>
      </q-form>
    </q-card>

    <div class="">{{ inviteLink }}</div>
    <q-btn
      class="q-mt-xl"
      color="red"
      icon="delete"
      label="delete workspace"
      @click="onDeleteWorkspace"
    />
  </div>
</template>
<script lang="ts">
import { nanoid } from 'nanoid';
import { QInput } from 'quasar';
import { WORKSPACE_ROLE } from 'src/models/Role';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'WorkspaceSettings',
  setup() {
    const name = ref(WorkspaceViewModel.activeSpace.value?.name || '');
    const router = useRouter();

    const workspaceNameInput = ref<QInput | null>(null);

    function onEnterPressed() {
      if (workspaceNameInput.value) workspaceNameInput.value.blur();
    }

    async function onWorkspaceNameSave() {
      if (name.value == WorkspaceViewModel.activeSpace.value?.name) return;
      await WorkspaceViewModel.updateWorkspaceName(name.value);
    }

    const onDeleteWorkspace = async () => {
      if (WorkspaceViewModel.activeSpace.value)
        await WorkspaceViewModel.deleteWorkspace(
          WorkspaceViewModel.activeSpace.value
        );
      console.log('push to app');
      await router.push({ name: 'app' });
    };

    const invitedName = ref('');
    const invitedRole = ref('');
    const roleOptions = computed(() => WorkspaceViewModel.roleOptions);
    const inviteLink = ref('');
    async function generateInvite() {
      if (!WorkspaceViewModel.activeSpace.value) return;
      const token = nanoid(64);
      inviteLink.value = `${window.location.origin}/invite?token=${token}`;
      await WorkspaceViewModel.createInvite(
        token,
        invitedRole.value as WORKSPACE_ROLE,
        WorkspaceViewModel.activeSpace.value?.id
      );
    }
    return {
      name,
      workspaceNameInput,
      onWorkspaceNameSave,
      onEnterPressed,
      onDeleteWorkspace,

      invitedName,
      invitedRole,
      roleOptions,
      inviteLink,
      generateInvite,
    };
  },
});
</script>

<style lang="scss" scoped></style>
