import { FirebaseFirestore, Query } from '@firebase/firestore-types';

const deleteQueryBatch = async (
  db: FirebaseFirestore,
  query: Query,
  resolve: () => unknown
) => {
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
  deleteQueryBatch(db, query, resolve).catch((err) => console.log(err));
};

const commonUtils = {
  deleteQueryBatch,
};

export default commonUtils;
