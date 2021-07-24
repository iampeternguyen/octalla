import { db } from 'src/firebase';
import { BLOCKS_STORENAME, BlockData } from 'src/models/Block';

const saveBlock = async (block: BlockData) => {
  block.last_modified = Date.now();
  await db.collection(BLOCKS_STORENAME).doc(block.id).set(block);
  return block;
};

const BlocksRepository = {
  saveBlock,
};

export default BlocksRepository;
