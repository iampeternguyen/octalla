import { db } from 'src/firebase';
import { ChatData, CHATS_STORENAME } from 'src/models/ChatMessage';

const createChat = async (chat: ChatData) => {
  await db.collection(CHATS_STORENAME).doc(chat.id).set(chat);
};

const ChatRepository = {
  createChat,
};

export default ChatRepository;
