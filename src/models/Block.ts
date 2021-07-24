import { nanoid } from 'nanoid';

export const BLOCKS_STORENAME = 'blocks';

export interface TaskBlockData {
  id: string;
  last_modified: number;
  created_at: number;
  workspace_id: string;
  created_by: string;
  type: string;

  title: string;
  content: string[];
  kanban_group: string | null;

  task: {
    competency: string;
    due_date: number;
    isComplete: boolean;
    order: number;
    assigned_to: string;
  } | null;
}

export default class TaskBlock implements TaskBlockData {
  id: string;
  last_modified: number;
  created_at: number;
  workspace_id: string;
  created_by: string;
  type: string;

  title: string;
  content: string[];
  kanban_group: string | null;

  task: {
    competency: string;
    due_date: number;
    isComplete: boolean;
    order: number;
    assigned_to: string;
  } | null;

  constructor(
    title: string,
    userId: string,
    workspaceId: string,
    data?: TaskBlockData
  ) {
    // for database model abstract class

    this.id = data?.id || nanoid();
    this.workspace_id = workspaceId;
    this.created_by = userId;
    this.created_at = data?.created_at || Date.now();
    this.last_modified = data?.last_modified || Date.now();
    this.type = 'task_block';

    this.title = title;
    this.content = [];
    this.kanban_group = null;

    this.task = data?.task || null;
  }

  //   changeStatus(status: string) {
  //     this.fields.status = status;
  //     status == TASK_STATUS.COMPLETE
  //       ? (this.fields.isComplete = true)
  //       : (this.fields.isComplete = false);
  //   }

  //   toggleComplete() {
  //     this.fields.isComplete = !this.fields.isComplete;
  //     if (this.fields.isComplete) {
  //       this.fields.status = TASK_STATUS.COMPLETE;
  //     } else if (this.fields.status == TASK_STATUS.COMPLETE) {
  //       this.fields.status = TASK_STATUS.OPEN;
  //     }
  //   }

  //   toggleStatus() {
  //     switch (this.fields.status) {
  //       case TASK_STATUS.OPEN:
  //         this.fields.status = TASK_STATUS.IN_PROGRESS;
  //         break;
  //       case TASK_STATUS.IN_PROGRESS:
  //         this.fields.status = TASK_STATUS.REVIEW;
  //         break;
  //       case TASK_STATUS.REVIEW:
  //         this.fields.status = TASK_STATUS.COMPLETE;
  //         break;
  //       case TASK_STATUS.COMPLETE:
  //         this.fields.status = TASK_STATUS.OPEN;
  //         break;
  //       default:
  //         break;
  //     }

  //     this.fields.status == TASK_STATUS.COMPLETE
  //       ? (this.fields.isComplete = true)
  //       : (this.fields.isComplete = false);
  //   }

  serialize(): TaskBlockData {
    return {
      id: this.id,
      last_modified: this.last_modified,
      created_at: this.created_at,
      workspace_id: this.workspace_id,
      created_by: this.created_by,
      type: this.type,

      title: this.title,
      content: this.content,
      kanban_group: this.kanban_group,

      task: this.task,
    };
  }

  static deserialize(taskBlockData: TaskBlockData): TaskBlock {
    return new TaskBlock(
      taskBlockData.title,
      taskBlockData.created_by,
      taskBlockData.workspace_id,
      taskBlockData
    );
  }
}
