import { User } from '@firebase/auth-types';
import { db } from 'src/firebase';
import UserSettings, { UserSettingsData } from 'src/models/UserSettings';
import { WorkspaceData } from 'src/models/Workspace';

const USER_SETTINGS_STORENAME = 'user_settings';
const WORKSPACE_STORENAME = 'workspaces';

const fetchUserSettings = async (user: User) => {
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

  return userSettings.serialize();
};

const fetchWorkspace = async (workspaceId: string) => {
  const doc = await db.collection(WORKSPACE_STORENAME).doc(workspaceId).get();
  return doc.data() as WorkspaceData;
};

const AppRepository = {
  user: {
    fetchUserSettings,
  },
  workspace: {
    fetchWorkspace,
  },
};

export default AppRepository;
