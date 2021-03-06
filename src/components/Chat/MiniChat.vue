<template>
  <q-list class="rounded-borders mini-chat">
    <q-expansion-item class="bg-white" default-opened ref="miniChat">
      <template v-slot:header>
        <q-item-section class="ellipsis">
          {{ chat.title }}
        </q-item-section>
        <q-item-section side class="close-button">
          <div class="row items-center justify-end">
            <q-btn
              color="primary"
              size="1rem"
              icon="eva-close-outline"
              round
              flat
              @click="closeChat(index)"
            />
          </div>
        </q-item-section>
      </template>

      <q-card>
        <div
          ref="chatMessageScrollArea"
          style="height: 35rem"
          class="chatMessageScrollArea scroll q-pr-md q-pl-sm"
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
          ref="miniChatMessageInput"
          class="q-pa-sm"
          type="text"
          placeholder="Message"
          v-model="messageText"
          borderless
          @keydown.enter.stop="sendMessage"
        />
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
<script lang="ts">
import { debounce, QExpansionItem, QInput } from 'quasar';
import { ChatData, ChatMessageData } from 'src/models/ChatMessage';
import UserViewModel from 'src/viewmodels/UserViewModel';
import { defineComponent, ref, PropType } from 'vue';
import ChatViewModel from 'src/viewmodels/ChatViewModel';
import {
  EVENT_CHAT_FOCUS,
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
    // TODO show indication of focused chat?
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

    PubSub.subscribe(EVENT_CHAT_FOCUS, (_msg: string, chatData: ChatData) => {
      if (props.chat && chatData.id == props.chat.id) {
        focusChat();
      }
    });

    const miniChat = ref<QExpansionItem | null>(null);
    const miniChatMessageInput = ref<QInput | null>(null);
    const userId = UserViewModel.properties.appProfile.value?.id || '';
    const messageText = ref('');
    const messages = ref<ChatMessageData[]>([]);
    const chatMessageScrollArea = ref<HTMLDivElement | null>(null);
    const loadingMessages = ref(false);

    const noMoreMessages = ref(false);

    setUpChat().catch((err) => console.log(err));

    async function setUpChat() {
      try {
        await getFirstMessage();
        await fetchMoreMessages();
      } catch (error) {
        console.log('no first message', error);
        noMoreMessages.value = true;
      }
    }

    async function getFirstMessage() {
      if (!props.chat) return;
      messages.value.push(
        await ChatViewModel.methods.getMostRecentMessage(props.chat.id)
      );
    }

    function closeChat(index: number) {
      ChatViewModel.methods.closeChat(index);
    }

    async function sendMessage() {
      if (props.chat && messageText.value) {
        console.log('sending message to', props.chat.title, messageText.value);
        await ChatViewModel.methods.sendMessage(
          props.chat.id,
          messageText.value
        );
        messageText.value = '';
      }
    }

    function scrollToBottom() {
      if (chatMessageScrollArea.value) {
        // chatMessageScrollArea.value.setScrollPercentage('vertical', 1);
      }
    }

    const debounceFocus = debounce(() => {
      if (miniChatMessageInput.value) {
        console.log('focusing');
        miniChatMessageInput.value.focus();
      }
    }, 100);
    function focusChat() {
      if (miniChat.value && miniChatMessageInput.value) {
        miniChat.value.show();
        debounceFocus();
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
      miniChat,
      miniChatMessageInput,
      sendMessage,
      messageText,
      messages,
      userId,
      chatMessageScrollArea,
      checkPosition,
      loadingMessages,

      closeChat,
    };
  },
});
</script>

<style lang="scss" scoped>
.mini-chat {
  pointer-events: auto;

  &::v-deep .close-button {
    // targets the div containg the expand icon
    & + div {
      display: none;
    }
  }
}

.hide-button {
  display: none;
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
