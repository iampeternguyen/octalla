import { openDB, DBSchema } from 'idb';
import { ProjectData } from 'src/models/Project';
import { TaskData } from 'src/models/Task';
import { UserSettingsData } from 'src/models/UserSettings';
import { WorkspaceData } from 'src/models/Workspace';

interface OctallaDB extends DBSchema {
  user_settings: {
    key: string;
    value: UserSettingsData;
  };
  tasks: {
    key: string;
    value: TaskData;
  };
  projects: {
    key: string;
    value: ProjectData;
  };
  workspaces: {
    key: string;
    value: WorkspaceData;
  };
}

export const getIDB = async () => {
  return await openDB<OctallaDB>('octalla-db', 1, {
    upgrade(db) {
      db.createObjectStore('tasks');
      db.createObjectStore('projects');
      db.createObjectStore('workspaces');
    },
  });
};
