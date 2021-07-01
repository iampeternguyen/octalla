import userStore from '../user/userStore';
import workspaceStore from '../workspace/workspaceStore';
import Project from 'src/models/Project';
import projectStore from '../project/projectStore';
import permissions from 'src/router/permissions';
async function onWorkspaceDelete() {
  console.log('Workspace is about to be deleted');
  const id = await workspaceStore.deleteWorkspace();
  if (!id) throw 'error deleting workspace';
  await userStore.removeWorkspaceFromSettings(id);
}

async function afterWorkspaceCreate(workspaceId: string) {
  console.log('new workspace created', workspaceId);
  await userStore.assignRoleAndAddWorkspace(workspaceId);
}

async function afterWorkspaceSetActive() {
  console.log('Active workspace has been set');
  if (!workspaceStore.activeWorkspace.value)
    throw "workspace wasn't set to active";

  workspaceStore.watchWorkspaceCompetencies();

  await userStore.setUserRole();
  if (permissions.workspace.canRead())
    await userStore.updateMostRecentWorkspace(
      workspaceStore.activeWorkspace.value.id
    );
}

async function afterProjectSetActive(project: Project) {
  console.log('Active project has been set');
  if (permissions.project.canCRU(project))
    await userStore.updateMostRecentProject(project);
}

async function onProjectDelete(project: Project) {
  console.log('Project is about to be deleted');
  const id = project.id;
  await projectStore.deleteProject(project);
  await userStore.removeProjectIfMostRecent(id);
}

async function onProjectAdded(unsavedProject: Project) {
  console.log('Adding project to workspace');
  // workspaceStore is already watching for new projects
  await workspaceStore.addProjectToWorkspace(unsavedProject);
}

async function onProjectsGroupBy(field: string) {
  await projectStore.projectGroupBy(field);
}

const eventsStore = {
  workspace: {
    afterWorkspaceCreate,
    onWorkspaceDelete,
    afterWorkspaceSetActive,
  },
  project: {
    afterProjectSetActive,
    onProjectDelete,
    onProjectAdded,
    onProjectsGroupBy,
  },
};

export default eventsStore;
