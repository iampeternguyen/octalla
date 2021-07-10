import { EVENT_ACTIVE_WORKSPACE_SET } from 'src/events/BroadcastEvents';
import ChatMessage, { Chat, ChatData } from 'src/models/ChatMessage';
import { WorkspaceData } from 'src/models/Workspace';
import AppRepository from 'src/repository/AppRepository';
import { ref, computed } from 'vue';
import UserViewModel from './UserViewModel';
import WorkspaceViewModel from './WorkspaceViewModel';

PubSub.subscribe(
  EVENT_ACTIVE_WORKSPACE_SET,
  (_msg: string, workspace: WorkspaceData) => {
    watchWorkspaceChats(workspace);
  }
);

const dummyData = new Chat('1', [{ label: 'Peter', value: '2' }], '2');

const _allChats = ref<ChatData[]>([dummyData.serialize()]);
const _openChats = ref<ChatData[]>([]);

const properties = {
  allChats: computed(() => _allChats.value),
  openChats: computed(() => _openChats.value),
};

async function createNewChat(members: { label: string; value: string }[]) {
  if (
    !WorkspaceViewModel.properties.activeSpace.value ||
    !UserViewModel.properties.appProfile.value
  )
    return;
  const chat = new Chat(
    WorkspaceViewModel.properties.activeSpace.value.id,
    members.concat([
      {
        label: UserViewModel.properties.appProfile.value.display_name,
        value: UserViewModel.properties.appProfile.value.id,
      },
    ]),
    UserViewModel.properties.appProfile.value.id
  );

  await AppRepository.chat.createChat(chat.serialize());
}

async function sendMessage(chatId: string, message: string) {
  if (!UserViewModel.properties.appProfile.value) return;
  const newMessage = new ChatMessage(
    message,
    chatId,
    UserViewModel.properties.appProfile.value.id
  );
  await AppRepository.chat.sendMessage(newMessage.serialize());
}

function watchWorkspaceChats(workspace: WorkspaceData) {
  if (!UserViewModel.properties.appProfile.value) return;
  clearWorkspaceChats();
  AppRepository.chat.watchWorkspaceChats(
    workspace.id,
    UserViewModel.properties.appProfile.value.id,
    addWorkspaceChat,
    updateWorkspaceChat,
    removeWorkspaceChat
  );
}

// Projects change handlers
function clearWorkspaceChats() {
  _allChats.value.splice(0, _allChats.value.length);
}

function updateWorkspaceChat(chatData: ChatData) {
  const index = _allChats.value.findIndex((t) => t.id == chatData.id);
  _allChats.value.splice(index, 1, chatData);
}

function removeWorkspaceChat(chatData: ChatData) {
  const index = _allChats.value.findIndex((t) => t.id == chatData.id);
  _allChats.value.splice(index, 1);
}

function addWorkspaceChat(chatData: ChatData) {
  console.log('chat added', chatData);
  _allChats.value.push(chatData);
}

const ChatViewModel = {
  properties,
  methods: {
    createNewChat,
    sendMessage,
  },
};
export default ChatViewModel;
