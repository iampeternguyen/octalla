import { Chat, ChatData } from 'src/models/ChatMessage';
import AppRepository from 'src/repository/AppRepository';
import { ref, computed } from 'vue';
import UserViewModel from './UserViewModel';
import WorkspaceViewModel from './WorkspaceViewModel';
const _openChats = ref<ChatData[]>([]);

const properties = {
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
    members,
    UserViewModel.properties.appProfile.value.id
  );

  await AppRepository.chat.createChat(chat.serialize());
}

const ChatViewModel = {
  properties,
  methods: {
    createNewChat,
  },
};
export default ChatViewModel;
