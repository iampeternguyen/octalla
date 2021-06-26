import DatabaseModel from './DatabaseModel';

export const USER_SETTINGS_STORENAME = 'user_settings';

export interface UserSettingsData {
  created_at: number;
  id: string;
  last_modified: number;
  display_name: string;
  email: string;
  most_recent_workspace: string;
  most_recent_project: string;
}

export default class UserSettings
  extends DatabaseModel
  implements UserSettingsData
{
  id: string;
  STORE_NAME: 'user_settings';
  last_modified: number;
  created_at: number;
  display_name: string;
  email: string;
  most_recent_workspace: string;
  most_recent_project: string;

  constructor(id: string, data?: UserSettingsData) {
    super();
    // for database model abstract class
    this.STORE_NAME = USER_SETTINGS_STORENAME;
    this.display_name = data?.display_name || '';
    this.created_at = data?.created_at || Date.now();
    this.id = id;
    this.last_modified = data?.last_modified || Date.now();
    this.email = data?.email || '';
    this.most_recent_workspace = data?.most_recent_workspace || '';
    this.most_recent_project = data?.most_recent_project || '';
  }

  serialize(): UserSettingsData {
    return {
      created_at: this.created_at,
      id: this.id,
      last_modified: this.last_modified,
      display_name: this.display_name,
      email: this.email,
      most_recent_workspace: this.most_recent_workspace,
      most_recent_project: this.most_recent_project,
    };
  }

  static deserialize(userSettingsData: UserSettingsData): UserSettings {
    return new UserSettings(userSettingsData.id, userSettingsData);
  }
}
