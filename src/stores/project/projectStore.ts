import { db } from 'src/firebase';
import { reactive, computed } from 'vue';
import Project from 'src/models/Project';
import Task, { TaskData, TASKS_STORENAME } from 'src/models/Task';
import workspaceStore from '../workspace/workspaceStore';
import userStore from '../user/userStore';
import eventsStore from '../events/eventsStore';

const projectState = reactive({
  requestSetActiveProjectWithId: '',
  activeProject: <Project | null>null,
  tasks: [] as Task[],
});

// getters
const state = computed(() => projectState);
const activeProject = computed(() => projectState.activeProject);
const requestSetActiveProjectWithId = computed(
  () => projectState.requestSetActiveProjectWithId
);
const tasks = computed(() => projectState.tasks);

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
    .where('project_id', '==', activeProject.value.id);
  projectTasksObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const taskData = change.doc.data() as TaskData;
        const task = Task.deserialize(taskData);

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
  setActiveProject,
};

export default projectStore;
