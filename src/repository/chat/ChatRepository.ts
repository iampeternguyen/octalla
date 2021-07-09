import { db } from 'src/firebase';
import {
  ChatData,
  ChatMessageData,
  CHATS_MESSAGES_STORENAME,
  CHATS_STORENAME,
} from 'src/models/ChatMessage';

async function createChat(chat: ChatData) {
  await db
    .collection(CHATS_STORENAME)
    .doc(chat.workspace_id)
    .collection(CHATS_STORENAME)
    .doc(chat.id)
    .set(chat);
}

async function sendMessage(message: ChatMessageData) {
  await db.collection(CHATS_MESSAGES_STORENAME).doc(message.id).set(message);
}

let workspaceChatsObserver = () => {
  return;
};

function watchWorkspaceChats(
  workspaceId: string,
  userId: string,
  onChatAdded: (chatData: ChatData) => void,
  onChatChanged: (chatData: ChatData) => void,
  onChatDeleted: (chatData: ChatData) => void
) {
  console.log('watching workspace chats');
  // unsubscribe
  workspaceChatsObserver();
  //   TODO move to ViewModel
  //   clearWorkspaceProjects();

  const query = db
    .collection(CHATS_STORENAME)
    .doc(workspaceId)
    .collection(CHATS_STORENAME)
    .where('members', 'array-contains', userId);

  workspaceChatsObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const chatData = change.doc.data() as ChatData;

        console.log('chat change.type:', change.type);
        if (change.type === 'added') {
          onChatAdded(chatData);
        }
        if (change.type === 'modified') {
          onChatChanged(chatData);
        }
        if (change.type === 'removed') {
          onChatDeleted(chatData);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err.message}`);
    }
  );
}

let chatMessageObserver = () => {
  return;
};

function watchChatMessages(
  chatId: string,

  onMessageAdded: (messageData: ChatMessageData) => void,
  onMessageChanged: (messageData: ChatMessageData) => void,
  onMessageDeleted: (messageData: ChatMessageData) => void
) {
  console.log('watching chat messages');
  // unsubscribe
  chatMessageObserver();
  //   TODO move to ViewModel
  //   clearWorkspaceProjects();

  const query = db
    .collection(CHATS_MESSAGES_STORENAME)
    .where('chat_id', '==', chatId)
    .orderBy('created_at', 'desc');

  chatMessageObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const messageData = change.doc.data() as ChatMessageData;

        console.log('message change.type:', change.type);
        if (change.type === 'added') {
          onMessageAdded(messageData);
        }
        if (change.type === 'modified') {
          onMessageChanged(messageData);
        }
        if (change.type === 'removed') {
          onMessageDeleted(messageData);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err.message}`);
    }
  );
}

const ChatRepository = {
  createChat,
  sendMessage,
  watchWorkspaceChats,
  watchChatMessages,
};

export default ChatRepository;
