import { uid } from 'quasar';
import { getIDB } from 'src/idb';
import DatabaseModel from './DatabaseModel';

const TASK_STORENAME = 'tasks';

export interface TaskData {
  id: string;
  name: string;
  isComplete: boolean;
}

export default class Task extends DatabaseModel implements TaskData {
  STORE_NAME: 'tasks';
  id: string;
  isComplete: boolean;

  constructor(public name: string, data?: TaskData) {
    super();
    // for database model abstract class
    this.STORE_NAME = TASK_STORENAME;
    this.id = data?.id || uid();
    this.isComplete = data?.isComplete || false;
  }

  async toggleComplete() {
    this.isComplete = !this.isComplete;
    await this.save();
  }

  static async GetAll() {
    const tasks: Task[] = [];
    try {
      const db = await getIDB();
      const taskData = await db.getAll(TASK_STORENAME);
      taskData.forEach((data) => {
        const task = Task.Deserialize(data);
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

  static Deserialize(taskData: TaskData): Task {
    return new Task(taskData.name, taskData);
  }
}
