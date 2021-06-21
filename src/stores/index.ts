import { reactive, InjectionKey, computed, ref } from 'vue';
import { User } from '@firebase/auth-types';
import Task, { TaskData, TASKS_STORENAME } from 'src/models/Task';
import { db } from 'src/firebase';
import Project, { ProjectData, PROJECTS_STORENAME } from 'src/models/Project';

interface UserStateInterface {
  isLoggedIn: boolean;
  user_id: string;
  email: string;
  display_name: string;
}

export default class Store {
  private static instance: Store;
  static StoreKey: InjectionKey<Store> = Symbol('Store');

  #userState: UserStateInterface;
  #projectTasks: Task[];
  #projectsList: Project[];
  #projectTasksObserver: (() => void) | null;

  #showNewProjectModal = ref(false);

  private constructor() {
    this.#userState = reactive({
      isLoggedIn: false,
      user_id: '',
      email: '',
      display_name: '',
    });
    this.#projectTasks = reactive([]);
    this.#projectsList = reactive([]);
    this.#projectTasksObserver = null;
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  get userState() {
    return computed(() => this.#userState);
  }

  get projectTasks() {
    return computed(() => this.#projectTasks);
  }

  get projectsList() {
    return computed(() => this.#projectsList);
  }

  get showNewProjectModal() {
    return computed(() => this.#showNewProjectModal);
  }

  toggleShowNewProjectModal() {
    this.#showNewProjectModal.value = !this.#showNewProjectModal.value;
  }

  onUserLoggedIn(user: User) {
    this.#userState.isLoggedIn = true;
    this.#userState.user_id = user.uid;
    this.#userState.email = user.email || '';
    this.#userState.display_name = user.displayName || '';
    this.watchProjects();
  }

  watchProjects() {
    const query = db
      .collection(PROJECTS_STORENAME)
      .where('created_by', '==', this.#userState.user_id);
    // const observer =
    query.onSnapshot(
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const projectData = change.doc.data() as ProjectData;
          console.log('proj.change.type ', change.type);
          if (change.type === 'added') {
            const project = new Project(projectData.name, projectData);
            this.#projectsList.push(project);
          }
          if (change.type === 'modified') {
            const index = this.#projectTasks.findIndex(
              (t) => t.id == projectData.id
            );
            this.#projectsList[index] = new Project(
              projectData.name,
              projectData
            );
          }
          if (change.type === 'removed') {
            const index = this.#projectTasks.findIndex(
              (t) => t.id == projectData.id
            );
            this.#projectsList.splice(index, 1);
          }
        });
      },
      (err) => {
        console.log(`Encountered error: ${err.message}`);
      }
    );
  }

  watchTasks(projectId: string) {
    // unsubscribe
    if (this.#projectTasksObserver) this.#projectTasksObserver();
    // emptying array like this allows for computed to be responsive array=[] does not
    this.#projectTasks.splice(0, this.#projectsList.length);
    const query = db
      .collection(TASKS_STORENAME)
      .where('project_id', '==', projectId);
    this.#projectTasksObserver = query.onSnapshot(
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const taskData = change.doc.data() as TaskData;
          console.log('change.type ', change.type);
          if (change.type === 'added') {
            const task = new Task(taskData.name, taskData);
            this.#projectTasks.push(task);
          }
          if (change.type === 'modified') {
            const index = this.#projectTasks.findIndex(
              (t) => t.id == taskData.id
            );
            this.#projectTasks[index] = new Task(taskData.name, taskData);
          }
          if (change.type === 'removed') {
            const index = this.#projectTasks.findIndex(
              (t) => t.id == taskData.id
            );
            this.#projectTasks.splice(index, 1);
          }
        });
      },
      (err) => {
        console.log(`Encountered error: ${err.message}`);
      }
    );
  }
}
