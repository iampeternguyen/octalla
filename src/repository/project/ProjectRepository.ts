import { db } from 'src/firebase';
import { PROJECTS_STORENAME, ProjectData } from 'src/models/Project';
import { TaskData, TASKS_STORENAME } from 'src/models/Task';
import commonUtils from '../common';

// PROJECT - GETTERS
const getProject = async (projectId: string) => {
  const doc = await db.collection(PROJECTS_STORENAME).doc(projectId).get();
  return doc.data() as ProjectData;
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

  await commonUtils.deleteQueryBatch(db, query, async () => {
    console.log('successfully deleted all tasks. now deleting project');

    await db.collection(PROJECTS_STORENAME).doc(project.id).delete();
    return project;
  });
};

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

const ProjectRepository = {
  watchProjectTasks,
  saveProject,
  deleteProject,
  getProject,
};

export default ProjectRepository;
