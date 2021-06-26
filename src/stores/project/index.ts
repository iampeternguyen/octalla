import { db } from 'src/firebase';
import { reactive, computed } from 'vue';
import Project from 'src/models/Project';
import Task, { TaskData, TASKS_STORENAME } from 'src/models/Task';
import workspaceStore from '../workspace';

const projectState = reactive({
  requestSetActiveProjectWithId: '',
  activeProject: <Project | null>null,
  tasks: [] as Task[],
});

const state = computed(() => projectState);
const activeProject = computed(() => projectState.activeProject);
const requestSetActiveProjectWithId = computed(
  () => projectState.requestSetActiveProjectWithId
);
const tasks = computed(() => projectState.tasks);

let projectTasksObserver = () => {
  return;
};

function watchTasks() {
  if (!activeProject.value) return;
  // unsubscribe
  projectTasksObserver();
  // emptying array like this allows for computed to be responsive array=[] does not
  emptyTasksList();
  const query = db
    .collection(TASKS_STORENAME)
    .where('project_id', '==', activeProject.value.id);
  projectTasksObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const taskData = change.doc.data() as TaskData;
        const task = Task.deserialize(taskData);

        if (change.type === 'added') {
          if (!task.sort_by.status)
            task.sort_by.status = projectState.tasks.length;
          addTask(task);
        }
        if (change.type === 'modified') {
          updateTask(task);
        }
        if (change.type === 'removed') {
          removeTask(task);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err.message}`);
    }
  );
}

function emptyTasksList() {
  projectState.tasks.splice(0, projectState.tasks.length);
}

function updateTask(task: Task) {
  const index = projectState.tasks.findIndex((t) => t.id == task.id);
  projectState.tasks.splice(index, 1, task);
}

function removeTask(task: Task) {
  const index = projectState.tasks.findIndex((t) => t.id == task.id);
  projectState.tasks.splice(index, 1);
}

function addTask(task: Task) {
  projectState.tasks.push(task);
}

// TODO protect against invalid project name
function setActiveProject(projectId: string) {
  const project = workspaceStore.projects.value.find((p) => p.id == projectId);

  if (project) {
    projectState.requestSetActiveProjectWithId = '';
    projectState.activeProject = project;
    watchTasks();
  } else {
    projectState.requestSetActiveProjectWithId = projectId;
  }
}

const projectStore = {
  activeProject,
  requestSetActiveProjectWithId,
  tasks,
  state,
  setActiveProject,
};

export default projectStore;
