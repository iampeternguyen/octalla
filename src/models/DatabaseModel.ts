import { getIDB } from 'src/idb';
import { TaskData } from './Task';
import { db } from 'src/firebase';
import { ProjectData } from './Project';

export default abstract class DatabaseModel {
  abstract STORE_NAME: 'tasks' | 'projects';
  abstract id: string;
  abstract last_modified: number;
  abstract serialize(): TaskData | ProjectData;

  async save() {
    try {
      const data = this.serialize();
      data.last_modified = Date.now();
      // TODO can't save record format in Task sort by
      // const idb = await getIDB();
      // await idb.put(this.STORE_NAME, data, this.id);
      await db.collection(this.STORE_NAME).doc(this.id).set(data);
    } catch (error) {
      console.log('error saving: ', error);
    }
  }

  async delete() {
    try {
      const idb = await getIDB();
      await idb.delete(this.STORE_NAME, this.id);
      await db.collection(this.STORE_NAME).doc(this.id).delete();
    } catch (error) {
      console.log('error deleting: ', error);
    }
  }
}
