import DatabaseModel, { DatabaseModelData } from './DatabaseModel';

export enum WORKSPACE_ROLE {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}
export const ROLES_STORENAME = 'roles';
export const ROLES_MEMBERS_STORENAME = 'members';

export interface WorkspaceRoleData extends DatabaseModelData {
  role: WORKSPACE_ROLE;
  user_id: string;
  workspace_id: string;
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
