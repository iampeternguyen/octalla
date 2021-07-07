import { nanoid } from 'nanoid';
import { TASK_STATUS } from 'src/viewmodels/TaskViewModel';
import DatabaseModel, { DatabaseModelData } from './DatabaseModel';

export const TASKS_STORENAME = 'tasks';

export interface TaskData extends DatabaseModelData {
  workspace_id: string;
  project_id: string;
  created_by: string;
  name: string;

  fields: {
    competency: string;
    description: string;
    due_date: number;
    isComplete: boolean;
    order: number;
    status: string;
  };
}

export default class Task extends DatabaseModel implements TaskData {
  last_modified: number;
  created_at: number;
  STORE_NAME: 'tasks';

  id: string;
  workspace_id: string;
  project_id: string;
  created_by: string;
  name: string;

  fields: {
    competency: string;
    description: string;
    due_date: number;
    isComplete: boolean;
    order: number;
    status: string;
  };

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
    this.id = data?.id || nanoid();
    this.workspace_id = workspaceId;
    this.project_id = projectId;
    this.created_by = userId;
    this.created_at = data?.created_at || Date.now();
    this.last_modified = data?.last_modified || Date.now();
    this.name = name;
    this.fields = {
      description: data?.fields.description || '',
      isComplete: data?.fields.isComplete || false,
      competency: data?.fields.competency || '',
      status: data?.fields.status || TASK_STATUS.OPEN,
      due_date: data?.fields.due_date || 0,
      order: data?.fields.order || 0,
    };

    // TODO get order from task
  }

  changeStatus(status: string) {
    this.fields.status = status;
    status == TASK_STATUS.COMPLETE
      ? (this.fields.isComplete = true)
      : (this.fields.isComplete = false);
  }

  toggleComplete() {
    this.fields.isComplete = !this.fields.isComplete;
    if (this.fields.isComplete) {
      this.fields.status = TASK_STATUS.COMPLETE;
    } else if (this.fields.status == TASK_STATUS.COMPLETE) {
      this.fields.status = TASK_STATUS.OPEN;
    }
  }

  toggleStatus() {
    switch (this.fields.status) {
      case TASK_STATUS.OPEN:
        this.fields.status = TASK_STATUS.IN_PROGRESS;
        break;
      case TASK_STATUS.IN_PROGRESS:
        this.fields.status = TASK_STATUS.REVIEW;
        break;
      case TASK_STATUS.REVIEW:
        this.fields.status = TASK_STATUS.COMPLETE;
        break;
      case TASK_STATUS.COMPLETE:
        this.fields.status = TASK_STATUS.OPEN;
        break;
      default:
        break;
    }

    this.fields.status == TASK_STATUS.COMPLETE
      ? (this.fields.isComplete = true)
      : (this.fields.isComplete = false);
  }

  serialize(): TaskData {
    return {
      created_at: this.created_at,
      id: this.id,
      last_modified: this.last_modified,
      workspace_id: this.workspace_id,
      project_id: this.project_id,
      created_by: this.created_by,
      name: this.name,

      fields: {
        description: this.fields.description,
        isComplete: this.fields.isComplete,
        competency: this.fields.competency,
        status: this.fields.status,
        order: this.fields.order,
        due_date: this.fields.due_date,
      },
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
