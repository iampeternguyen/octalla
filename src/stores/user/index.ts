import { db, auth } from 'src/firebase';
import { reactive, computed } from 'vue';
import { User } from '@firebase/auth-types';
import { WORKSPACE_ROLE } from 'src/models/Role';
import workspaceStore from '../workspace';
import UserSettings, {
  UserSettingsData,
  USER_SETTINGS_STORENAME,
} from 'src/models/UserSettings';

const userState = reactive({
  isLoggedIn: false,
  settings: <UserSettings | null>null,
  role: <WORKSPACE_ROLE | null>null,
});

// getters
const settings = computed(() => userState.settings);
const isLoggedIn = computed(() => userState.isLoggedIn);
const role = computed(() => userState.role);
const state = computed(() => userState);

// edit settings

async function updateMostRecentProject(projectId: string) {
  if (!userState.settings) throw 'error updating most recent project';
  (userState.settings.most_recent_project = projectId),
    await userState.settings.save();
}

async function updateMostRecentWorkspace(workspaceId: string) {
  if (!userState.settings) throw 'error updating most recent workspace';
  (userState.settings.most_recent_workspace = workspaceId),
    await userState.settings.save();
}

// TODO check to see if this is auto called on new workspace active
function setUserRole(role: WORKSPACE_ROLE) {
  userState.role = role;
}

// login/logout
async function onUserLoggedIn(user: User) {
  userState.isLoggedIn = true;
  const doc = await db.collection(USER_SETTINGS_STORENAME).doc(user.uid).get();
  let userSettings: UserSettings;
  if (doc.exists) {
    userSettings = UserSettings.deserialize(doc.data() as UserSettingsData);
  } else {
    userSettings = new UserSettings(user.uid);
    userSettings.email = user.email || '';
    userSettings.display_name = user.displayName || '';
    await userSettings.save();
  }

  userState.settings = userSettings;
  if (userSettings.most_recent_project)
    await workspaceStore.setActiveWorkspace(userSettings.most_recent_workspace);
}

async function onUserLoggedOut() {
  await auth.signOut();
  userState.isLoggedIn = false;
  userState.settings = null;
  userState.role = null;
}

const userStore = {
  settings,
  isLoggedIn,
  role,
  state,
  onUserLoggedIn,
  onUserLoggedOut,
  updateMostRecentProject,
  updateMostRecentWorkspace,
  setUserRole,
};

export default userStore;
