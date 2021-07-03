import { nanoid } from 'nanoid';
import UserViewModel from 'src/viewmodels/UserViewModel';
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
  due_date: number;
  name: string;
  status: string;
  project_id: string;
  competency: string;
  workspace_id: string;
  created_by: string;
  order: number;
}

export default class Task extends DatabaseModel implements TaskData {
  STORE_NAME: 'tasks';
  name: string;
  created_at: number;
  description: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  project_id: string;
  competency: string;
  due_date: number;
  workspace_id: string;
  created_by: string;
  order: number;

  private _status: string;

  constructor(
    name: string,
    projectId: string,
    workspaceId: string,
    data?: TaskData
  ) {
    super();
    // for database model abstract class
    this.STORE_NAME = TASKS_STORENAME;
    this.name = name;
    this.created_at = data?.created_at || Date.now();
    this.description = data?.description || '';
    this.id = data?.id || nanoid();
    this.isComplete = data?.isComplete || false;
    this.last_modified = data?.last_modified || Date.now();
    this.project_id = projectId;
    this.competency = data?.competency || '';
    this.workspace_id = workspaceId;
    // TODO refactor this to pass user not grab it from settings
    this.created_by =
      data?.created_by || UserViewModel.settings.value?.id || '';
    this._status = data?.status || 'open';
    this.due_date = data?.due_date || 0;
    // TODO get order from task
    this.order = data?.order || 0;
  }

  get status() {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
    value == TASKS_STATUS_OPTIONS[3]
      ? (this.isComplete = true)
      : (this.isComplete = false);
  }

  async toggleComplete() {
    this.isComplete = !this.isComplete;
    if (this.isComplete) this.status = TASKS_STATUS_OPTIONS[3];
    // TODO fix this
    // await this.save();
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
    // TODO FIX THIS
    // await this.save();
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
      workspace_id: this.workspace_id,
      competency: this.competency,
      status: this.status,
      order: this.order,
      due_date: this.due_date,
    };
  }

  static deserialize(taskData: TaskData): Task {
    return new Task(
      taskData.name,
      taskData.project_id,
      taskData.workspace_id,
      taskData
    );
  }
}
