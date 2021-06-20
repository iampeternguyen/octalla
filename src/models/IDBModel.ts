import { getDatabase } from 'src/idb';
import { TaskData } from './Task';

export default abstract class IDBModel {
  abstract STORE_NAME: 'tasks';
  abstract id: string;
  abstract serialize(): TaskData;

  async save() {
    try {
      const db = await getDatabase();
      await db.put(this.STORE_NAME, this.serialize(), this.id);
    } catch (error) {
      console.log('error saving Task: ', error);
    }
  }
}
