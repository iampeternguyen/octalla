import { reactive, InjectionKey, computed } from 'vue';
import { User } from '@firebase/auth-types';
import Task, { TaskData, TASKS_STORENAME } from 'src/models/Task';
import { db } from 'src/firebase';
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

  private constructor() {
    this.#userState = reactive({
      isLoggedIn: false,
      user_id: '',
      email: '',
      display_name: '',
    });
    this.#projectTasks = reactive([]);
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

  onUserLoggedIn(user: User) {
    this.#userState.isLoggedIn = true;
    this.#userState.user_id = user.uid;
    this.#userState.email = user.email || '';
    this.#userState.display_name = user.displayName || '';
  }

  watchTasks(projectId: string) {
    const query = db
      .collection(TASKS_STORENAME)
      .where('user_id', '==', projectId);
    // const observer =
    query.onSnapshot(
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const taskData = change.doc.data() as TaskData;
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
