import { db } from 'src/firebase';
import { reactive, computed } from 'vue';
import Project, { ProjectData, PROJECTS_STORENAME } from 'src/models/Project';
import projectStore from '../project/projectStore';
import userStore from '../user/userStore';
import Workspace, {
  WorkspaceData,
  WORKSPACE_STORENAME,
} from 'src/models/Workspace';
import permissions from 'src/router/permissions';
import uiStore from '../ui/uiStore';
import eventsStore from '../events/eventsStore';
import Folder, { FolderData } from 'src/models/Folder';

const workspaceState = reactive({
  activeSpace: <Workspace | null>null,
  projects: [] as Project[],
});

// getters
const activeWorkspace = computed(() => workspaceState.activeSpace);
const projects = computed(() => workspaceState.projects);
const projectsStructure = computed(
  () => workspaceState.activeSpace?.projects_structure || []
);
const state = computed(() => workspaceState);

// create
async function createWorkspace(workspaceName: string) {
  if (!userStore.settings.value)
    throw 'onCreateWorkspace called when no user settings found';

  const workspace = new Workspace(workspaceName);
  await workspace.save();

  await eventsStore.workspace.afterWorkspaceCreate(workspace.id);

  await workspaceStore.setActiveWorkspace(workspace.id);

  return workspace.id;
}

// update

async function updateWorkspaceName(name: string) {
  if (!workspaceState.activeSpace || !permissions.workspace.canUpdate()) return;
  console.log('permission to update workspace');
  workspaceState.activeSpace.name = name;
  await workspaceState.activeSpace?.save();
}

async function deleteWorkspace() {
  if (!workspaceState.activeSpace || !permissions.workspace.canDelete()) return;

  console.log('permission to delete workspace');

  uiStore.updateLoadingMessage(
    `Deleting ${workspaceState.activeSpace.name}... DO NOT CLOSE THIS PAGE`
  );
  uiStore.showLoading();
  await workspaceState.activeSpace.delete();

  uiStore.hideLoading();

  const id = workspaceState.activeSpace.id;
  workspaceState.activeSpace = null;
  return id;
}

async function setActiveWorkspace(workspaceId: string) {
  if (workspaceState.activeSpace?.id == workspaceId) return;
  console.log('active workspace changed');
  const workspaceDoc = await db
    .collection(WORKSPACE_STORENAME)
    .doc(workspaceId)
    .get();
  workspaceState.activeSpace = Workspace.deserialize(
    workspaceDoc.data() as WorkspaceData
  );
  watchWorkspaceProjects();
  await eventsStore.workspace.afterWorkspaceSetActive();
}

let workspaceProjectsObserver = () => {
  return;
};

async function addProjectToWorkspace(project: Project) {
  await project.save();
  if (workspaceState.activeSpace) {
    workspaceState.activeSpace.projects_structure.push(
      Folder.ConvertProjectToFolderData(project)
    );
    await workspaceState.activeSpace.save();
  }
}

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
            projectStore
              .setActiveProject(
                projectStore.requestSetActiveProjectWithId.value
              )
              .catch((err) => console.log(err));
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
  projectsStructure,
  setActiveWorkspace,
  createWorkspace,
  updateWorkspaceName,
  deleteWorkspace,
  addProjectToWorkspace,
};

// TODO watch active workspace projects

export default workspaceStore;
