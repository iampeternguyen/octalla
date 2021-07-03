import BroadcastEvent, {
  EVENT_ACTIVE_WORKSPACE_SET,
} from 'src/events/BroadcastEvents';
import { CompetencyData } from 'src/models/Competency';
import { ProjectData } from 'src/models/Project';
import { WorkspaceData } from 'src/models/Workspace';
import AppRepository from 'src/repository/AppRepository';
import permissions from 'src/router/permissions';
import uiStore from 'src/stores/ui/uiStore';
import { ref, computed } from 'vue';
import UserViewModel from './UserViewModel';

// state
const _activeSpace = ref<WorkspaceData | null>(null);
const _projects = ref<ProjectData[]>([]);
const _competencies = ref<CompetencyData[]>([]);

// getters
const activeSpace = computed(() => _activeSpace.value);
const projects = computed(() => _projects.value);
const workspaceFolderStructure = computed(
  () => _activeSpace.value?.projects_structure || []
);
const competencies = computed(() => _competencies.value);
// Subscriptions
PubSub.subscribe(
  EVENT_ACTIVE_WORKSPACE_SET,
  (_msg: string, workspace: WorkspaceData) => {
    watchWorkspaceProjects(workspace);
    watchWorkspaceCompetencies(workspace);
  }
);

// creating workspace
async function createWorkspace(workspaceName: string) {
  if (!UserViewModel.settings.value)
    throw 'onCreateWorkspace called when no user settings found';
  const workspace = await AppRepository.workspace.createWorkspace(
    workspaceName,
    UserViewModel.settings.value.id
  );

  BroadcastEvent.workspace.onWorkspaceCreated(workspace);

  await WorkspaceViewModel.setActiveWorkspace(workspace.id);

  return workspace;
}

// Updating space
async function updateWorkspaceName(name: string) {
  if (!_activeSpace.value || !permissions.workspace.canUpdate()) return;
  console.log('permission to update workspace');
  await AppRepository.workspace.updateWorkspaceName(_activeSpace.value, name);
  _activeSpace.value.name = name;
}

// Deleting space
async function deleteWorkspace(workspace: WorkspaceData) {
  if (!permissions.workspace.canDelete()) return;

  console.log('permission to delete workspace');

  uiStore.updateLoadingMessage(
    `Deleting ${workspace.name}... DO NOT CLOSE THIS PAGE`
  );
  uiStore.showLoading();

  await AppRepository.workspace.deleteWorkspace(workspace);

  BroadcastEvent.workspace.onWorkspaceDeleted(workspace);
  uiStore.hideLoading();

  // const id = _activeSpace.value.id;
  // workspaceState.activeSpace = null;
  // return id;
}

// setting active space
async function setActiveWorkspace(workspaceId: string) {
  if (_activeSpace.value?.id == workspaceId) return;
  _activeSpace.value = await AppRepository.workspace.fetchWorkspace(
    workspaceId
  );

  await UserViewModel.setUserRole(_activeSpace.value);
  BroadcastEvent.workspace.onActiveWorkspaceSet(_activeSpace.value);
}

function watchWorkspaceProjects(workspace: WorkspaceData) {
  clearWorkspaceProjects();
  AppRepository.workspace.watchWorkspaceProjects(
    workspace.id,
    addWorkspaceProject,
    updateWorkspaceProject,
    removeWorkspaceProject
  );
}

function watchWorkspaceCompetencies(workspace: WorkspaceData) {
  clearWorkspaceCompetencies();
  AppRepository.workspace.watchWorkspaceCompetencies(
    workspace.id,
    addWorkspaceCompetency,
    updateWorkspaceCompetency,
    removeWorkspaceCompetency
  );
}

// Projects change handlers
function clearWorkspaceProjects() {
  _projects.value.splice(0, _projects.value.length);
}

function updateWorkspaceProject(project: ProjectData) {
  const index = _projects.value.findIndex((t) => t.id == project.id);
  _projects.value.splice(index, 1, project);
}

function removeWorkspaceProject(project: ProjectData) {
  const index = _projects.value.findIndex((t) => t.id == project.id);
  _projects.value.splice(index, 1);
}

function addWorkspaceProject(project: ProjectData) {
  _projects.value.push(project);
}

// Projects change handlers
function clearWorkspaceCompetencies() {
  _competencies.value.splice(0, _competencies.value.length);
}

function updateWorkspaceCompetency(competency: CompetencyData) {
  const index = _competencies.value.findIndex((t) => t.id == competency.id);
  _competencies.value.splice(index, 1, competency);
}

function removeWorkspaceCompetency(competency: CompetencyData) {
  const index = _competencies.value.findIndex((t) => t.id == competency.id);
  _competencies.value.splice(index, 1);
}

function addWorkspaceCompetency(competency: CompetencyData) {
  _competencies.value.push(competency);
}

const WorkspaceViewModel = {
  setActiveWorkspace,
  activeSpace,
  projects,
  workspaceFolderStructure,
  competencies,
  createWorkspace,
  updateWorkspaceName,
  deleteWorkspace,
};

export default WorkspaceViewModel;
