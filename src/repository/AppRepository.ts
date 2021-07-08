import WorkspaceRepository from './workspace/WorkspaceRepository';
import UserRepository from './user/UserRepository';
import ProjectRepository from './project/ProjectRepository';
import TaskRepository from './task/TaskRepository';
import ChatRepository from './chat/ChatRepository';

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
  chat: {
    ...ChatRepository,
  },
};

export default AppRepository;
