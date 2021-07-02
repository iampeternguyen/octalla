import { ref, computed } from 'vue';
import { auth } from 'src/firebase';
import { User } from '@firebase/auth-types';
import PubSub from 'pubsub-js';

import BroadcastEvent, {
  EVENT_USER_AUTHENTICATED,
} from 'src/events/BroadcastEvents';
import AppRepository from 'src/repository/AppRepository';
import UserSettings, { UserSettingsData } from 'src/models/UserSettings';
import userStore from 'src/stores/user/userStore';

// Subscriptions
PubSub.subscribe(EVENT_USER_AUTHENTICATED, async (_msg: string, user: User) => {
  console.log('subscribed to login', user);
  try {
    await fetchUserSettings(user);
  } catch (error) {
    console.log(error);
  }
});

// state
const _isLoggedIn = ref(false);
const _attemptedLogIn = ref(false);
const _settings = ref<UserSettingsData | null>(null);

// getters
const isLoggedIn = async () => {
  if (_isLoggedIn.value) return _isLoggedIn.value;
  if (_attemptedLogIn.value) return false;

  const isAuth = await userIsAuthenticated();
  return isAuth;
};

const settings = computed(() => _settings.value);

// Auth Methods
function userIsAuthenticated(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const authUser: () => Promise<User | null> = () => {
      return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(
          (user: User | null) => {
            resolve(user);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    };

    authUser()
      .then((user) => {
        if (user) {
          BroadcastEvent.user.onUserAuthenticated(user);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => reject(err));
  });
}

async function fetchUserSettings(user: User) {
  _isLoggedIn.value = true;
  _settings.value = await AppRepository.user.fetchUserSettings(user);

  //   TODO remove when finished refactor
  userStore._userState.settings = UserSettings.deserialize(_settings.value);
}

const UserViewModel = {
  isLoggedIn,
  settings,
};

export default UserViewModel;
