import { uid } from 'quasar';
import { getDatabase } from 'src/idb';

const TASK_STORENAME = 'tasks';

export interface TaskData {
  id: string;
  name: string;
  isComplete: boolean;
}

export default class Task implements TaskData {
  id: string;
  name: string;
  isComplete: boolean;

  constructor(name: string, id?: string, isComplete?: boolean) {
    this.id = id || uid();
    this.name = name;
    this.isComplete = isComplete || false;
  }

  async toggleComplete() {
    this.isComplete = !this.isComplete;
    await this.save();
  }

  serialize(): TaskData {
    return { id: this.id, name: this.name, isComplete: this.isComplete };
  }

  async save() {
    try {
      const db = await getDatabase();
      await db.put(TASK_STORENAME, this.serialize(), this.id);
    } catch (error) {
      console.log('error saving Task: ', error);
    }
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
}
