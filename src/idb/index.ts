import { openDB, DBSchema } from 'idb';
import Task from 'src/models/Task';

interface OctallaDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
  };
}

export const getDatabase = async () => {
  return await openDB<OctallaDB>('octalla-db', 1, {
    upgrade(db) {
      db.createObjectStore('tasks');
    },
  });
};
