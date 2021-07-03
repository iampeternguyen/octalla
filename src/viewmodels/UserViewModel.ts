import { ref, computed } from 'vue';
import { auth } from 'src/firebase';
import { User } from '@firebase/auth-types';
import PubSub from 'pubsub-js';

import BroadcastEvent, {
  EVENT_ACTIVE_WORKSPACE_SET,
  EVENT_USER_AUTHENTICATED,
  EVENT_WORKSPACE_CREATED,
  EVENT_WORKSPACE_DELETED,
} from 'src/events/BroadcastEvents';
import AppRepository from 'src/repository/AppRepository';
import UserSettings, { UserSettingsData } from 'src/models/UserSettings';
import userStore from 'src/stores/user/userStore';
import { WORKSPACE_ROLE } from 'src/models/Role';
import { WorkspaceData } from 'src/models/Workspace';

// Subscriptions
PubSub.subscribe(
  EVENT_WORKSPACE_CREATED,
  async (_msg: string, workspace: WorkspaceData) => {
    await addWorkspaceToSettings(workspace);
  }
);

PubSub.subscribe(
  EVENT_WORKSPACE_DELETED,
  async (_msg: string, workspace: WorkspaceData) => {
    await removeWorkspaceFromSettings(workspace);
  }
);

// state
const _isLoggedIn = ref(false);
const _attemptedLogIn = ref(false);
const _settings = ref<UserSettingsData | null>(null);
const _role = ref<WORKSPACE_ROLE | null>(null);
// getters
const isLoggedIn = async () => {
  if (_isLoggedIn.value) return _isLoggedIn.value;
  if (_attemptedLogIn.value) return false;

  const isAuth = await userIsAuthenticated();
  return isAuth;
};

const settings = computed(() => _settings.value);
const role = computed(() => _role.value);

// workspace changes
async function addWorkspaceToSettings(workspace: WorkspaceData) {
  if (!_settings.value) throw 'user settings missing';

  _settings.value.workspaces.push(workspace.id);
  await AppRepository.user.updateUserSettings(_settings.value);
}

async function removeWorkspaceFromSettings(workspace: WorkspaceData) {
  if (!_settings.value) throw 'useer settings missing';
  _settings.value.most_recent_workspace = '';
  _settings.value.most_recent_project = '';
  const index = _settings.value.workspaces.findIndex((w) => w == workspace.id);
  _settings.value.workspaces.splice(index, 1);
  if (_settings.value.workspaces[0])
    _settings.value.most_recent_workspace = _settings.value.workspaces[0];
  await AppRepository.user.updateUserSettings(_settings.value);
}

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
      .then(async (user) => {
        if (user) {
          await fetchUserSettings(user);
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

async function setUserRole(workspace: WorkspaceData) {
  if (!_settings.value) {
    console.log('Error setting user role');
    return;
  }
  _role.value = await AppRepository.user.fetchUserRole(
    workspace.id,
    _settings.value.id
  );
}

const UserViewModel = {
  isLoggedIn,
  setUserRole,
  settings,
  role,
};

export default UserViewModel;
