// import { getIDB } from 'src/idb';
import { TaskData } from './Task';
import { db } from 'src/firebase';
import { ProjectData } from './Project';
import { WorkspaceData } from './Workspace';
import { UserSettingsData } from './UserSettings';
import { Query, FirebaseFirestore } from '@firebase/firestore-types';
import { CompetencyData } from './Competency';
import { WorkspaceRolesData } from './Role';

export default abstract class DatabaseModel {
  abstract STORE_NAME:
    | 'tasks'
    | 'projects'
    | 'workspaces'
    | 'user_settings'
    | 'roles'
    | 'competencies';

  abstract id: string;
  abstract last_modified: number;
  abstract serialize():
    | TaskData
    | ProjectData
    | WorkspaceData
    | UserSettingsData
    | WorkspaceRolesData
    | CompetencyData;

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
  // TODO maybe make delete just change a field in the database and not actually delete so that data can be recovered
  // TODO work on visibility settings for each of the models: public/workspace/private & included / excluded users Maybe create project level roles for this?
  async delete() {
    try {
      await db.collection(this.STORE_NAME).doc(this.id).delete();
    } catch (error) {
      console.log('error deleting: ', error);
    }
  }

  async deleteQueryBatch(
    db: FirebaseFirestore,
    query: Query,
    resolve: () => unknown
  ) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    // TODO move this to backend api
    this.deleteQueryBatch(db, query, resolve).catch((err) => console.log(err));
  }
}
