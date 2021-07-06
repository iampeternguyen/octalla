import DatabaseModel, { DatabaseModelData } from './DatabaseModel';

export const USER_SETTINGS_STORENAME = 'user_settings';

export interface UserSettingsData extends DatabaseModelData {
  most_recent_project: string;
  workspace_id: string;
}

export default class UserSettings
  extends DatabaseModel
  implements UserSettingsData
{
  id: string;
  last_modified: number;
  created_at: number;
  most_recent_project: string;
  workspace_id: string;

  constructor(userId: string, workspaceId: string, data?: UserSettingsData) {
    super();
    // for database model abstract class
    this.created_at = data?.created_at || Date.now();
    this.id = userId;
    this.workspace_id = workspaceId;
    this.last_modified = data?.last_modified || Date.now();
    this.most_recent_project = data?.most_recent_project || '';
  }

  serialize(): UserSettingsData {
    return {
      created_at: this.created_at,
      id: this.id,
      last_modified: this.last_modified,
      most_recent_project: this.most_recent_project,
      workspace_id: this.workspace_id,
    };
  }

  static deserialize(userSettingsData: UserSettingsData): UserSettings {
    return new UserSettings(
      userSettingsData.id,
      userSettingsData.workspace_id,
      userSettingsData
    );
  }
}
