import { User } from '@firebase/auth-types';
import { db } from 'src/firebase';
import AppProfile, {
  AppProfileData,
  APP_PROFILE_STORENAME,
} from 'src/models/AppProfile';
import {
  ROLES_STORENAME,
  ROLES_MEMBERS_STORENAME,
  WorkspaceRoleData,
} from 'src/models/Role';
import UserSettings, {
  USER_SETTINGS_STORENAME,
  UserSettingsData,
} from 'src/models/UserSettings';
import { WorkspaceData } from 'src/models/Workspace';

// USERS - GETTERS
const getUserSettings = async (
  workspace: WorkspaceData,
  user: AppProfileData
) => {
  const doc = await db
    .collection(USER_SETTINGS_STORENAME)
    .doc(workspace.id)
    .collection(USER_SETTINGS_STORENAME)
    .doc(user.id)
    .get();
  let userSettings: UserSettings;
  if (doc.exists) {
    userSettings = UserSettings.deserialize(doc.data() as UserSettingsData);
  } else {
    userSettings = new UserSettings(user.id, workspace.id);

    await saveUserSettings(userSettings.serialize());
  }

  return userSettings.serialize();
};

const getAppProfile = async (user: User) => {
  const doc = await db.collection(APP_PROFILE_STORENAME).doc(user.uid).get();
  let appProfile: AppProfileData;
  if (doc.exists) {
    appProfile = doc.data() as AppProfileData;
  } else {
    appProfile = AppProfile.convertFirebaseUserToGlobalUserProfileData(user);

    await saveAppProfile(appProfile);
  }

  return appProfile;
};

const getUserRole = async (workspaceId: string, userId: string) => {
  const doc = await db
    .collection(ROLES_STORENAME)
    .doc(workspaceId)
    .collection(ROLES_MEMBERS_STORENAME)
    .doc(userId)
    .get();
  return (doc.data() as WorkspaceRoleData).role;
};

// USERS - SETTERS
const saveUserSettings = async (settings: UserSettingsData) => {
  settings.last_modified = Date.now();
  await db
    .collection(USER_SETTINGS_STORENAME)
    .doc(settings.workspace_id)
    .collection(USER_SETTINGS_STORENAME)
    .doc(settings.id)
    .set(settings);
  return settings;
};

const saveAppProfile = async (appProfile: AppProfileData) => {
  appProfile.last_modified = Date.now();
  await db.collection(APP_PROFILE_STORENAME).doc(appProfile.id).set(appProfile);
  return appProfile;
};

const UserRepository = {
  getUserSettings,
  getUserRole,
  getAppProfile,
  saveUserSettings,
  saveAppProfile,
};

export default UserRepository;
