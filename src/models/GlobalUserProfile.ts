import { User } from '@firebase/auth-types';
import DatabaseModel, { DatabaseModelData } from './DatabaseModel';

export const GLOBAL_USER_PROFILE_STORENAME = 'global_user_profiles';

// TODO refactor this for multiple spaces

export interface GlobalUserProfileData extends DatabaseModelData {
  display_name: string;
  email: string;
  most_recent_workspace: string;
  workspaces: string[];
}

export default class GlobalUserProfile
  extends DatabaseModel
  implements GlobalUserProfileData
{
  id: string;
  last_modified: number;
  created_at: number;
  display_name: string;
  email: string;
  most_recent_workspace: string;
  workspaces: string[];

  constructor(id: string, data?: GlobalUserProfileData) {
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
    const profile = new GlobalUserProfile(user.uid);
    profile.email = user.email || '';
    profile.display_name = user.displayName || '';
    return profile.serialize();
  }

  serialize(): GlobalUserProfileData {
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

  static deserialize(
    userSettingsData: GlobalUserProfileData
  ): GlobalUserProfile {
    return new GlobalUserProfile(userSettingsData.id, userSettingsData);
  }
}
