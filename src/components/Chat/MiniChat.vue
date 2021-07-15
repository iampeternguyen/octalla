<template>
  <q-item clickable class="col-2 bg-white row justify-between items-center">
    <span class="chat-title col-10">
      {{ chat.title }}
    </span>

    <q-item-section
      ><q-btn
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
import { debounce } from 'quasar';
import { ChatData, ChatMessageData } from 'src/models/ChatMessage';
import UserViewModel from 'src/viewmodels/UserViewModel';
import { defineComponent, ref, PropType } from 'vue';
import ChatViewModel from 'src/viewmodels/ChatViewModel';
import {
  EVENT_CHAT_MESSAGE_ADDED,
  EVENT_CHAT_MESSAGE_DELETED,
  EVENT_CHAT_MESSAGE_UPDATED,
} from 'src/events/BroadcastEvents';
export default defineComponent({
  name: 'MiniChat',
  props: {
    chat: {
      type: Object as PropType<ChatData>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    PubSub.subscribe(
      EVENT_CHAT_MESSAGE_ADDED,
      (_msg: string, chatMessage: ChatMessageData) => {
        if (props.chat && chatMessage.chat_id == props.chat.id) {
          messages.value.push(chatMessage);
        }
      }
    );

    PubSub.subscribe(
      EVENT_CHAT_MESSAGE_UPDATED,
      (_msg: string, chatMessage: ChatMessageData) => {
        if (props.chat && chatMessage.chat_id == props.chat.id) {
          const index = messages.value.findIndex((t) => t.id == chatMessage.id);
          messages.value.splice(index, 1, chatMessage);
        }
      }
    );

    PubSub.subscribe(
      EVENT_CHAT_MESSAGE_DELETED,
      (_msg: string, chatMessage: ChatMessageData) => {
        if (props.chat && chatMessage.chat_id == props.chat.id) {
          const index = messages.value.findIndex((t) => t.id == chatMessage.id);
          messages.value.splice(index, 1);
        }
      }
    );
    // TODO make menu persistent and open as default
    const userId = UserViewModel.properties.appProfile.value?.id || '';
    const messageInput = ref('');
    const messages = ref<ChatMessageData[]>([]);
    const chatMessageScrollArea = ref<HTMLDivElement | null>(null);
    const loadingMessages = ref(false);
    const firstOpen = ref(true);

    setUpChat();

    function setUpChat() {
      getFirstMessage().catch((err) => {
        console.log('no first message', err);
        noMoreMessages.value = true;
      });
    }

    async function getFirstMessage() {
      if (!props.chat) return;
      messages.value.push(
        await ChatViewModel.methods.getMostRecentMessage(props.chat.id)
      );
    }

    async function onFirstOpen() {
      if (!firstOpen.value) return;
      await fetchMoreMessages();
      firstOpen.value = false;
    }

    function closeChat(index: number) {
      ChatViewModel.methods.closeChat(index);
    }

    async function sendMessage() {
      if (props.chat && messageInput.value) {
        console.log('sending message to', props.chat.title, messageInput.value);
        await ChatViewModel.methods.sendMessage(
          props.chat.id,
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

    const noMoreMessages = ref(false);

    const debounceFetchMoreMessages = debounce(fetchMoreMessages, 100, true);
    async function fetchMoreMessages() {
      loadingMessages.value = true;

      const olderMessages = await ChatViewModel.methods.getOlderMessages(
        () => (noMoreMessages.value = true),
        messages.value[0]
      );
      if (olderMessages) messages.value.unshift(...olderMessages);

      loadingMessages.value = false;
    }

    return {
      sendMessage,
      messageInput,
      messages,
      userId,
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
