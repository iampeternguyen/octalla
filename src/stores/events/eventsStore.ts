import userStore from '../user/userStore';

function beforeWorkspaceDelete() {
  console.log('Workspace is about to be deleted');
}

async function afterWorkspaceCreate(workspaceId: string) {
  console.log('new workspace created', workspaceId);
  await userStore.assignRoleAndAddWorkspace(workspaceId);
}

async function afterWorkspaceDelete(workspaceId: string) {
  console.log('Workspace has been deleted', workspaceId);
  await userStore.removeWorkspaceFromSettings(workspaceId);
}

async function afterWorkspaceSetActive() {
  console.log('Active workspace has been set');
  await userStore.onActiveWorkspaceChanged();
}

const eventsStore = {
  workspace: {
    afterWorkspaceCreate,
    beforeWorkspaceDelete,
    afterWorkspaceDelete,
    afterWorkspaceSetActive,
  },
};

export default eventsStore;
