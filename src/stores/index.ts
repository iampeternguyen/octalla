import { reactive, InjectionKey, computed, ref } from 'vue';
import { User } from '@firebase/auth-types';
import Task, { TaskData, TASKS_STORENAME } from 'src/models/Task';
import { auth, db } from 'src/firebase';
import Project, { ProjectData, PROJECTS_STORENAME } from 'src/models/Project';
import UserSettings, {
  UserSettingsData,
  USER_SETTINGS_STORENAME,
} from 'src/models/UserSettings';
import Workspace from 'src/models/Workspace';

interface UserStateInterface {
  isLoggedIn: boolean;
  userSettings: UserSettings | null;
}

interface ProjectStateInterface {
  activeWorkspace: string;
  activeProjectId: string;
  activeProject: Project | null;
  activeProjectTasks: Task[];
  projectsList: Project[];
  activeWorkspaceProjectObserver: (() => void) | null;
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
      userSettings: null,
    });

    this.#projectState = reactive({
      activeWorkspace: '',
      activeProjectId: '',
      activeProject: computed(() => {
        return (
          this.#projectState.projectsList.find(
            (p) => p.id == this.#projectState.activeProjectId
          ) || null
        );
      }),
      activeProjectTasks: [],
      activeProjectTaskObserver: null,
      activeWorkspaceProjectObserver: null,
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

  async onUserLoggedIn(user: User) {
    this.#userState.isLoggedIn = true;
    const doc = await db
      .collection(USER_SETTINGS_STORENAME)
      .doc(user.uid)
      .get();
    let userSettings: UserSettings;
    if (doc.exists) {
      userSettings = UserSettings.deserialize(doc.data() as UserSettingsData);
    } else {
      userSettings = new UserSettings(user.uid);
      userSettings.email = user.email || '';
      userSettings.display_name = user.displayName || '';
      await userSettings.save();
    }

    this.#userState.userSettings = userSettings;
    await this.setActiveWorkspace(
      this.#userState.userSettings.most_recent_workspace
    );
  }

  async onUserLoggedOut() {
    await auth.signOut();
    this.setUserStateToLoggedOut();
  }

  setUserStateToLoggedOut() {
    this.#userState.isLoggedIn = false;
    this.#userState.userSettings = null;
  }

  async setActiveProject(projectId: string) {
    if (this.projectState.value.activeProjectId == projectId) return;
    this.#projectState.activeProjectId = projectId;
    this.watchTasks(projectId);

    if (
      !this.#userState.userSettings ||
      this.#userState.userSettings.most_recent_project == projectId
    )
      return;
    this.#userState.userSettings.most_recent_project = projectId;
    await this.#userState.userSettings.save();
  }

  async setActiveWorkspace(workspaceId: string) {
    if (this.projectState.value.activeWorkspace == workspaceId) return;
    this.#projectState.activeWorkspace = workspaceId;
    this.watchProjects(workspaceId);
    if (
      !this.#userState.userSettings ||
      this.userState.value.userSettings?.most_recent_workspace == workspaceId
    )
      return;
    this.#userState.userSettings.most_recent_workspace = workspaceId;
    await this.#userState.userSettings.save();
  }

  async onCreateWorkspace(workSpace: Workspace) {
    this.#userState.userSettings?.workspaces.push(workSpace.id);
    await this.#userState.userSettings?.save();
  }

  // async getProjects() {
  //   if (!this.projectState.value.activeWorkspace) return;
  //   const query = await db
  //     .collection(PROJECTS_STORENAME)
  //     .where('workspace_id', '==', this.projectState.value.activeWorkspace)
  //     .get();
  //   query.docs.forEach((snapshot) => {
  //     const project = Project.deserialize(snapshot.data() as ProjectData);
  //     this.#projectState.projectsList.push(project);
  //   });
  // }

  watchProjects(workspaceId: string) {
    // unsubscribe
    if (this.#projectState.activeProjectTaskObserver)
      this.#projectState.activeProjectTaskObserver();
    // emptying array like this allows for computed to be responsive array=[] does not
    this.#projectState.projectsList.splice(
      0,
      this.#projectState.projectsList.length
    );

    const query = db
      .collection(PROJECTS_STORENAME)
      .where('workspace_id', '==', workspaceId);

    // const observer =
    this.#projectState.activeWorkspaceProjectObserver = query.onSnapshot(
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const projectData = change.doc.data() as ProjectData;
          console.log('projects change.type:', change.type);
          if (change.type === 'added') {
            const project = Project.deserialize(projectData);
            this.#projectState.projectsList.push(project);
          }
          if (change.type === 'modified') {
            const index = this.#projectState.activeProjectTasks.findIndex(
              (t) => t.id == projectData.id
            );
            this.#projectState.projectsList.splice(
              index,
              1,
              Project.deserialize(projectData)
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
      this.#projectState.activeProjectTasks.length
    );
    const query = db
      .collection(TASKS_STORENAME)
      .where('project_id', '==', projectId);
    this.#projectState.activeProjectTaskObserver = query.onSnapshot(
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const taskData = change.doc.data() as TaskData;
          console.log('tasks change.type: ', change.type);
          if (change.type === 'added') {
            const task = new Task(taskData.name, taskData);
            if (!task.sort_by.status)
              task.sort_by.status =
                this.#projectState.activeProjectTasks.length;
            this.#projectState.activeProjectTasks.push(task);
          }
          if (change.type === 'modified') {
            const index = this.#projectState.activeProjectTasks.findIndex(
              (t) => t.id == taskData.id
            );
            this.#projectState.activeProjectTasks.splice(
              index,
              1,
              Task.deserialize(taskData)
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
