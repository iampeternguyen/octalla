import { nanoid } from 'nanoid';
import { db } from 'src/firebase';
import userStore from 'src/stores/user/userStore';
import DatabaseModel from './DatabaseModel';
import Folder, { FolderData } from './Folder';
import { PROJECTS_STORENAME } from './Project';
import { ROLES_MEMBERS_STORENAME, ROLES_STORENAME } from './Role';
import { TASKS_STORENAME } from './Task';

export const WORKSPACE_STORENAME = 'workspaces';

export interface WorkspaceData {
  created_at: number;
  id: string;
  last_modified: number;
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

  constructor(name: string, data?: WorkspaceData) {
    super();
    // for database model abstract class

    this.STORE_NAME = WORKSPACE_STORENAME;
    this.name = name;
    this.created_at = data?.created_at || Date.now();
    this.id = data?.id || nanoid(8);
    this.last_modified = data?.last_modified || Date.now();
    this.projects_structure = data?.projects_structure || [];
    this.created_by = data?.created_by || userStore.settings.value?.id || '';
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

  async delete() {
    let query = db
      .collection(TASKS_STORENAME)
      .where('workspace_id', '==', this.id);

    await this.deleteQueryBatch(db, query, () => {
      console.log('successfully deleted all tasks');
    });

    query = db
      .collection(PROJECTS_STORENAME)
      .where('workspace_id', '==', this.id);

    await this.deleteQueryBatch(db, query, () => {
      console.log('successfully deleted all projects');
    });

    await super.delete();

    query = db
      .collection(ROLES_STORENAME)
      .doc(this.id)
      .collection(ROLES_MEMBERS_STORENAME);

    await this.deleteQueryBatch(db, query, () => {
      console.log('successfully deleted all roles in workspace');
    });
    await db.collection(ROLES_STORENAME).doc(this.id).delete();
    console.log('successfully deleted roles document. now deleting workspace');
  }

  static deserialize(workspaceData: WorkspaceData): Workspace {
    return new Workspace(workspaceData.name, workspaceData);
  }
}
