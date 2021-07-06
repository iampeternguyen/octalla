import { db } from 'src/firebase';
import { AppProfileData } from 'src/models/AppProfile';
import { COMPETENCIES_STORENAME, CompetencyData } from 'src/models/Competency';
import WorkspaceMember, {
  WorkspaceMemberData,
  WorkspaceMembersContainer,
  WORKSPACE_MEMBERS_STORENAME,
  WORKSPACE_ROLE,
} from 'src/models/MemberProfile';
import { ProjectData, PROJECTS_STORENAME } from 'src/models/Project';
import WorkspaceRole, {
  ROLES_STORENAME,
  ROLES_MEMBERS_STORENAME,
} from 'src/models/Role';
import { TASKS_STORENAME } from 'src/models/Task';
import Workspace, {
  WorkspaceData,
  WORKSPACE_STORENAME,
} from 'src/models/Workspace';
import {
  INVITES_STORENAME,
  WorkspaceInvitation,
} from 'src/viewmodels/WorkspaceInvitation';
import commonUtils from '../common';

const createWorkspace = async (workspaceName: string, user: AppProfileData) => {
  const workspace = new Workspace(workspaceName, user.id);
  const workspaceData = await saveWorkspace(workspace.serialize());
  await addMemberProfileToWorkspace(workspace.id, user, WORKSPACE_ROLE.ADMIN);
  // This affects firebase backend CRUD permissions
  await addUserRoleForWorkspacePermissions(
    workspaceData.id,
    user.id,
    WORKSPACE_ROLE.ADMIN
  );

  return workspaceData;
};

const addUserToWorkspace = async (
  user: AppProfileData,
  invite: WorkspaceInvitation
) => {
  await addMemberProfileToWorkspace(invite.workspace_id, user, invite.role);
  await addUserRoleForWorkspacePermissions(
    invite.workspace_id,
    user.id,
    invite.role
  );
};

type NewType = WORKSPACE_ROLE;

const addMemberProfileToWorkspace = async (
  workspaceId: string,
  user: AppProfileData,
  role: NewType
) => {
  const memberProfile =
    WorkspaceMember.convertGlobalUserProfileToMemberProfileData(
      workspaceId,
      user,
      role
    );
  await saveMemberProfile(memberProfile);
};

const saveMemberProfile = async (profile: WorkspaceMemberData) => {
  const doc = await db
    .collection(WORKSPACE_MEMBERS_STORENAME)
    .doc(profile.workspace_id)
    .get();
  if (!doc.exists) {
    const data = { members: [profile] };
    console.log(data);

    await db
      .collection(WORKSPACE_MEMBERS_STORENAME)
      .doc(profile.workspace_id)
      .set(data);
  } else {
    const data = doc.data() as WorkspaceMembersContainer;
    data.members.push(profile);
    await db
      .collection(WORKSPACE_MEMBERS_STORENAME)
      .doc(profile.workspace_id)
      .set(data);
  }
};

const addUserRoleForWorkspacePermissions = async (
  workspaceId: string,
  userId: string,
  role: WORKSPACE_ROLE
) => {
  const newRole = new WorkspaceRole(workspaceId, userId, role);
  await saveRole(newRole);
};

const createWorkspaceInvitation = async (invite: {
  id: string;
  role: WORKSPACE_ROLE;
  workspace_id: string;
}) => {
  await db.collection(INVITES_STORENAME).doc(invite.id).set(invite);
};

// TODO validation
const getWorkspaceInvite = async (token: string) => {
  const doc = await db.collection(INVITES_STORENAME).doc(token).get();
  const data = doc.data() as {
    id: string;
    role: WORKSPACE_ROLE;
    workspace_id: string;
  };
  return data;
};

const deleteWorkspaceInvite = async (token: string) => {
  await db.collection(INVITES_STORENAME).doc(token).delete();
};

const saveRole = async (role: WorkspaceRole) => {
  try {
    const data = role.serialize();

    data.last_modified = Date.now();

    await db
      .collection(ROLES_STORENAME)
      .doc(data.workspace_id)
      .collection(ROLES_MEMBERS_STORENAME)
      .doc(data.user_id)
      .set(data);
  } catch (error) {
    console.log('error saving: ', error);
  }
};

const getWorkspace = async (workspaceId: string) => {
  const doc = await db.collection(WORKSPACE_STORENAME).doc(workspaceId).get();
  return doc.data() as WorkspaceData;
};

const saveWorkspace = async (workspace: WorkspaceData) => {
  // TODO can't save record format in Task sort by
  // const idb = await getIDB();
  // await idb.put(this.STORE_NAME, data, this.id);
  workspace.last_modified = Date.now();
  await db.collection(WORKSPACE_STORENAME).doc(workspace.id).set(workspace);
  return workspace;
};

// DELETE WORKSPACE

const deleteWorkspace = async (workspace: WorkspaceData) => {
  // stop watching projects
  workspaceProjectsObserver();

  let query = db
    .collection(TASKS_STORENAME)
    .where('workspace_id', '==', workspace.id);

  await commonUtils.deleteQueryBatch(db, query, () => {
    console.log('successfully deleted all tasks');
  });

  query = db
    .collection(PROJECTS_STORENAME)
    .where('workspace_id', '==', workspace.id);

  await commonUtils.deleteQueryBatch(db, query, () => {
    console.log('successfully deleted all projects');
  });

  await db.collection(WORKSPACE_STORENAME).doc(workspace.id).delete();
  console.log('successfully deleted workspace. cleaning up roles');

  query = db
    .collection(ROLES_STORENAME)
    .doc(workspace.id)
    .collection(ROLES_MEMBERS_STORENAME);

  await commonUtils.deleteQueryBatch(db, query, () => {
    console.log('successfully deleted all roles in workspace');
  });
  await db.collection(ROLES_STORENAME).doc(workspace.id).delete();
  console.log('successfully deleted roles document');
};

let workspaceCompetenciesObserver = () => {
  return;
};

function watchWorkspaceCompetencies(
  workspaceId: string,
  onCompetencyAdded: (competencyData: CompetencyData) => void,
  onCompetencyChanged: (competencyData: CompetencyData) => void,
  onCompetencyDeleted: (competencyData: CompetencyData) => void
) {
  console.log('watching projects competencies');
  // unsubscribe
  workspaceCompetenciesObserver();
  //   TODO move to ViewModel
  //   clearWorkspaceProjects();

  const query = db
    .collection(COMPETENCIES_STORENAME)
    .doc(workspaceId)
    .collection(COMPETENCIES_STORENAME);

  workspaceCompetenciesObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const competencyData = change.doc.data() as CompetencyData;

        console.log('competencies change.type:', change.type);
        if (change.type === 'added') {
          onCompetencyAdded(competencyData);
        }
        if (change.type === 'modified') {
          onCompetencyChanged(competencyData);
        }
        if (change.type === 'removed') {
          onCompetencyDeleted(competencyData);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err.message}`);
    }
  );
}

// Observers
let workspaceProjectsObserver = () => {
  return;
};

function watchWorkspaceProjects(
  workspaceId: string,
  onProjectAdded: (projectData: ProjectData) => void,
  onProjectChanged: (projectData: ProjectData) => void,
  onProjectDeleted: (projectData: ProjectData) => void
) {
  console.log('watching projects');
  // unsubscribe
  workspaceProjectsObserver();
  //   TODO move to ViewModel
  //   clearWorkspaceProjects();

  const query = db
    .collection(PROJECTS_STORENAME)
    .where('workspace_id', '==', workspaceId);

  workspaceProjectsObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const projectData = change.doc.data() as ProjectData;

        console.log('projects change.type:', change.type);
        if (change.type === 'added') {
          onProjectAdded(projectData);
        }
        if (change.type === 'modified') {
          onProjectChanged(projectData);
        }
        if (change.type === 'removed') {
          onProjectDeleted(projectData);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err.message}`);
    }
  );
}

const WorkspaceRepository = {
  getWorkspace,
  watchWorkspaceProjects,
  watchWorkspaceCompetencies,
  createWorkspace,
  saveWorkspace,
  deleteWorkspace,

  addUserToWorkspace,

  createWorkspaceInvitation,
  getWorkspaceInvite,
  deleteWorkspaceInvite,
};

export default WorkspaceRepository;
