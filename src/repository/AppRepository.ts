import { User } from '@firebase/auth-types';
import { FirebaseFirestore, Query } from '@firebase/firestore-types';
import { db } from 'src/firebase';
import { CompetencyData } from 'src/models/Competency';
import { ProjectData } from 'src/models/Project';
import WorkspaceRole, {
  WorkspaceRoleData,
  WORKSPACE_ROLE,
} from 'src/models/Role';
import { TaskData } from 'src/models/Task';
import UserSettings, { UserSettingsData } from 'src/models/UserSettings';
import Workspace, { WorkspaceData } from 'src/models/Workspace';

const USER_SETTINGS_STORENAME = 'user_settings';
const WORKSPACE_STORENAME = 'workspaces';
const PROJECTS_STORENAME = 'projects';
const TASKS_STORENAME = 'tasks';
const ROLES_STORENAME = 'roles';
const ROLES_MEMBERS_STORENAME = 'members';
const COMPETENCIES_STORENAME = 'competencies';

// USERS - GETTERS
const fetchUserSettings = async (user: User) => {
  const doc = await db.collection(USER_SETTINGS_STORENAME).doc(user.uid).get();
  let userSettings: UserSettings;
  if (doc.exists) {
    userSettings = UserSettings.deserialize(doc.data() as UserSettingsData);
  } else {
    userSettings = new UserSettings(user.uid);
    userSettings.email = user.email || '';
    userSettings.display_name = user.displayName || '';
    await saveUserSettings(userSettings);
  }

  return userSettings.serialize();
};

const fetchUserRole = async (workspaceId: string, userId: string) => {
  const doc = await db
    .collection(ROLES_STORENAME)
    .doc(workspaceId)
    .collection(ROLES_MEMBERS_STORENAME)
    .doc(userId)
    .get();
  return (doc.data() as WorkspaceRoleData).role;
};

// USERS - SETTERS
const saveUserSettings = async (settings: UserSettingsData) => {
  settings.last_modified = Date.now();
  await db.collection(USER_SETTINGS_STORENAME).doc(settings.id).set(settings);
  return settings;
};

// TASK - SETTERS
const saveTask = async (task: TaskData) => {
  task.last_modified = Date.now();
  await db.collection(TASKS_STORENAME).doc(task.id).set(task);
  return task;
};

const deleteTask = async (task: TaskData) => {
  task.last_modified = Date.now();
  await db.collection(TASKS_STORENAME).doc(task.id).delete();
  return task;
};

// WORKSPACES - CREATE

const createWorkspace = async (workspaceName: string, userId: string) => {
  const workspace = new Workspace(workspaceName);
  const workspaceData = await saveWorkspace(workspace.serialize());
  const role = new WorkspaceRole(
    workspaceData.id,
    userId,
    WORKSPACE_ROLE.ADMIN
  );
  await saveRole(role);
  return workspaceData;
};

// WORKSPACES - SETTERS

const updateWorkspaceName = async (
  workspace: WorkspaceData,
  newName: string
) => {
  workspace.name = newName;
  return await saveWorkspace(workspace);
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

const fetchWorkspace = async (workspaceId: string) => {
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

  await deleteQueryBatch(db, query, () => {
    console.log('successfully deleted all tasks');
  });

  query = db
    .collection(PROJECTS_STORENAME)
    .where('workspace_id', '==', workspace.id);

  await deleteQueryBatch(db, query, () => {
    console.log('successfully deleted all projects');
  });

  await db.collection(WORKSPACE_STORENAME).doc(workspace.id).delete();
  console.log('successfully deleted workspace. cleaning up roles');

  query = db
    .collection(ROLES_STORENAME)
    .doc(workspace.id)
    .collection(ROLES_MEMBERS_STORENAME);

  await deleteQueryBatch(db, query, () => {
    console.log('successfully deleted all roles in workspace');
  });
  await db.collection(ROLES_STORENAME).doc(workspace.id).delete();
  console.log('successfully deleted roles document');
};

const deleteQueryBatch = async (
  db: FirebaseFirestore,
  query: Query,
  resolve: () => unknown
) => {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  // TODO move this to backend api
  deleteQueryBatch(db, query, resolve).catch((err) => console.log(err));
};

// PROJECT - SETTERS
const saveProject = async (project: ProjectData) => {
  project.last_modified = Date.now();
  await db.collection(PROJECTS_STORENAME).doc(project.id).set(project);
  return project;
};

// PROJECT - DELETE
const deleteProject = async (project: ProjectData) => {
  const query = db
    .collection(TASKS_STORENAME)
    .where('workspace_id', '==', project.workspace_id)
    .where('project_id', '==', project.id);

  await deleteQueryBatch(db, query, async () => {
    console.log('successfully deleted all tasks. now deleting project');

    await db.collection(PROJECTS_STORENAME).doc(project.id).delete();
    return project;
  });
};

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

let workspaceCompetenciesObserver = () => {
  return;
};

function watchWorkspaceCompetencies(
  workspaceId: string,
  onCompetencyAdded: (competencyData: CompetencyData) => void,
  onCompetencyChanged: (competencyData: CompetencyData) => void,
  onCompetencyDeleted: (competencyData: CompetencyData) => void
) {
  console.log('watching projects');
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

        console.log('projects change.type:', change.type);
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

let projectTasksObserver = () => {
  return;
};

function watchProjectTasks(
  project: ProjectData,
  onTaskAdded: (taskData: TaskData) => void,
  onTaskChanged: (taskData: TaskData) => void,
  onTaskDeleted: (taskData: TaskData) => void
) {
  // unsubscribe
  projectTasksObserver();

  const query = db
    .collection(TASKS_STORENAME)
    .where('workspace_id', '==', project.workspace_id)
    .where('project_id', '==', project.id);
  console.log('watching tasks', project.id);
  projectTasksObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const taskData = change.doc.data() as TaskData;
        console.log('task change type:', change.type);
        if (change.type === 'added') {
          onTaskAdded(taskData);
        }
        if (change.type === 'modified') {
          onTaskChanged(taskData);
        }
        if (change.type === 'removed') {
          onTaskDeleted(taskData);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err.message}`);
    }
  );
}

const AppRepository = {
  user: {
    fetchUserSettings,
    fetchUserRole,
    saveUserSettings,
  },
  workspace: {
    fetchWorkspace,
    watchWorkspaceProjects,
    watchWorkspaceCompetencies,
    createWorkspace,
    updateWorkspaceName,
    deleteWorkspace,
  },
  project: {
    watchProjectTasks,
    saveProject,
    deleteProject,
  },
  task: {
    saveTask,
    deleteTask,
  },
};

export default AppRepository;
