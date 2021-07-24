import { TaskBlockData } from 'src/models/Block';
import AppRepository from 'src/repository/AppRepository';

async function saveBlock(block: TaskBlockData) {
  await AppRepository.blocks.saveBlock(block);
}

const BlocksViewModel = {
  saveBlock,
};

export default BlocksViewModel;
