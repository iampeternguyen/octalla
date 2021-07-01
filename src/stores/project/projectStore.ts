import { db } from 'src/firebase';
import { reactive, computed } from 'vue';
import Project from 'src/models/Project';
import Task, { TaskData, TASKS_STORENAME } from 'src/models/Task';
import workspaceStore from '../workspace/workspaceStore';
import eventsStore from '../events/eventsStore';
import permissions from 'src/router/permissions';
import uiStore from '../ui/uiStore';
import userStore from '../user/userStore';

const projectState = reactive({
  requestSetActiveProjectWithId: '',
  activeProject: <Project | null>null,
  tasks: [] as Task[],
});

// getters
const state = computed(() => projectState);
const activeProject = computed(() => projectState.activeProject);
const activeProjectGroupBy = computed(
  () => projectState.activeProject?.group_by
);
const requestSetActiveProjectWithId = computed(
  () => projectState.requestSetActiveProjectWithId
);
const tasks = computed(() => projectState.tasks);

// MODIFY PROJECTS

async function projectGroupBy(field: string) {
  if (!projectState.activeProject) return;
  projectState.activeProject.group_by = field;
  await projectState.activeProject.save();
}

async function deleteProject(project: Project) {
  if (!permissions.project.canDelete(project)) return;

  console.log('permission to delete project');

  uiStore.updateLoadingMessage(
    `Deleting ${project.name}... DO NOT CLOSE THIS PAGE`
  );
  uiStore.showLoading();
  if (projectState.activeProject && projectState.activeProject.id == project.id)
    projectState.activeProject = null;
  await project.delete();
  uiStore.hideLoading();

  // const id = workspaceState.activeSpace.id;
  // workspaceState.activeSpace = null;
  // return id;
}

// watch active project methods

async function setActiveProject(projectId: string) {
  const project = workspaceStore.projects.value.find((p) => p.id == projectId);
  if (project) {
    projectState.requestSetActiveProjectWithId = '';
    projectState.activeProject = project;
    watchTasks();
    await eventsStore.project.afterProjectSetActive(project);
  } else {
    throw 'Project not found';
  }
}

let projectTasksObserver = () => {
  return;
};

function watchTasks() {
  if (!activeProject.value) return;
  // unsubscribe
  projectTasksObserver();
  clearProjectTasks();

  const query = db
    .collection(TASKS_STORENAME)
    .where('workspace_id', '==', activeProject.value.workspace_id)
    .where('project_id', '==', activeProject.value.id);
  console.log(
    'watching tasks',
    userStore.state.value.role,
    activeProject.value.id
  );
  projectTasksObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const taskData = change.doc.data() as TaskData;
        const task = Task.deserialize(taskData);
        console.log('task change type:', change.type);
        if (change.type === 'added') {
          addProjectTask(task);
        }
        if (change.type === 'modified') {
          updateProjectTask(task);
        }
        if (change.type === 'removed') {
          removeProjectTask(task);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err.message}`);
    }
  );
}

function clearProjectTasks() {
  projectState.tasks.splice(0, projectState.tasks.length);
}

function updateProjectTask(task: Task) {
  const index = projectState.tasks.findIndex((t) => t.id == task.id);
  projectState.tasks.splice(index, 1, task);
}

function removeProjectTask(task: Task) {
  const index = projectState.tasks.findIndex((t) => t.id == task.id);
  projectState.tasks.splice(index, 1);
}

function addProjectTask(task: Task) {
  projectState.tasks.push(task);
}

const projectStore = {
  activeProject,
  requestSetActiveProjectWithId,
  tasks,
  state,
  activeProjectGroupBy,
  setActiveProject,
  deleteProject,
  projectGroupBy,
};

export default projectStore;
