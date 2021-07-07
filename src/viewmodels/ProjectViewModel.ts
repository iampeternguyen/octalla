import BroadcastEvent, {
  EVENT_ACTIVE_PROJECT_SET,
} from 'src/events/BroadcastEvents';
import Project, { ProjectData } from 'src/models/Project';
import { TaskData } from 'src/models/Task';
import AppRepository from 'src/repository/AppRepository';
import permissions from 'src/router/permissions';
import { ref, computed } from 'vue';
import UIViewModel from './UIViewModel';
import UserViewModel from './UserViewModel';
import WorkspaceViewModel from './WorkspaceViewModel';

// subscriptions
PubSub.subscribe(
  EVENT_ACTIVE_PROJECT_SET,
  (_msg: string, project: ProjectData) => {
    watchTasks(project);
  }
);

// state
const _activeProject = ref<Project | null>(null);
const _tasks = ref<TaskData[]>([]);
const _failedActiveProjectRequest = ref('');

const properties = {
  activeProject: computed(() => _activeProject.value?.serialize()),
  tasks: computed(() => _tasks.value),
};

// watch

// setters

const setActiveProject = async (projectId: string) => {
  let project = WorkspaceViewModel.properties.projects.value.find(
    (p) => p.id == projectId
  );
  if (project) {
    _failedActiveProjectRequest.value = '';
    _activeProject.value = Project.deserialize(project);

    BroadcastEvent.project.onActiveProjectSet(project);
  } else {
    project = await AppRepository.project.getProject(projectId);
    if (project) {
      _activeProject.value = Project.deserialize(project);

      BroadcastEvent.project.onActiveProjectSet(project);
    }
  }
};

async function projectGroupBy(field: string) {
  if (!_activeProject.value) return;
  _activeProject.value.group_by = field;
  await AppRepository.project.saveProject(_activeProject.value.serialize());
}

// PROJECT CREATE

async function createProject(
  name: string,
  workspaceId: string,
  goal?: string,
  success?: string
) {
  if (
    !WorkspaceViewModel.properties.activeSpace.value ||
    !UserViewModel.properties.settings.value
  )
    return;
  const project = new Project(
    name,
    UserViewModel.properties.settings.value.id,
    workspaceId
  );
  project.primary_goal = goal || '';
  project.success_looks_like = success || '';
  await AppRepository.project.saveProject(project.serialize());
  await WorkspaceViewModel.methods.addProjectToFolderStructure(
    project.serialize()
  );

  return project.serialize();
}

async function updateProject(projectData: ProjectData) {
  if (permissions.project.canCRU(projectData))
    await AppRepository.project.saveProject(projectData);
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

const ProjectViewModel = {
  properties,
  methods: {
    setActiveProject,
    projectGroupBy,
    deleteProject,
    createProject,
    updateProject,
  },
};

export default ProjectViewModel;
