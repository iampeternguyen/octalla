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
      ><q-btn
        v-if="chat"
        color="primary"
        icon="eva-close-outline"
        round
        flat
        @click="closeChat(index)"
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
import {
  EVENT_CHAT_MESSAGE_ADDED,
  EVENT_CHAT_MESSAGE_DELETED,
  EVENT_CHAT_MESSAGE_UPDATED,
} from 'src/events/BroadcastEvents';
export default defineComponent({
  name: 'MiniChat',
  props: {
    chatData: {
      type: Object as PropType<ChatData>,
    },
    index: {
      type: Number,
    },
    remove: {
      type: Function,
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

    if (chat.value) {
      // watchChatMessages();
      setUpChat();
    }

    function setUpChat() {
      getFirstMessage().catch((err) => {
        console.log('no first message', err);
        noMoreMessages.value = true;
      });
    }

    PubSub.subscribe(
      EVENT_CHAT_MESSAGE_ADDED,
      (_msg: string, chatMessage: ChatMessageData) => {
        if (chat.value && chatMessage.chat_id == chat.value.id) {
          messages.value.push(chatMessage);
        }
      }
    );

    PubSub.subscribe(
      EVENT_CHAT_MESSAGE_UPDATED,
      (_msg: string, chatMessage: ChatMessageData) => {
        if (chat.value && chatMessage.chat_id == chat.value.id) {
          const index = messages.value.findIndex((t) => t.id == chatMessage.id);
          messages.value.splice(index, 1, chatMessage);
        }
      }
    );

    PubSub.subscribe(
      EVENT_CHAT_MESSAGE_DELETED,
      (_msg: string, chatMessage: ChatMessageData) => {
        if (chat.value && chatMessage.chat_id == chat.value.id) {
          const index = messages.value.findIndex((t) => t.id == chatMessage.id);
          messages.value.splice(index, 1);
        }
      }
    );

    // TODO MOVE OTHER METHODS THAT REQUEST DATA DIRECTLY TO VIEW MODEL

    const firstOpen = ref(true);

    async function onFirstOpen() {
      if (!firstOpen.value) return;
      await fetchMoreMessages();
      firstOpen.value = false;
    }

    async function getFirstMessage() {
      if (!chat.value) return;
      messages.value.push(
        await ChatViewModel.methods.getMostRecentMessage(chat.value.id)
      );
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
      _abort: (fn: () => void) => void
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

    async function createChat() {
      if (members.value.length > 0) {
        const chatIndex = getChatIndexIfExists();
        if (chatIndex) {
          // TODO check if chat already open / auto load messages like fb
          ChatViewModel.methods.openChat(chatIndex);
          if (props.remove) props.remove();
        } else {
          await ChatViewModel.methods.createNewChat(members.value);
        }
      }
    }

    function getChatIndexIfExists(): number | null {
      let foundChat: number | null = null;
      ChatViewModel.properties.allChats.value.forEach((chat, index) => {
        if (
          chat.members.length == members.value.length + 1 &&
          members.value.every((member) => chat.members.includes(member.value))
        ) {
          foundChat = index;
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

      const olderMessages = await ChatViewModel.methods.getOlderMessages(
        () => (noMoreMessages.value = true),
        messages.value[0]
      );
      if (olderMessages) messages.value.unshift(...olderMessages);

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

    function closeChat(index: number) {
      ChatViewModel.methods.closeChat(index);
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
      closeChat,
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
