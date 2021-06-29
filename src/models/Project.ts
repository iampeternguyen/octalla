import { nanoid } from 'nanoid';
import { db } from 'src/firebase';
import userStore from 'src/stores/user/userStore';
import DatabaseModel from './DatabaseModel';
import { TASKS_STORENAME } from './Task';

export const PROJECTS_STORENAME = 'projects';

export interface ProjectData {
  created_at: number;
  created_by: string;
  primary_goal: string;
  success_looks_like: string;
  workspace_id: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  name: string;
}

export default class Project extends DatabaseModel implements ProjectData {
  STORE_NAME: 'projects';

  created_at: number;
  created_by: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  name: string;
  primary_goal: string;
  success_looks_like: string;
  workspace_id: string;

  constructor(name: string, workspace_id: string, data?: ProjectData) {
    super();
    // for database model abstract class
    this.STORE_NAME = PROJECTS_STORENAME;

    this.name = name;
    this.workspace_id = workspace_id;
    this.created_at = data?.created_at || Date.now();
    this.primary_goal = data?.primary_goal || '';
    this.success_looks_like = data?.success_looks_like || '';
    this.id = data?.id || nanoid();

    this.isComplete = data?.isComplete || false;
    this.last_modified = data?.last_modified || Date.now();
    this.created_by = data?.created_by || userStore.settings.value?.id || '';
  }

  serialize(): ProjectData {
    return {
      created_at: this.created_at,
      created_by: this.created_by,
      id: this.id,
      isComplete: this.isComplete,
      last_modified: this.last_modified,
      name: this.name,
      primary_goal: this.primary_goal,
      success_looks_like: this.success_looks_like,
      workspace_id: this.workspace_id,
    };
  }

  async delete() {
    const query = db
      .collection(TASKS_STORENAME)
      .where('workspace_id', '==', this.workspace_id)
      .where('project_id', '==', this.id);
    await this.deleteQueryBatch(db, query, async () => {
      console.log('successfully deleted all tasks. now deleting project');
      await super.delete();
    });
  }
  static deserialize(projectData: ProjectData) {
    return new Project(projectData.name, projectData.workspace_id, projectData);
  }
}
