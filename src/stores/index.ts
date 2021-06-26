import { reactive, InjectionKey, computed, ref } from 'vue';
import Task, { TaskData, TASKS_STORENAME } from 'src/models/Task';
import { db } from 'src/firebase';
import UserSettings, {
  UserSettingsData,
  USER_SETTINGS_STORENAME,
} from 'src/models/UserSettings';
import Workspace from 'src/models/Workspace';
import WorkspaceRoles, { WORKSPACE_ROLE } from 'src/models/Role';

import workspaceStore from './workspace';

interface ProjectStateInterface {
  activeWorkspaceRole: WORKSPACE_ROLE | string;
}

export default class Store {
  private static instance: Store;
  static StoreKey: InjectionKey<Store> = Symbol('Store');

  #projectState: ProjectStateInterface;

  #showNewProjectModal = ref(false);

  private constructor() {
    this.#projectState = reactive({
      activeWorkspaceRole: '',
    });
  }

  get showNewProjectModal() {
    return computed(() => this.#showNewProjectModal);
  }

  toggleShowNewProjectModal() {
    this.#showNewProjectModal.value = !this.#showNewProjectModal.value;
  }
}
