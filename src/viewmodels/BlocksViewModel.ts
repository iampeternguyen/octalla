import { BlockData } from 'src/models/Block';
import AppRepository from 'src/repository/AppRepository';

async function saveBlock(block: BlockData) {
  await AppRepository.blocks.saveBlock(block);
}

const BlocksViewModel = {
  saveBlock,
};

export default BlocksViewModel;
