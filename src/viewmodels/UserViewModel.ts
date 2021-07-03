import { ref, computed } from 'vue';
import { auth } from 'src/firebase';
import { User } from '@firebase/auth-types';
import PubSub from 'pubsub-js';

import BroadcastEvent, {
  EVENT_ACTIVE_PROJECT_SET,
  EVENT_ACTIVE_WORKSPACE_SET,
  EVENT_PROJECT_DELETED,
  EVENT_WORKSPACE_CREATED,
  EVENT_WORKSPACE_DELETED,
} from 'src/events/BroadcastEvents';
import AppRepository from 'src/repository/AppRepository';
import { UserSettingsData } from 'src/models/UserSettings';
import { WORKSPACE_ROLE } from 'src/models/Role';
import { WorkspaceData } from 'src/models/Workspace';
import { ProjectData } from 'src/models/Project';

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

PubSub.subscribe(
  EVENT_ACTIVE_WORKSPACE_SET,
  async (_msg: string, workspace: WorkspaceData) => {
    await updateMostRecent(workspace.id);
  }
);

PubSub.subscribe(
  EVENT_ACTIVE_PROJECT_SET,
  async (_msg: string, project: ProjectData) => {
    await updateMostRecent(project.workspace_id, project);
  }
);

PubSub.subscribe(
  EVENT_PROJECT_DELETED,
  async (_msg: string, project: ProjectData) => {
    await removeProjectIfMostRecent(project);
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
  await AppRepository.user.saveUserSettings(_settings.value);
}

async function removeWorkspaceFromSettings(workspace: WorkspaceData) {
  if (!_settings.value) throw 'useer settings missing';
  _settings.value.most_recent_workspace = '';
  _settings.value.most_recent_project = '';
  const index = _settings.value.workspaces.findIndex((w) => w == workspace.id);
  _settings.value.workspaces.splice(index, 1);
  if (_settings.value.workspaces[0])
    _settings.value.most_recent_workspace = _settings.value.workspaces[0];
  await AppRepository.user.saveUserSettings(_settings.value);
}

// project changes
async function updateMostRecent(workspaceId: string, project?: ProjectData) {
  if (!_settings.value) return;
  console.log('updating recent project');
  if (project) {
    _settings.value.most_recent_project = project.id;
    _settings.value.most_recent_workspace = project.workspace_id;
  } else {
    _settings.value.most_recent_project = '';
    _settings.value.most_recent_workspace = workspaceId;
  }

  await AppRepository.user.saveUserSettings(_settings.value);
}

async function removeProjectIfMostRecent(project: ProjectData) {
  if (!_settings.value) return;

  if (_settings.value.most_recent_project == project.id) {
    _settings.value.most_recent_project = '';
    await AppRepository.user.saveUserSettings(_settings.value);
  }
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

async function logOutuser() {
  await auth.signOut();
  _isLoggedIn.value = false;
  _settings.value = null;
  _role.value = null;
  BroadcastEvent.user.onUserLoggedOut();
}

const UserViewModel = {
  isLoggedIn,
  logOutuser,
  setUserRole,
  settings,
  role,
};

export default UserViewModel;
