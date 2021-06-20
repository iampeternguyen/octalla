import { uid } from 'quasar';
import { getIDB } from 'src/idb';
import Store from 'src/stores';
import DatabaseModel from './DatabaseModel';

export const TASK_STORENAME = 'tasks';

export interface TaskData {
  created_at: number;
  description: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  name: string;
  project_id: string;
  user_id: string;
}

export default class Task extends DatabaseModel implements TaskData {
  STORE_NAME: 'tasks';
  created_at: number;
  description: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  project_id: string;
  user_id: string;

  constructor(public name: string, data?: TaskData) {
    super();
    // for database model abstract class
    this.STORE_NAME = TASK_STORENAME;
    this.created_at = data?.created_at || Date.now();
    this.description = data?.description || '';
    this.id = data?.id || uid();
    this.isComplete = data?.isComplete || false;
    this.last_modified = data?.last_modified || Date.now();
    this.project_id = data?.project_id || '1';
    this.user_id = data?.user_id || Store.getInstance().userState.value.user_id;
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
    return {
      created_at: this.created_at,
      description: this.description,
      id: this.id,
      isComplete: this.isComplete,
      last_modified: this.last_modified,
      name: this.name,
      project_id: this.project_id,
      user_id: this.user_id,
    };
  }

  static Deserialize(taskData: TaskData): Task {
    return new Task(taskData.name, taskData);
  }
}
