import { ref, computed, reactive } from 'vue';
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
import UserSettings from 'src/models/UserSettings';
import { WORKSPACE_ROLE } from 'src/models/Role';
import { WorkspaceData } from 'src/models/Workspace';
import { ProjectData } from 'src/models/Project';
import WorkspaceViewModel from './WorkspaceViewModel';
import AppProfile from 'src/models/AppProfile';

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
    await updateMostRecentWorkspace(workspace);
    await setUserSettings(workspace);
  }
);

PubSub.subscribe(
  EVENT_ACTIVE_PROJECT_SET,
  async (_msg: string, project: ProjectData) => {
    await updateMostRecentProject(project);
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
const _settings = ref<UserSettings | null>(null);
const _role = ref<WORKSPACE_ROLE | null>(null);
const _appProfile = ref<AppProfile | null>(null);
// getters
const isLoggedInAndRecheck = async () => {
  if (_isLoggedIn.value) return _isLoggedIn.value;
  if (_attemptedLogIn.value) return false;

  const isAuth = await userIsAuthenticated();
  return isAuth;
};

const settings = computed(() => _settings.value?.serialize());
const role = computed(() => _role.value);
const appProfile = computed(() => _appProfile.value);
const isLoggedIn = computed(() => _isLoggedIn.value);
const properties = reactive({
  settings,
  role,
  appProfile,
  isLoggedIn,
});

// workspace changes
async function addWorkspaceToSettings(workspace: WorkspaceData) {
  if (!_appProfile.value) throw 'user settings missing';
  if (_appProfile.value.workspaces.find((w) => w == workspace.id)) return;
  _appProfile.value.workspaces.push(workspace.id);
  await AppRepository.user.saveAppProfile(_appProfile.value.serialize());
}

async function removeWorkspaceFromSettings(workspace: WorkspaceData) {
  if (!_appProfile.value) throw 'useer settings missing';
  _appProfile.value.most_recent_workspace = '';
  // _appProfile.value.most_recent_project = '';
  const index = _appProfile.value?.workspaces.findIndex(
    (w) => w == workspace.id
  );
  _appProfile.value?.workspaces.splice(index, 1);
  if (_appProfile.value.workspaces[0])
    _appProfile.value.most_recent_workspace = _appProfile.value.workspaces[0];
  await AppRepository.user.saveAppProfile(_appProfile.value.serialize());
}

// project changes
async function updateMostRecentProject(project: ProjectData) {
  if (!_settings.value) return;
  console.log('updating recent project');
  if (project.id != _settings.value.most_recent_project) {
    _settings.value.most_recent_project = project.id;
  }

  await AppRepository.user.saveUserSettings(_settings.value.serialize());
}
async function updateMostRecentWorkspace(workspace: WorkspaceData) {
  if (!_appProfile.value) return;
  console.log('updating recent workspace');
  if (_appProfile.value.most_recent_workspace != workspace.id) {
    _appProfile.value.most_recent_workspace = workspace.id;
  }

  await AppRepository.user.saveAppProfile(_appProfile.value.serialize());
}

async function removeProjectIfMostRecent(project: ProjectData) {
  if (!_settings.value) return;

  if (_settings.value.most_recent_project == project.id) {
    _settings.value.most_recent_project = '';
    await AppRepository.user.saveUserSettings(_settings.value.serialize());
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
          _isLoggedIn.value = true;
          await getAppProfile(user);
          // TODO move to after create
          // await getUserSettings(user);
          BroadcastEvent.user.onUserAuthenticated(user);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => reject(err));
  });
}

async function setUpUserRoleAndWorkspace(user: User, token: string) {
  // TODO delete token after sign in
  const invite = await AppRepository.workspace.getWorkspaceInvite(token);
  const appProfile =
    AppProfile.convertFirebaseUserToGlobalUserProfileData(user);
  await AppRepository.workspace.addUserToWorkspace(appProfile, invite);

  await WorkspaceViewModel.methods.setActiveWorkspace(invite.workspace_id);
  if (WorkspaceViewModel.properties.activeSpace)
    await addWorkspaceToSettings(WorkspaceViewModel.properties.activeSpace);
  await AppRepository.workspace.deleteWorkspaceInvite(token);
}

async function getAppProfile(user: User) {
  _appProfile.value = AppProfile.deserialize(
    await AppRepository.user.getAppProfile(user)
  );
}

async function setUserSettings(workspace: WorkspaceData) {
  if (!_appProfile.value) return;
  _settings.value = UserSettings.deserialize(
    await AppRepository.user.getUserSettings(workspace, _appProfile.value)
  );
}

async function setUserWorkspaceData(workspace: WorkspaceData) {
  if (!_appProfile.value) {
    console.log('Error setting user role');
    return;
  }
  _role.value = await AppRepository.user.getUserRole(
    workspace.id,
    _appProfile.value.id
  );

  console.log('getting role', _role.value);
  await setUserSettings(workspace);
}

async function logOutuser() {
  await auth.signOut();
  _isLoggedIn.value = false;
  _settings.value = null;
  _role.value = null;
  BroadcastEvent.user.onUserLoggedOut();
}

const UserViewModel = {
  properties,
  methods: {
    setUpUserRoleAndWorkspace,
    isLoggedInAndRecheck,
    logOutuser,
    setUserWorkspaceData,
  },
};

export default UserViewModel;
