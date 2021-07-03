import { db } from 'src/firebase';
import DatabaseModel from './DatabaseModel';

export enum WORKSPACE_ROLE {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}
export const ROLES_STORENAME = 'roles';
export const ROLES_MEMBERS_STORENAME = 'members';

export interface WorkspaceRoleData {
  id: string;
  role: WORKSPACE_ROLE;
  workspace_id: string;
  user_id: string;
  created_at: number;
  last_modified: number;
}

export default class WorkspaceRole
  extends DatabaseModel
  implements WorkspaceRoleData
{
  STORE_NAME: 'roles';
  id: string;
  last_modified: number;
  created_at: number;
  role: WORKSPACE_ROLE;
  user_id: string;
  workspace_id: string;

  constructor(
    workspace_id: string,
    user_id: string,
    role: WORKSPACE_ROLE,
    data?: WorkspaceRoleData
  ) {
    super();
    // for database model abstract class

    this.STORE_NAME = ROLES_STORENAME;

    this.created_at = data?.created_at || Date.now();
    this.workspace_id = workspace_id;
    this.id = user_id;
    this.last_modified = data?.last_modified || Date.now();
    this.role = role;
    this.user_id = user_id;
  }

  async save() {
    try {
      this.last_modified = Date.now();

      await db
        .collection(ROLES_STORENAME)
        .doc(this.workspace_id)
        .collection(ROLES_MEMBERS_STORENAME)
        .doc(this.user_id)
        .set(this.serialize());
    } catch (error) {
      console.log('error saving: ', error);
    }
  }

  async delete() {
    await db
      .collection(ROLES_STORENAME)
      .doc(this.workspace_id)
      .collection(ROLES_MEMBERS_STORENAME)
      .doc(this.user_id)
      .delete();
  }

  serialize(): WorkspaceRoleData {
    return {
      created_at: this.created_at,
      last_modified: this.last_modified,
      role: this.role,
      workspace_id: this.workspace_id,
      user_id: this.user_id,
      id: this.id,
    };
  }

  static deserialize(rolesData: WorkspaceRoleData): WorkspaceRole {
    return new WorkspaceRole(
      rolesData.id,
      rolesData.user_id,
      rolesData.role,
      rolesData
    );
  }
}
