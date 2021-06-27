import { db } from 'src/firebase';
import { reactive, computed } from 'vue';
import Project, { ProjectData, PROJECTS_STORENAME } from 'src/models/Project';
import projectStore from '../project';
import userStore from '../user';
import WorkspaceRoles, { WORKSPACE_ROLE } from 'src/models/Role';
import Workspace, {
  WorkspaceData,
  WORKSPACE_STORENAME,
} from 'src/models/Workspace';
import { userHasUpdateWorkspacePermission } from 'src/router/guards';

const workspaceState = reactive({
  activeSpace: <Workspace | null>null,
  projects: [] as Project[],
});

// getters
const activeWorkspace = computed(() => workspaceState.activeSpace);
const projects = computed(() => workspaceState.projects);
const state = computed(() => workspaceState);

// create
async function createWorkspace(workspaceName: string) {
  if (!userStore.settings.value)
    throw 'onCreateWorkspace called when no user settings found';

  const workspace = new Workspace(workspaceName);
  await workspace.save();

  const role = new WorkspaceRoles(
    workspace.id,
    userStore.settings.value.id,
    WORKSPACE_ROLE.ADMIN
  );
  await role.save();

  await workspaceStore.setActiveWorkspace(workspace.id);

  return workspace.id;
}

// update

async function updateWorkspaceName(name: string) {
  if (!workspaceState.activeSpace) return;
  if (userHasUpdateWorkspacePermission())
    console.log('permission to update workspace');
  workspaceState.activeSpace.name = name;
  await workspaceState.activeSpace?.save();
}
async function setActiveWorkspace(workspaceId: string) {
  if (workspaceState.activeSpace?.id == workspaceId) return;
  console.log('active workspace changed');
  await userStore.updateMostRecentWorkspace(workspaceId);
  const workspaceDoc = await db
    .collection(WORKSPACE_STORENAME)
    .doc(workspaceId)
    .get();
  workspaceState.activeSpace = Workspace.deserialize(
    workspaceDoc.data() as WorkspaceData
  );

  await userStore.onActiveWorkspaceChanged();
  watchWorkspaceProjects();
}

let workspaceProjectsObserver = () => {
  return;
};

function watchWorkspaceProjects() {
  console.log('watching projects');
  // unsubscribe
  workspaceProjectsObserver();
  clearWorkspaceProjects();

  const query = db
    .collection(PROJECTS_STORENAME)
    .where('workspace_id', '==', activeWorkspace.value?.id);

  workspaceProjectsObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const projectData = change.doc.data() as ProjectData;
        const project = Project.deserialize(projectData);

        console.log('projects change.type:', change.type);
        if (change.type === 'added') {
          addWorkspaceProject(project);
          if (project.id == projectStore.requestSetActiveProjectWithId.value) {
            projectStore.setActiveProject(
              projectStore.requestSetActiveProjectWithId.value
            );
          }
        }
        if (change.type === 'modified') {
          updateWorkspaceProject(project);
        }
        if (change.type === 'removed') {
          removeWorkspaceProject(project);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err.message}`);
    }
  );
}

// workspace project methods

function clearWorkspaceProjects() {
  workspaceState.projects.splice(0, workspaceState.projects.length);
}

function updateWorkspaceProject(project: Project) {
  const index = workspaceState.projects.findIndex((t) => t.id == project.id);
  workspaceState.projects.splice(index, 1, project);
}

function removeWorkspaceProject(project: Project) {
  const index = workspaceState.projects.findIndex((t) => t.id == project.id);
  workspaceState.projects.splice(index, 1);
}

function addWorkspaceProject(project: Project) {
  workspaceState.projects.push(project);
}

const workspaceStore = {
  activeWorkspace,
  projects,
  state,
  setActiveWorkspace,
  createWorkspace,
  updateWorkspaceName,
};

// TODO watch active workspace projects

export default workspaceStore;
