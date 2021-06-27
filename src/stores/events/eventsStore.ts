import userStore from '../user/userStore';

function beforeWorkspaceDelete() {
  console.log('Workspace is about to be deleted');
}

async function afterWorkspaceDelete() {
  console.log('Workspace has been deleted');
  await userStore.onDeleteWorkspace();
}

async function afterWorkspaceSetActive() {
  console.log('Active workspace has been set');
  await userStore.onActiveWorkspaceChanged();
}

const eventsStore = {
  workspace: {
    beforeWorkspaceDelete,
    afterWorkspaceDelete,
    afterWorkspaceSetActive,
  },
};

export default eventsStore;
