import { User } from '@firebase/auth-types';
import DatabaseModel, { DatabaseModelData } from './DatabaseModel';

export const APP_PROFILE_STORENAME = 'app_profiles';

// TODO refactor this for multiple spaces

export interface AppProfileData extends DatabaseModelData {
  display_name: string;
  email: string;
  most_recent_workspace: string;
  workspaces: string[];
}

export default class AppProfile
  extends DatabaseModel
  implements AppProfileData
{
  id: string;
  last_modified: number;
  created_at: number;
  display_name: string;
  email: string;
  most_recent_workspace: string;
  workspaces: string[];

  constructor(id: string, data?: AppProfileData) {
    super();
    this.display_name = data?.display_name || '';
    this.created_at = data?.created_at || Date.now();
    this.id = id;
    this.last_modified = data?.last_modified || Date.now();
    this.email = data?.email || '';
    this.most_recent_workspace = data?.most_recent_workspace || '';
    this.workspaces = data?.workspaces || [];
  }

  static convertFirebaseUserToGlobalUserProfileData(user: User) {
    const profile = new AppProfile(user.uid);
    profile.email = user.email || '';
    profile.display_name = user.displayName || '';
    return profile.serialize();
  }

  serialize(): AppProfileData {
    return {
      created_at: this.created_at,
      id: this.id,
      last_modified: this.last_modified,
      display_name: this.display_name,
      email: this.email,
      most_recent_workspace: this.most_recent_workspace,
      workspaces: this.workspaces,
    };
  }

  static deserialize(userSettingsData: AppProfileData): AppProfile {
    return new AppProfile(userSettingsData.id, userSettingsData);
  }
}
