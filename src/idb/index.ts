import { openDB, DBSchema } from 'idb';
import { ProjectData } from 'src/models/Project';
import { TaskData } from 'src/models/Task';

interface OctallaDB extends DBSchema {
  tasks: {
    key: string;
    value: TaskData;
  };
  projects: {
    key: string;
    value: ProjectData;
  };
}

export const getIDB = async () => {
  return await openDB<OctallaDB>('octalla-db', 1, {
    upgrade(db) {
      db.createObjectStore('tasks');
      db.createObjectStore('projects');
    },
  });
};
