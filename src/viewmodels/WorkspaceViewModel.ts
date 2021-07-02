import BroadcastEvent from 'src/events/BroadcastEvents';
import { WorkspaceData } from 'src/models/Workspace';
import AppRepository from 'src/repository/AppRepository';
import { ref, computed } from 'vue';

const _activeSpace = ref<WorkspaceData | null>(null);

async function setActiveWorkspace(workspaceId: string) {
  if (_activeSpace.value?.id == workspaceId) return;
  console.log('active workspace changed');
  _activeSpace.value = await AppRepository.workspace.fetchWorkspace(
    workspaceId
  );
  BroadcastEvent.workspace.onActiveWorkspaceSet(_activeSpace.value);
  // watchWorkspaceProjects();
  // await eventsStore.workspace.afterWorkspaceSetActive();
}

const WorkspaceViewModel = {
  setActiveWorkspace,
};

export default WorkspaceViewModel;
