import BroadcastEvent, {
  EVENT_ACTIVE_PROJECT_SET,
} from 'src/events/BroadcastEvents';
import Project, { ProjectData } from 'src/models/Project';
import { TaskData } from 'src/models/Task';
import AppRepository from 'src/repository/AppRepository';
import permissions from 'src/router/permissions';
import { ref, computed } from 'vue';
import UIViewModel from './UIViewModel';
import WorkspaceViewModel from './WorkspaceViewModel';

// subscriptions
PubSub.subscribe(
  EVENT_ACTIVE_PROJECT_SET,
  (_msg: string, project: ProjectData) => {
    watchTasks(project);
  }
);

// state
const _activeProject = ref<ProjectData | null>(null);
const _tasks = ref<TaskData[]>([]);
const _failedActiveProjectRequest = ref('');

// getters
const activeProject = computed(() => _activeProject.value);
const tasks = computed(() => _tasks.value);

// setters

const setActiveProject = (projectId: string) => {
  const project = WorkspaceViewModel.projects.value.find(
    (p) => p.id == projectId
  );
  if (project) {
    _failedActiveProjectRequest.value = '';
    _activeProject.value = project;

    BroadcastEvent.project.onActiveProjectSet(project);
  } else {
    throw 'Project not found';
  }
};

async function projectGroupBy(field: string) {
  if (!_activeProject.value) return;
  _activeProject.value.group_by = field;
  await AppRepository.project.saveProject(_activeProject.value);
}

// PROJECT CREATE

async function createProject(
  name: string,
  workspaceId: string,
  goal?: string,
  success?: string
) {
  if (!WorkspaceViewModel.activeSpace.value) return;
  const project = new Project(name, workspaceId);
  project.primary_goal = goal || '';
  project.success_looks_like = success || '';
  await AppRepository.project.saveProject(project.serialize());
}

// PROJECT DELETE
async function deleteProject(project: ProjectData) {
  if (!permissions.project.canDelete(project)) return;

  console.log('permission to delete project');

  UIViewModel.updateLoadingMessage(
    `Deleting ${project.name}... DO NOT CLOSE THIS PAGE`
  );
  UIViewModel.showLoading();
  if (_activeProject.value && _activeProject.value.id == project.id)
    _activeProject.value = null;
  await AppRepository.project.deleteProject(project);
  UIViewModel.hideLoading();
  BroadcastEvent.project.onProjectDeleted(project);
  // const id = workspaceState.activeSpace.id;
  // workspaceState.activeSpace = null;
  // return id;
}

const watchTasks = (project: ProjectData) => {
  clearProjectTasks();
  console.log('watching tasks');
  AppRepository.project.watchProjectTasks(
    project,
    addProjectTask,
    updateProjectTask,
    removeProjectTask
  );
};

function clearProjectTasks() {
  _tasks.value.splice(0, _tasks.value.length);
}

function updateProjectTask(task: TaskData) {
  const index = _tasks.value.findIndex((t) => t.id == task.id);
  _tasks.value.splice(index, 1, task);
}

function removeProjectTask(task: TaskData) {
  const index = _tasks.value.findIndex((t) => t.id == task.id);
  _tasks.value.splice(index, 1);
}

function addProjectTask(task: TaskData) {
  _tasks.value.push(task);
}

async function saveProject(project: ProjectData) {
  await AppRepository.project.saveProject(project);
}

const ProjectViewModel = {
  activeProject,
  tasks,
  setActiveProject,
  projectGroupBy,
  deleteProject,
  createProject,
  saveProject,
};

export default ProjectViewModel;
