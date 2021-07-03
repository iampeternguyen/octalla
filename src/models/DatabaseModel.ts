// import { getIDB } from 'src/idb';
import { TaskData } from './Task';
import { ProjectData } from './Project';
import { WorkspaceData } from './Workspace';
import { UserSettingsData } from './UserSettings';
import { CompetencyData } from './Competency';
import { WorkspaceRoleData } from './Role';

export default abstract class DatabaseModel {
  abstract STORE_NAME:
    | 'tasks'
    | 'projects'
    | 'workspaces'
    | 'user_settings'
    | 'roles'
    | 'competencies';

  abstract id: string;
  abstract last_modified: number;
  abstract serialize():
    | TaskData
    | ProjectData
    | WorkspaceData
    | UserSettingsData
    | WorkspaceRoleData
    | CompetencyData;
}
