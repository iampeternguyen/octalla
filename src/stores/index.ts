import { reactive, InjectionKey, computed } from 'vue';
import { User } from '@firebase/auth-types';
interface UserStateInterface {
  isLoggedIn: boolean;
}

export default class Store {
  private static instance: Store;
  static StoreKey: InjectionKey<Store> = Symbol('Store');

  #userState: UserStateInterface;

  private constructor() {
    this.#userState = reactive({
      isLoggedIn: false,
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

  onUserLoggedIn(user: User) {
    console.log(user);
    this.#userState.isLoggedIn = true;
  }
}
