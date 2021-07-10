<template>
  <q-item class="col-2 bg-white row items-center" v-if="!chat">
    <div class="q-mr-md col-1">To:</div>
    <q-select
      ref="chatMemberSelector"
      class="col-8"
      borderless
      v-model="members"
      multiple
      :options="options"
      use-chips
      stack-label
      use-input
      @filter="filterFn"
      @keydown.stop.enter="makeSelection"
    />
    <q-btn
      color="primary"
      flat
      icon="eva-plus-outline"
      class="col-1"
      @click="createChat"
    />
  </q-item>
  <q-item
    clickable
    class="col-2 bg-white row justify-between items-center"
    v-else
  >
    <span class="chat-title col-10" v-if="chat">
      {{ chat.title }}
    </span>

    <q-item-section
      ><q-btn color="primary" icon="check" round flat
    /></q-item-section>
    <q-menu fit anchor="top start" self="bottom left" @show="onFirstOpen">
      <div
        ref="chatMessageScrollArea"
        style="height: 35rem"
        class="chatMessageScrollArea q-pl-md q-pt-md q-pr-lg bg-grey-2 scroll"
      >
        <div class="column">
          <q-spinner-facebook
            class="self-center"
            color="primary"
            size="2em"
            v-if="loadingMessages"
          />
          <q-chat-message
            v-for="message in messages"
            :key="message.id"
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            size="8"
            :text="[message.message]"
            :sent="message.created_by == userId"
            :stamp="message.created_at.toString()"
          />
        </div>

        <div v-scroll="checkPosition"></div>
      </div>

      <q-input
        class="q-pa-sm"
        type="text"
        placeholder="Message"
        v-model="messageInput"
        borderless
        @keydown.enter.stop="sendMessage"
      />
    </q-menu>
  </q-item>
</template>
<script lang="ts">
import { debounce, QSelect } from 'quasar';
import { ChatData, ChatMessageData } from 'src/models/ChatMessage';
import UserViewModel from 'src/viewmodels/UserViewModel';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
import { defineComponent, ref, PropType } from 'vue';
import ChatViewModel from 'src/viewmodels/ChatViewModel';
import AppRepository from 'src/repository/AppRepository';
export default defineComponent({
  name: 'MiniChat',
  props: {
    chatData: {
      type: Object as PropType<ChatData>,
    },
  },
  setup(props) {
    const chatMemberSelector = ref<QSelect | null>(null);
    const userId = UserViewModel.properties.appProfile.value?.id || '';
    const messageInput = ref('');
    const messages = ref<ChatMessageData[]>([]);
    const chat = ref<ChatData | null>(props.chatData || null);
    const chatMessageScrollArea = ref<HTMLDivElement | null>(null);
    const loadingMessages = ref(false);
    let chatMesssageObsever = () => {
      return;
    };

    if (chat.value) {
      // watchChatMessages();
      setUpChat();
    }

    function setUpChat() {
      getFirstMessage()
        .then((message) => {
          watchChatMessages(message);
        })
        .catch((err) => {
          console.log('no first message', err);
          noMoreMessages.value = true;
          watchChatMessages();
        });
    }

    const firstOpen = ref(true);
    async function onFirstOpen() {
      if (!firstOpen.value) return;
      await fetchMoreMessages();
      firstOpen.value = false;
    }

    async function getFirstMessage() {
      if (!chat.value) return;
      const message = await AppRepository.chat.getMostRecentMessage(
        chat.value.id
      );

      messages.value.push(message);
      return message;
    }

    const members = ref<{ label: string; value: string }[]>([]);

    const memberOptions = WorkspaceViewModel.properties.members.value
      .filter(
        (member) =>
          UserViewModel.properties.appProfile.value &&
          UserViewModel.properties.appProfile.value.id != member.id
      )
      .map((member) => {
        return { label: member.display_name, value: member.id };
      });

    const options = ref(memberOptions);

    function filterFn(
      val: string,
      update: (fn: () => void) => void,
      abort: (fn: () => void) => void
    ) {
      update(() => {
        const needle = val.toLowerCase();
        options.value = memberOptions.filter((v) => {
          const m = members.value.find((m) => m.value == v.value);

          return !m && v.label.toLowerCase().indexOf(needle) > -1;
        });
      });
    }

    function makeSelection() {
      if (!chatMemberSelector.value) return;
      if (
        chatMemberSelector.value.options &&
        chatMemberSelector.value.options.length > 0
      ) {
        chatMemberSelector.value.moveOptionSelection(1, true);
        chatMemberSelector.value.updateInputValue('');
        setTimeout(() => chatMemberSelector.value?.hidePopup(), 100);
      }
    }
    // TODO watch all messages that include the user and filter them appropriately.

    async function createChat() {
      if (members.value.length > 0) {
        const hasChat = getChatIfExists();
        if (hasChat) {
          chat.value = hasChat;
          setUpChat();
        } else {
          await ChatViewModel.methods.createNewChat(members.value);
        }
      }
    }

    function getChatIfExists(): ChatData | null {
      let foundChat: ChatData | null = null;
      ChatViewModel.properties.allChats.value.forEach((chat) => {
        if (
          chat.members.length == members.value.length + 1 &&
          members.value.every((member) => chat.members.includes(member.value))
        ) {
          foundChat = chat;
        }
      });
      return foundChat;
    }

    async function sendMessage() {
      if (chat.value && messageInput.value) {
        console.log('sending message to', chat.value.title, messageInput.value);
        await ChatViewModel.methods.sendMessage(
          chat.value.id,
          messageInput.value
        );
        messageInput.value = '';
      }
    }

    function scrollToBottom() {
      if (chatMessageScrollArea.value) {
        // chatMessageScrollArea.value.setScrollPercentage('vertical', 1);
      }
    }

    const debounceFetchMoreMessages = debounce(fetchMoreMessages, 100, true);
    const noMoreMessages = ref(false);
    async function fetchMoreMessages() {
      loadingMessages.value = true;
      if (messages.value[0]) {
        const olderMessages = await AppRepository.chat.getOlderMessages(
          messages.value[0]
        );
        if (olderMessages.length < 10) noMoreMessages.value = true;
        messages.value.unshift(...olderMessages);
      } else {
        noMoreMessages.value = true;
      }

      loadingMessages.value = false;
    }

    async function checkPosition(scrollPosition: number) {
      if (!chatMessageScrollArea.value || noMoreMessages.value) return;
      if (
        -scrollPosition >=
        chatMessageScrollArea.value.scrollHeight -
          chatMessageScrollArea.value.clientHeight -
          10
      ) {
        console.log('at the top');
        await debounceFetchMoreMessages();
      }
    }

    function watchChatMessages(message?: ChatMessageData) {
      if (!UserViewModel.properties.appProfile.value || !chat.value) return;

      AppRepository.chat.watchChatMessagesAfter(
        chat.value.id,
        chatMesssageObsever,
        addChatMessage,
        updateChatMessage,
        removeChatMessage,
        message
      );
    }

    // Projects change handlers
    function clearChatMessages() {
      messages.value.splice(0, messages.value.length);
    }

    function updateChatMessage(messageData: ChatMessageData) {
      const index = messages.value.findIndex((t) => t.id == messageData.id);
      messages.value.splice(index, 1, messageData);
    }

    function removeChatMessage(messageData: ChatMessageData) {
      const index = messages.value.findIndex((t) => t.id == messageData.id);
      messages.value.splice(index, 1);
    }

    function addChatMessage(messageData: ChatMessageData) {
      messages.value.push(messageData);
      scrollToBottom();
    }

    return {
      sendMessage,
      messageInput,
      messages,
      options,
      filterFn,
      members,
      makeSelection,
      chatMemberSelector,
      createChat,
      userId,
      chat,
      chatMessageScrollArea,
      checkPosition,
      loadingMessages,
      onFirstOpen,
    };
  },
});
</script>

<style lang="scss" scoped>
.chat-title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.chatMessageScrollArea {
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
}

.chatMessageScrollAreaContent {
  display: flex;
  flex-direction: column;
}

.chatMessageScrollArea::-webkit-scrollbar {
  width: 1rem; /* width of the entire scrollbar */
}

.chatMessageScrollArea::-webkit-scrollbar-track {
  background: $grey-1; /* color of the tracking area */
}

.chatMessageScrollArea::-webkit-scrollbar-thumb {
  background-color: $primary; /* color of the scroll thumb */
  border-radius: 2rem; /* roundness of the scroll thumb */
}
</style>
