import { nanoid } from 'nanoid';
import { TASK_STATUS } from 'src/viewmodels/TaskViewModel';
import DatabaseModel, { DatabaseModelData } from './DatabaseModel';

export const TASKS_STORENAME = 'tasks';

export interface TaskData extends DatabaseModelData {
  competency: string;
  created_by: string;
  description: string;
  due_date: number;
  isComplete: boolean;
  name: string;
  order: number;
  project_id: string;
  status: string;
  workspace_id: string;
}

export default class Task extends DatabaseModel implements TaskData {
  STORE_NAME: 'tasks';
  competency: string;
  created_at: number;
  created_by: string;
  description: string;
  due_date: number;
  id: string;
  isComplete: boolean;
  last_modified: number;
  name: string;
  order: number;
  project_id: string;
  status: string;
  workspace_id: string;

  constructor(
    name: string,
    userId: string,
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
    this.created_by = userId;
    this.status = data?.status || TASK_STATUS.OPEN;
    this.due_date = data?.due_date || 0;
    // TODO get order from task
    this.order = data?.order || 0;
  }

  changeStatus(status: string) {
    this.status = status;
    status == TASK_STATUS.COMPLETE
      ? (this.isComplete = true)
      : (this.isComplete = false);
  }

  toggleComplete() {
    this.isComplete = !this.isComplete;
    if (this.isComplete) {
      this.status = TASK_STATUS.COMPLETE;
    } else if (this.status == TASK_STATUS.COMPLETE) {
      this.status = TASK_STATUS.OPEN;
    }
  }

  toggleStatus() {
    switch (this.status) {
      case TASK_STATUS.OPEN:
        this.status = TASK_STATUS.IN_PROGRESS;
        break;
      case TASK_STATUS.IN_PROGRESS:
        this.status = TASK_STATUS.REVIEW;
        break;
      case TASK_STATUS.REVIEW:
        this.status = TASK_STATUS.COMPLETE;
        break;
      case TASK_STATUS.COMPLETE:
        this.status = TASK_STATUS.OPEN;
        break;
      default:
        break;
    }

    this.status == TASK_STATUS.COMPLETE
      ? (this.isComplete = true)
      : (this.isComplete = false);
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
      taskData.created_by,
      taskData.project_id,
      taskData.workspace_id,
      taskData
    );
  }
}
