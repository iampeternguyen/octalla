import { db, auth } from 'src/firebase';
import { reactive, computed } from 'vue';
import { User } from '@firebase/auth-types';
import WorkspaceRole, {
  ROLES_MEMBERS_STORENAME,
  ROLES_STORENAME,
  WorkspaceRoleData,
  WORKSPACE_ROLE,
} from 'src/models/Role';
import UserSettings from 'src/models/UserSettings';
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

async function onUserLoggedOut() {
  await auth.signOut();
  userState.isLoggedIn = false;
  userState.settings = null;
  userState.role = null;
}

async function removeWorkspaceFromSettings(workspaceId: string) {
  if (!userState.settings) throw 'useer settings missing';
  userState.settings.most_recent_workspace = '';
  userState.settings.most_recent_project = '';
  const index = userState.settings.workspaces.findIndex(
    (w) => w == workspaceId
  );
  userState.settings.workspaces.splice(index, 1);
  if (userState.settings.workspaces[0])
    userState.settings.most_recent_workspace = userState.settings.workspaces[0];
  await userState.settings.save();
}

async function removeProjectIfMostRecent(projectId: string) {
  if (!userState.settings) return;

  if (userState.settings.most_recent_project == projectId) {
    userState.settings.most_recent_project = '';
    await userState.settings.save();
  }
}

const userStore = {
  settings,
  isLoggedIn,
  role,
  state,
  onUserLoggedOut,
  removeProjectIfMostRecent,
  removeWorkspaceFromSettings,
  updateMostRecentProject,
  updateMostRecentWorkspace,

  _userState: userState,
};

export default userStore;
