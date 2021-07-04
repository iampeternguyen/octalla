import { nanoid } from 'nanoid';
import { db } from 'src/firebase';
import DatabaseModel, { DatabaseModelData } from './DatabaseModel';

export const COMPETENCIES_STORENAME = 'competencies';

export interface CompetencyData extends DatabaseModelData {
  created_by: string;
  name: string;
  description: string;
  workspace_id: string;
}

export default class Competency
  extends DatabaseModel
  implements CompetencyData
{
  STORE_NAME: 'competencies';
  created_at: number;
  created_by: string;
  id: string;
  last_modified: number;
  name: string;
  description: string;
  workspace_id: string;

  constructor(
    name: string,
    userId: string,
    workspace_id: string,
    data?: CompetencyData
  ) {
    super();
    // for database model abstract class
    this.STORE_NAME = COMPETENCIES_STORENAME;

    this.name = name;
    this.workspace_id = workspace_id;
    this.created_at = data?.created_at || Date.now();
    this.description = data?.description || '';
    this.id = data?.id || nanoid();
    this.last_modified = data?.last_modified || Date.now();
    this.created_by = userId;
  }

  serialize(): CompetencyData {
    return {
      created_at: this.created_at,
      created_by: this.created_by,
      id: this.id,
      last_modified: this.last_modified,
      name: this.name,
      workspace_id: this.workspace_id,
      description: this.description,
    };
  }

  async save() {
    try {
      this.last_modified = Date.now();

      await db
        .collection(COMPETENCIES_STORENAME)
        .doc(this.workspace_id)
        .collection(COMPETENCIES_STORENAME)
        .doc(this.id)
        .set(this.serialize());
    } catch (error) {
      console.log('error saving: ', error);
    }
  }

  async delete() {
    try {
      console.log('deleting', this.workspace_id, this.id);
      await db
        .collection(COMPETENCIES_STORENAME)
        .doc(this.workspace_id)
        .collection(COMPETENCIES_STORENAME)
        .doc(this.id)
        .delete();
    } catch (error) {
      console.log(error);
    }
  }

  static deserialize(competencyData: CompetencyData) {
    return new Competency(
      competencyData.name,
      competencyData.created_by,
      competencyData.workspace_id,
      competencyData
    );
  }
}
