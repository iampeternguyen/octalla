import { nanoid } from 'nanoid';
import { TASK_STATUS } from 'src/viewmodels/TaskViewModel';
import UserViewModel from 'src/viewmodels/UserViewModel';
import DatabaseModel from './DatabaseModel';

export const TASKS_STORENAME = 'tasks';

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
  status: string;

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
    this.status = data?.status || TASK_STATUS.OPEN;
    this.due_date = data?.due_date || 0;
    // TODO get order from task
    this.order = data?.order || 0;
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
