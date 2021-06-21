import { uid } from 'quasar';
import Store from 'src/stores';
import DatabaseModel from './DatabaseModel';

export const PROJECTS_STORENAME = 'projects';

export interface ProjectData {
  created_at: number;
  created_by: string;
  primary_goal: string;
  success_looks_like: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  name: string;
}

export default class Project extends DatabaseModel implements ProjectData {
  created_at: number;
  created_by: string;
  id: string;
  isComplete: boolean;
  last_modified: number;
  STORE_NAME: 'projects';
  primary_goal: string;
  success_looks_like: string;

  constructor(public name: string, data?: ProjectData) {
    super();
    // for database model abstract class
    this.STORE_NAME = PROJECTS_STORENAME;
    this.created_at = data?.created_at || Date.now();
    this.primary_goal = data?.primary_goal || '';
    this.success_looks_like = data?.success_looks_like || '';
    this.id = data?.id || uid();
    this.isComplete = data?.isComplete || false;
    this.last_modified = data?.last_modified || Date.now();
    this.created_by =
      data?.created_by || Store.getInstance().userState.value.user_id;
  }

  serialize(): ProjectData {
    return {
      created_at: this.created_at,
      success_looks_like: this.success_looks_like,
      id: this.id,
      isComplete: this.isComplete,
      last_modified: this.last_modified,
      name: this.name,
      primary_goal: this.primary_goal,
      created_by: this.created_by,
    };
  }
}
