import { db } from 'src/firebase';

export enum WORKSPACE_ROLE {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}
export const ROLES_STORENAME = 'roles';
export const ROLES_MEMBERS_STORENAME = 'members';

export interface WorkspaceRolesData {
  id: string;
  created_at: number;
  last_modified: number;
}

export interface WorkspaceRolesMemberData {
  id: string;
  role: WORKSPACE_ROLE;
}

export default class WorkspaceRoles implements WorkspaceRolesData {
  STORE_NAME: 'roles';
  id: string;
  last_modified: number;
  created_at: number;
  role: WORKSPACE_ROLE;
  user_id: string;

  constructor(workspace_id: string, user_id: string, role: WORKSPACE_ROLE) {
    // for database model abstract class

    this.STORE_NAME = ROLES_STORENAME;

    this.created_at = Date.now();
    this.id = workspace_id;
    this.last_modified = Date.now();
    this.role = role;
    this.user_id = user_id;
  }

  async save() {
    try {
      this.last_modified = Date.now();

      await db.collection(this.STORE_NAME).doc().set({
        id: this.id,
        created_at: this.created_at,
        last_modified: this.last_modified,
      });

      await db
        .collection(ROLES_STORENAME)
        .doc(this.id)
        .collection(ROLES_MEMBERS_STORENAME)
        .doc(this.user_id)
        .set({
          id: this.user_id,
          role: this.role,
        });
    } catch (error) {
      console.log('error saving: ', error);
    }
  }

  //   serialize(): WorkspaceRolesData {
  //     return {
  //       created_at: this.created_at,
  //       last_modified: this.last_modified,

  //       roles: this.roles,
  //       id: this.id,
  //     };
  //   }

  //   static deserialize(rolesData: WorkspaceRolesData): WorkspaceRoles {
  //     return new WorkspaceRoles(rolesData.id, rolesData.roles, rolesData);
  //   }
}
