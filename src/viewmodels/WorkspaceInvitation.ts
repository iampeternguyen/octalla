import { WORKSPACE_ROLE } from 'src/models/Role';

export const INVITES_STORENAME = 'invites';

export interface WorkspaceInvitation {
  id: string;
  role: WORKSPACE_ROLE;
  workspace_id: string;
}
