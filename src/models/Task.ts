import { uid } from 'quasar';
import { getDatabase } from 'src/idb';

const TASK_STORENAME = 'tasks';

export default class Task {
  name: string;
  id: string;

  constructor(name: string) {
    this.id = uid();
    this.name = name;
  }

  async save() {
    try {
      const db = await getDatabase();
      await db.put(TASK_STORENAME, this, this.id);
    } catch (error) {
      console.log('error saving Task');
    }
  }
  static async GetAll() {
    let tasks: Task[] = [];
    try {
      const db = await getDatabase();
      tasks = await db.getAll(TASK_STORENAME);
    } catch (error) {
      console.log('error getting all tasks');
    }
    return tasks;
  }
}
