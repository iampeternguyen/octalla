import { nanoid } from 'nanoid';
import DatabaseModel, { DatabaseModelData } from './DatabaseModel';
import { FolderData } from './Folder';

export const WORKSPACE_STORENAME = 'workspaces';

export interface WorkspaceData extends DatabaseModelData {
  name: string;
  created_by: string;
  projects_structure: FolderData[];
}

export default class Workspace extends DatabaseModel implements WorkspaceData {
  STORE_NAME: 'workspaces';
  id: string;
  last_modified: number;
  created_at: number;
  name: string;
  projects_structure: FolderData[];
  created_by: string;

  constructor(name: string, userId: string, data?: WorkspaceData) {
    super();

    this.STORE_NAME = WORKSPACE_STORENAME;
    this.name = name;
    this.created_at = data?.created_at || Date.now();
    this.id = data?.id || nanoid(8);
    this.last_modified = data?.last_modified || Date.now();
    this.projects_structure = data?.projects_structure || [];
    this.created_by = userId;
  }

  serialize(): WorkspaceData {
    return {
      created_at: this.created_at,
      id: this.id,
      last_modified: this.last_modified,

      name: this.name,
      created_by: this.created_by,
      projects_structure: this.projects_structure,
    };
  }

  static deserialize(workspaceData: WorkspaceData): Workspace {
    return new Workspace(
      workspaceData.name,
      workspaceData.created_by,
      workspaceData
    );
  }
}
