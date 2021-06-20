import { uid } from 'quasar';
import { getDatabase } from 'src/idb';
import IDBModel from './IDBModel';

const TASK_STORENAME = 'tasks';

export interface TaskData {
  id: string;
  name: string;
  isComplete: boolean;
}

export default class Task extends IDBModel implements TaskData {
  STORE_NAME: 'tasks';

  id: string;
  name: string;
  isComplete: boolean;

  constructor(name: string, id?: string, isComplete?: boolean) {
    super();
    this.STORE_NAME = TASK_STORENAME;
    this.id = id || uid();
    this.name = name;
    this.isComplete = isComplete || false;
  }

  async toggleComplete() {
    this.isComplete = !this.isComplete;
    await this.save();
  }

  static async GetAll() {
    const tasks: Task[] = [];
    try {
      const db = await getDatabase();
      const taskData = await db.getAll(TASK_STORENAME);
      taskData.forEach((data) => {
        const task = new Task(data.name, data.id, data.isComplete);
        tasks.push(task);
      });
    } catch (error) {
      console.log('error getting all tasks');
    }
    return tasks;
  }

  serialize(): TaskData {
    return { id: this.id, name: this.name, isComplete: this.isComplete };
  }
}
