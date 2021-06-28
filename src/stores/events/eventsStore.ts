import userStore from '../user/userStore';
import workspaceStore from '../workspace/workspaceStore';

async function onWorkspaceDelete() {
  console.log('Workspace is about to be deleted');
  const id = await workspaceStore.deleteWorkspace();
  if (!id) throw 'error deleting workspace';
  await userStore.removeWorkspaceFromSettings(id);
}

async function afterWorkspaceCreate(workspaceId: string) {
  console.log('new workspace created', workspaceId);
  await userStore.assignRoleAndAddWorkspace(workspaceId);
}

async function afterWorkspaceSetActive() {
  console.log('Active workspace has been set');
  await userStore.onActiveWorkspaceChanged();
}

const eventsStore = {
  workspace: {
    afterWorkspaceCreate,
    onWorkspaceDelete,
    afterWorkspaceSetActive,
  },
};

export default eventsStore;
