import { nanoid } from 'nanoid';
import { db } from 'src/firebase';
import userStore from 'src/stores/user/userStore';
import DatabaseModel from './DatabaseModel';
import { PROJECTS_STORENAME } from './Project';

export const WORKSPACE_STORENAME = 'workspaces';

export interface WorkspaceData {
  created_at: number;
  id: string;
  last_modified: number;
  name: string;
  created_by: string;
}

export default class Workspace extends DatabaseModel implements WorkspaceData {
  STORE_NAME: 'workspaces';
  id: string;
  last_modified: number;
  created_at: number;
  name: string;
  created_by: string;

  constructor(name: string, data?: WorkspaceData) {
    super();
    // for database model abstract class

    this.STORE_NAME = WORKSPACE_STORENAME;
    this.name = name;
    this.created_at = data?.created_at || Date.now();
    this.id = data?.id || nanoid(8);
    this.last_modified = data?.last_modified || Date.now();
    this.created_by = data?.created_by || userStore.settings.value?.id || '';
  }

  serialize(): WorkspaceData {
    return {
      created_at: this.created_at,
      id: this.id,
      last_modified: this.last_modified,
      name: this.name,
      created_by: this.created_by,
    };
  }

  async delete() {
    const query = db
      .collection(PROJECTS_STORENAME)
      .where('workspace_id', '==', this.id);
    await this.deleteQueryBatch(db, query, async () => {
      console.log('successfully deleted all projects. now deleting workspace');
      await super.delete();
    });
  }

  static deserialize(workspaceData: WorkspaceData): Workspace {
    return new Workspace(workspaceData.name, workspaceData);
  }
}
