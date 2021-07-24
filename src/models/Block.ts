import { nanoid } from 'nanoid';

export const BLOCKS_STORENAME = 'blocks';
export enum BLOCK_TYPES {
  TASK_BLOCK = 'TASK_BLOCK',
  TASK_LIST_BLOCK = 'TASK_LIST_BLOCK',
}
export interface BlockData {
  id: string;
  last_modified: number;
  created_at: number;
  workspace_id: string;
  created_by: string;
  type: BLOCK_TYPES;

  title: string;
  content: string[];

  task: {
    status: string;

    competency: string;
    due_date: number;
    isComplete: boolean;
    order: number;
    assigned_to: string;
  } | null;
}

export default class Block implements BlockData {
  id: string;
  last_modified: number;
  created_at: number;
  workspace_id: string;
  created_by: string;
  type: BLOCK_TYPES;

  title: string;
  content: string[];

  task: {
    status: string;

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
    type: BLOCK_TYPES,
    data?: BlockData
  ) {
    // for database model abstract class

    this.id = data?.id || nanoid();
    this.workspace_id = workspaceId;
    this.created_by = userId;
    this.created_at = data?.created_at || Date.now();
    this.last_modified = data?.last_modified || Date.now();
    this.type = type;

    this.title = title;
    this.content = [];

    this.task = data?.task || null;
  }

  convertToTask() {
    this.type = BLOCK_TYPES.TASK_BLOCK;
    if (!this.task) {
      this.task = {
        status: '',
        competency: '',
        due_date: 0,
        isComplete: false,
        order: 0,
        assigned_to: '',
      };
    }
  }

  //   changeStatus(status: string) {
  //     this.fields.status = status;
  //     status == TASK_STATUS.COMPLETE
  //       ? (this.fields.isComplete = true)
  //       : (this.fields.isComplete = false);
  //   }

  toggleComplete() {
    if (this.task) {
      this.task.isComplete = !this.task.isComplete;
    }
  }

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

  serialize(): BlockData {
    return {
      id: this.id,
      last_modified: this.last_modified,
      created_at: this.created_at,
      workspace_id: this.workspace_id,
      created_by: this.created_by,
      type: this.type,

      title: this.title,
      content: this.content,

      task: this.task,
    };
  }

  static deserialize(taskBlockData: BlockData): Block {
    return new Block(
      taskBlockData.title,
      taskBlockData.created_by,
      taskBlockData.workspace_id,
      taskBlockData.type,
      taskBlockData
    );
  }
}
