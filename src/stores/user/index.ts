import { db, auth } from 'src/firebase';
import { reactive, computed } from 'vue';
import { User } from '@firebase/auth-types';
import {
  ROLES_MEMBERS_STORENAME,
  ROLES_STORENAME,
  WorkspaceRolesMemberData,
  WORKSPACE_ROLE,
} from 'src/models/Role';
import workspaceStore from '../workspace';
import UserSettings, {
  UserSettingsData,
  USER_SETTINGS_STORENAME,
} from 'src/models/UserSettings';
import Project from 'src/models/Project';

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

async function updateMostRecentProject(project: Project) {
  if (!userState.settings) throw 'error updating most recent project';
  console.log('updating recent project');
  userState.settings.most_recent_project = project.id;
  userState.settings.most_recent_workspace = project.workspace_id;
  await userState.settings.save();
}

async function updateMostRecentWorkspace(workspaceId: string) {
  if (!userState.settings) throw 'error updating most recent workspace';
  console.log('updating recent workspace');
  userState.settings.most_recent_workspace = workspaceId;
  userState.settings.most_recent_project = '';
  await userState.settings.save();
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
  // TODO chain event to setting active workspace
}

async function onUserLoggedOut() {
  await auth.signOut();
  userState.isLoggedIn = false;
  userState.settings = null;
  userState.role = null;
}

async function onActiveWorkspaceChanged() {
  await setUserRole();
}

async function setUserRole() {
  console.log('querying db for role');
  const doc = await db
    .collection(ROLES_STORENAME)
    .doc(workspaceStore.activeWorkspace.value?.id)
    .collection(ROLES_MEMBERS_STORENAME)
    .doc(userStore.settings.value?.id)
    .get();
  const role = (doc.data() as WorkspaceRolesMemberData).role;
  userState.role = role;
}

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
          await userStore.onUserLoggedIn(user);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => reject(err));
  });
}

const userStore = {
  settings,
  isLoggedIn,
  role,
  state,
  onUserLoggedIn,
  onUserLoggedOut,
  onActiveWorkspaceChanged,
  updateMostRecentProject,
  updateMostRecentWorkspace,
  setUserRole,
  userIsAuthenticated,
};

export default userStore;
