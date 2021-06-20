import { openDB, DBSchema } from 'idb';
import { TaskData } from 'src/models/Task';

interface OctallaDB extends DBSchema {
  tasks: {
    key: string;
    value: TaskData;
  };
}

export const getIDB = async () => {
  return await openDB<OctallaDB>('octalla-db', 1, {
    upgrade(db) {
      db.createObjectStore('tasks');
    },
  });
};
