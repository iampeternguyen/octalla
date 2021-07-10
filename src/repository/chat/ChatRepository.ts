import { Query } from '@firebase/firestore-types';
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

function watchChatMessagesAfter(
  chatId: string,
  chatMessageObserver: () => void,
  onMessageAdded: (messageData: ChatMessageData) => void,
  onMessageChanged: (messageData: ChatMessageData) => void,
  onMessageDeleted: (messageData: ChatMessageData) => void,
  message?: ChatMessageData
) {
  console.log('watching chat messages');
  // unsubscribe
  chatMessageObserver();

  let query: Query;
  if (message) {
    console.log('starting after', message.created_at);
    query = db
      .collection(CHATS_MESSAGES_STORENAME)
      .where('chat_id', '==', chatId)
      .orderBy('created_at', 'asc')
      .startAfter(message.created_at);
  } else {
    console.log('query from beginning');
    query = db
      .collection(CHATS_MESSAGES_STORENAME)
      .where('chat_id', '==', chatId)
      .orderBy('created_at', 'asc');
  }

  chatMessageObserver = query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const messageData = change.doc.data() as ChatMessageData;

        // console.log('message change.type:', change.type);
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

async function getMostRecentMessage(chatId: string) {
  const snapshot = await db
    .collection(CHATS_MESSAGES_STORENAME)
    .where('chat_id', '==', chatId)
    .orderBy('created_at', 'desc')
    .limit(1)
    .get();
  return snapshot.docs[0].data() as ChatMessageData;
}

async function getOlderMessages(message: ChatMessageData) {
  const snapshot = await db
    .collection(CHATS_MESSAGES_STORENAME)
    .where('chat_id', '==', message.chat_id)
    .orderBy('created_at', 'desc')
    .limit(10)
    .startAfter(message.created_at)
    .get();
  const messages: ChatMessageData[] = [];
  snapshot.docs.forEach((doc) => messages.push(doc.data() as ChatMessageData));
  return messages;
}

const ChatRepository = {
  createChat,
  sendMessage,
  watchWorkspaceChats,
  watchChatMessagesAfter,
  getMostRecentMessage,
  getOlderMessages,
};

export default ChatRepository;
