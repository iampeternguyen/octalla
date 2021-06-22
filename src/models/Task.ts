import { uid } from 'quasar';
import Store from 'src/stores';
import DatabaseModel from './DatabaseModel';

export const TASKS_STORENAME = 'tasks';
export const TASKS_STATUS_OPTIONS = [
  'open',
  'in-progress',
  'review',
  'complete',
];

export interface TaskData {
  created_at: number;
  description: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  name: string;
  status: string;
  project_id: string;
  created_by: string;
}

export default class Task extends DatabaseModel implements TaskData {
  STORE_NAME: 'tasks';
  created_at: number;
  description: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  status: string;
  project_id: string;
  created_by: string;

  constructor(public name: string, data?: TaskData) {
    super();
    // for database model abstract class
    this.STORE_NAME = TASKS_STORENAME;
    this.created_at = data?.created_at || Date.now();
    this.description = data?.description || '';
    this.id = data?.id || uid();
    this.isComplete = data?.isComplete || false;
    this.last_modified = data?.last_modified || Date.now();
    this.project_id = data?.project_id || '1';
    this.created_by =
      data?.created_by || Store.getInstance().userState.value.user_id;
    this.status = data?.status || 'open';
  }

  async toggleComplete() {
    this.isComplete = !this.isComplete;
    if (this.isComplete) this.status = TASKS_STATUS_OPTIONS[3];
    await this.save();
  }

  async toggleStatus() {
    switch (this.status) {
      case TASKS_STATUS_OPTIONS[0]:
        this.status = TASKS_STATUS_OPTIONS[1];
        break;
      case TASKS_STATUS_OPTIONS[1]:
        this.status = TASKS_STATUS_OPTIONS[2];
        break;
      case TASKS_STATUS_OPTIONS[2]:
        this.status = TASKS_STATUS_OPTIONS[3];
        break;
      case TASKS_STATUS_OPTIONS[3]:
        this.status = TASKS_STATUS_OPTIONS[0];
        break;
      default:
        break;
    }
    this.status == TASKS_STATUS_OPTIONS[3]
      ? (this.isComplete = true)
      : (this.isComplete = false);
    await this.save();
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
      created_by: this.created_by,
      status: this.status,
    };
  }

  static deserialize(taskData: TaskData): Task {
    return new Task(taskData.name, taskData);
  }
}
