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

interface ProjectStateInterface {
  activeProjectId: string;
  activeProject: Project | null;
  activeProjectTasks: Task[];
  projectsList: Project[];
  activeProjectTaskObserver: (() => void) | null;
}

export default class Store {
  private static instance: Store;
  static StoreKey: InjectionKey<Store> = Symbol('Store');

  #userState: UserStateInterface;
  #projectState: ProjectStateInterface;

  #showNewProjectModal = ref(false);

  private constructor() {
    this.#userState = reactive({
      isLoggedIn: false,
      user_id: '',
      email: '',
      display_name: '',
    });

    this.#projectState = reactive({
      activeProjectId: '',
      activeProject: null,
      activeProjectTasks: [],
      activeProjectTaskObserver: null,
      projectsList: [],
    });
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

  get projectState() {
    return computed(() => this.#projectState);
  }

  get activeProject() {
    return computed(() => this.#projectState.activeProject);
  }

  get projectTasks() {
    return computed(() => this.#projectState.activeProjectTasks);
  }

  get projectsList() {
    return computed(() => this.#projectState.projectsList);
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

  async setActiveProject(projectId: string) {
    this.#projectState.activeProjectId = projectId;
    const doc = await db.collection(PROJECTS_STORENAME).doc(projectId).get();
    const projectData = doc.data() as ProjectData;
    this.#projectState.activeProject = new Project(
      projectData.name,
      projectData
    );
    this.watchTasks(projectId);
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
          if (change.type === 'added') {
            const project = new Project(projectData.name, projectData);
            this.#projectState.projectsList.push(project);
          }
          if (change.type === 'modified') {
            const index = this.#projectState.activeProjectTasks.findIndex(
              (t) => t.id == projectData.id
            );
            this.#projectState.projectsList[index] = new Project(
              projectData.name,
              projectData
            );
          }
          if (change.type === 'removed') {
            const index = this.#projectState.activeProjectTasks.findIndex(
              (t) => t.id == projectData.id
            );
            this.#projectState.projectsList.splice(index, 1);
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
    if (this.#projectState.activeProjectTaskObserver)
      this.#projectState.activeProjectTaskObserver();
    // emptying array like this allows for computed to be responsive array=[] does not
    this.#projectState.activeProjectTasks.splice(
      0,
      this.#projectState.projectsList.length
    );
    const query = db
      .collection(TASKS_STORENAME)
      .where('project_id', '==', projectId);
    this.#projectState.activeProjectTaskObserver = query.onSnapshot(
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const taskData = change.doc.data() as TaskData;
          console.log('change.type ', change.type);
          if (change.type === 'added') {
            const task = new Task(taskData.name, taskData);
            this.#projectState.activeProjectTasks.push(task);
          }
          if (change.type === 'modified') {
            const index = this.#projectState.activeProjectTasks.findIndex(
              (t) => t.id == taskData.id
            );
            this.#projectState.activeProjectTasks[index] = new Task(
              taskData.name,
              taskData
            );
          }
          if (change.type === 'removed') {
            const index = this.#projectState.activeProjectTasks.findIndex(
              (t) => t.id == taskData.id
            );
            this.#projectState.activeProjectTasks.splice(index, 1);
          }
        });
      },
      (err) => {
        console.log(`Encountered error: ${err.message}`);
      }
    );
  }
}
