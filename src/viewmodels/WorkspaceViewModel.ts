import BroadcastEvent, {
  EVENT_ACTIVE_WORKSPACE_SET,
} from 'src/events/BroadcastEvents';
import Competency, { CompetencyData } from 'src/models/Competency';
import Folder from 'src/models/Folder';
import WorkspaceMember from 'src/models/WorkspaceMember';
import Project, { ProjectData } from 'src/models/Project';
import { WORKSPACE_ROLE } from 'src/models/Role';
import Workspace, { WorkspaceData } from 'src/models/Workspace';
import AppRepository from 'src/repository/AppRepository';
import permissions from 'src/router/permissions';
import { ref, computed, reactive } from 'vue';
import UIViewModel from './UIViewModel';
import UserViewModel from './UserViewModel';

// state
const _activeSpace = ref<Workspace | null>(null);
const _projects = ref<Project[]>([]);
const _competencies = ref<Competency[]>([]);
const _members = ref<WorkspaceMember[]>([]);
// properties
const activeSpace = computed(() => _activeSpace.value?.serialize());
const projects = computed(() =>
  _projects.value.map((proj) => proj.serialize())
);

// TODO no folder structure shows no projects ( this is not updating at all)
const workspaceFolderStructure = computed(
  () => _activeSpace.value?.projects_structure || []
);

const competencies = computed(() =>
  _competencies.value.map((comp) => comp.serialize())
);

const members = computed(() =>
  _members.value.map((member) => member.serialize())
);

const roleOptions = [
  WORKSPACE_ROLE.ADMIN,
  WORKSPACE_ROLE.MANAGER,
  WORKSPACE_ROLE.MEMBER,
  WORKSPACE_ROLE.GUEST,
];

const properties = reactive({
  activeSpace,
  projects,
  members,
  competencies,
  roleOptions,
  workspaceFolderStructure,
});

// Subscriptions
PubSub.subscribe(
  EVENT_ACTIVE_WORKSPACE_SET,
  (_msg: string, workspace: WorkspaceData) => {
    watchWorkspaceProjects(workspace);
    watchWorkspaceCompetencies(workspace);
    watchWorkspaceMembers(workspace);
  }
);

// creating workspace
async function createWorkspace(workspaceName: string) {
  if (!UserViewModel.properties.appProfile)
    throw 'onCreateWorkspace called when no user settings found';
  const workspace = await AppRepository.workspace.createWorkspace(
    workspaceName,
    UserViewModel.properties.appProfile
  );

  BroadcastEvent.workspace.onWorkspaceCreated(workspace);

  await WorkspaceViewModel.methods.setActiveWorkspace(workspace.id);

  return workspace;
}

// Updating space
async function updateWorkspaceName(name: string) {
  if (!_activeSpace.value || !permissions.workspace.canUpdate()) return;
  console.log('permission to update workspace');
  _activeSpace.value.name = name;

  await AppRepository.workspace.saveWorkspace(_activeSpace.value.serialize());
}
// TODO permissions here won't pass for everyone who can update a project
async function addProjectToFolderStructure(project: ProjectData) {
  if (!_activeSpace.value || !permissions.project.canCRU(project)) return;
  const folder = Folder.ConvertProjectToFolderData(project);
  _activeSpace.value.projects_structure.push(folder);
  await AppRepository.workspace.saveWorkspace(_activeSpace.value.serialize());
}

// Deleting space
async function deleteWorkspace(workspace: WorkspaceData) {
  if (!permissions.workspace.canDelete()) return;

  console.log('permission to delete workspace');

  UIViewModel.updateLoadingMessage(
    `Deleting ${workspace.name}... DO NOT CLOSE THIS PAGE`
  );
  UIViewModel.showLoading();

  await AppRepository.workspace.deleteWorkspace(workspace);

  BroadcastEvent.workspace.onWorkspaceDeleted(workspace);
  UIViewModel.hideLoading();

  // const id = _activeSpace.value.id;
  // workspaceState.activeSpace = null;
  // return id;
}

// setting active space
async function setActiveWorkspace(workspaceId: string) {
  if (_activeSpace.value?.id == workspaceId) return;
  _activeSpace.value = Workspace.deserialize(
    await AppRepository.workspace.getWorkspace(workspaceId)
  );

  await UserViewModel.methods.setUserWorkspaceData(
    _activeSpace.value.serialize()
  );
  BroadcastEvent.workspace.onActiveWorkspaceSet(_activeSpace.value.serialize());
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

function watchWorkspaceMembers(workspace: WorkspaceData) {
  AppRepository.workspace.watchWorkspaceMembers(workspace.id, (members) => {
    const updatedMembers = members.map((member) =>
      WorkspaceMember.deserialize(member)
    );
    _members.value.splice(0, _members.value.length, ...updatedMembers);
  });
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

function updateWorkspaceProject(projectData: ProjectData) {
  const project = Project.deserialize(projectData);
  const index = _projects.value.findIndex((t) => t.id == project.id);
  _projects.value.splice(index, 1, project);
}

function removeWorkspaceProject(projectData: ProjectData) {
  const project = Project.deserialize(projectData);
  const index = _projects.value.findIndex((t) => t.id == project.id);
  _projects.value.splice(index, 1);
}

function addWorkspaceProject(projectData: ProjectData) {
  const project = Project.deserialize(projectData);
  _projects.value.push(project);
}

// Projects change handlers
function clearWorkspaceCompetencies() {
  _competencies.value.splice(0, _competencies.value.length);
}

function updateWorkspaceCompetency(competencyData: CompetencyData) {
  const competency = Competency.deserialize(competencyData);
  const index = _competencies.value.findIndex((t) => t.id == competency.id);
  _competencies.value.splice(index, 1, competency);
}

function removeWorkspaceCompetency(competencyData: CompetencyData) {
  const competency = Competency.deserialize(competencyData);
  const index = _competencies.value.findIndex((t) => t.id == competency.id);
  _competencies.value.splice(index, 1);
}

function addWorkspaceCompetency(competencyData: CompetencyData) {
  const competency = Competency.deserialize(competencyData);
  _competencies.value.push(competency);
}

async function createInvite(
  token: string,
  role: WORKSPACE_ROLE,
  workspaceId: string
) {
  const invite = {
    id: token,
    role: role,
    workspace_id: workspaceId,
  };

  await AppRepository.workspace.createWorkspaceInvitation(invite);
}

const WorkspaceViewModel = {
  properties,
  methods: {
    createWorkspace,
    updateWorkspaceName,
    deleteWorkspace,
    createInvite,
    addProjectToFolderStructure,
    setActiveWorkspace,
  },
};

export default WorkspaceViewModel;
