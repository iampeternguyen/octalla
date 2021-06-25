import { uid } from 'quasar';
import Store from 'src/stores';
import DatabaseModel from './DatabaseModel';

export const USER_SETTINGS_STORENAME = 'user_settings';

export interface UserSettingsData {
  created_at: number;
  id: string;
  last_modified: number;
  name: string;
  created_by: string;
  workspaces: string[];
}

export default class UserSettings
  extends DatabaseModel
  implements UserSettingsData
{
  id: string;
  STORE_NAME: 'user_settings';
  last_modified: number;
  created_at: number;
  name: string;
  created_by: string;
  workspaces: string[];

  constructor(name: string, data?: UserSettingsData) {
    super();
    // for database model abstract class
    this.STORE_NAME = USER_SETTINGS_STORENAME;
    this.name = name;
    this.created_at = data?.created_at || Date.now();
    this.id = data?.id || uid();
    this.last_modified = data?.last_modified || Date.now();
    this.created_by =
      data?.created_by || Store.getInstance().userState.value.user_id;
    this.workspaces = data?.workspaces || [];
  }

  serialize(): UserSettingsData {
    return {
      created_at: this.created_at,
      id: this.id,
      last_modified: this.last_modified,
      name: this.name,
      created_by: this.created_by,
      workspaces: this.workspaces,
    };
  }

  static deserialize(workspaceData: UserSettingsData): UserSettings {
    return new UserSettings(workspaceData.name, workspaceData);
  }
}
