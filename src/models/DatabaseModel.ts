// import { getIDB } from 'src/idb';
import { TaskData } from './Task';
import { ProjectData } from './Project';
import { WorkspaceData } from './Workspace';
import { UserSettingsData } from './UserSettings';
import { CompetencyData } from './Competency';
import { WorkspaceRoleData } from './Role';
import { AppProfileData } from './AppProfile';
import { WorkspaceMemberData } from './MemberProfile';

export interface DatabaseModelData {
  id: string;
  last_modified: number;
  created_at: number;
}

export default abstract class DatabaseModel implements DatabaseModelData {
  abstract id: string;
  abstract last_modified: number;
  abstract created_at: number;

  abstract serialize():
    | TaskData
    | ProjectData
    | WorkspaceData
    | UserSettingsData
    | WorkspaceRoleData
    | CompetencyData
    | AppProfileData
    | WorkspaceMemberData;
}
