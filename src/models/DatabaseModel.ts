import { getIDB } from 'src/idb';
import { TaskData } from './Task';
import { db } from 'src/firebase';

export default abstract class DatabaseModel {
  abstract STORE_NAME: 'tasks';
  abstract id: string;
  abstract serialize(): TaskData;

  async save() {
    try {
      const idb = await getIDB();
      await idb.put(this.STORE_NAME, this.serialize(), this.id);
      await db.collection(this.STORE_NAME).doc(this.id).set(this.serialize());
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
