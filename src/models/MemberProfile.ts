import DatabaseModel, { DatabaseModelData } from './DatabaseModel';
import { GlobalUserProfileData } from './GlobalUserProfile';

export enum WORKSPACE_ROLE {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}
export const WORKSPACE_MEMBERS_STORENAME = 'members_profiles';

export interface WorkspaceMembersContainer {
  members: MemberProfileData[];
}

export interface MemberProfileData extends DatabaseModelData {
  role: WORKSPACE_ROLE;
  user_id: string;
  workspace_id: string;
  display_name: string;
  email: string;
}
export default class MemberProfile
  extends DatabaseModel
  implements MemberProfileData
{
  id: string;
  last_modified: number;
  created_at: number;
  role: WORKSPACE_ROLE;
  user_id: string;
  workspace_id: string;
  display_name: string;
  email: string;

  constructor(
    workspace_id: string,
    user_id: string,
    role: WORKSPACE_ROLE,
    data?: MemberProfileData
  ) {
    super();
    this.created_at = data?.created_at || Date.now();
    this.workspace_id = workspace_id;
    this.id = user_id;
    this.last_modified = data?.last_modified || Date.now();
    this.role = role;
    this.user_id = user_id;
    this.display_name = data?.display_name || '';
    this.email = data?.email || '';
  }

  serialize(): MemberProfileData {
    return {
      created_at: this.created_at,
      last_modified: this.last_modified,
      role: this.role,
      workspace_id: this.workspace_id,
      user_id: this.user_id,
      id: this.id,
      email: this.email,
      display_name: this.display_name,
    };
  }
  static convertGlobalUserProfileToMemberProfileData(
    workspaceId: string,
    user: GlobalUserProfileData,
    role: WORKSPACE_ROLE
  ) {
    const profile = new MemberProfile(workspaceId, user.id, role);
    profile.workspace_id = workspaceId;
    profile.role = role;
    profile.user_id = user.id;
    profile.display_name = user.display_name || '';
    profile.email = user.email || '';
    return profile.serialize();
  }
  static deserialize(rolesData: MemberProfileData): MemberProfile {
    return new MemberProfile(
      rolesData.id,
      rolesData.user_id,
      rolesData.role,
      rolesData
    );
  }
}
