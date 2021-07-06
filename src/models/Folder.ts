import { nanoid } from 'nanoid';
import { ProjectData } from './Project';

export interface FolderData {
  id: string;
  is_root: boolean;
  created_at: number;
  last_modified: number;
  type: 'folder' | 'project';

  name: string;
  children: Array<FolderData>;
}

export default class Folder implements FolderData {
  STORE_NAME: 'folders';
  id: string;
  type: 'folder' | 'project';
  created_at: number;
  last_modified: number;
  is_root: boolean;
  name: string;
  children: Array<FolderData>;

  constructor(name: string, type: 'folder' | 'project', data?: FolderData) {
    this.STORE_NAME = 'folders';
    this.id = data?.id || nanoid();
    this.created_at = data?.created_at || Date.now();
    this.last_modified = data?.last_modified || Date.now();
    this.name = data?.name || name;
    this.type = type;
    this.children = data?.children || [];
    this.is_root = data?.is_root || false;
  }

  static ConvertProjectToFolderData(project: ProjectData): FolderData {
    return {
      id: project.id,
      name: project.name,
      created_at: project.created_at,
      last_modified: project.last_modified,
      is_root: false,
      type: 'project',
      children: [],
    };
  }

  static deserialize(folder: FolderData) {
    return new Folder(folder.name, folder.type, folder);
  }
  serialize(): FolderData {
    return {
      id: this.id,
      created_at: this.created_at,
      last_modified: this.last_modified,
      name: this.name,
      children: this.children,
      is_root: this.is_root,
      type: this.type,
    };
  }
}
