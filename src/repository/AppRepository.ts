import WorkspaceRepository from './workspace/WorkspaceRepository';
import UserRepository from './user/UserRepository';
import ProjectRepository from './project/ProjectRepository';
import TaskRepository from './task/TaskRepository';

const AppRepository = {
  user: {
    ...UserRepository,
  },
  workspace: {
    ...WorkspaceRepository,
  },
  project: {
    ...ProjectRepository,
  },
  task: {
    ...TaskRepository,
  },
};

export default AppRepository;
