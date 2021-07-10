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
    <q-menu
      fit
      anchor="top start"
      self="bottom left"
      @show="onShowChat"
      @before-show="isLoading = true"
    >
      <q-scroll-area
        ref="chatMessageScrollArea"
        style="height: 35rem"
        class="q-pl-md q-pt-md q-pr-lg bg-grey-2"
        :class="{ invisible: isLoading }"
      >
        <!-- <q-chat-message label="Sunday, 19th" /> -->

        <q-chat-message
          v-for="message in messages"
          :key="message.id"
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          size="8"
          :text="[message.message]"
          :sent="message.created_by == userId"
          :stamp="message.created_at"
        />
      </q-scroll-area>
      <q-input
        :class="{ invisible: isLoading }"
        class="q-pa-sm"
        type="text"
        placeholder="Message"
        v-model="messageInput"
        borderless
        @keydown.enter.stop="sendMessage"
      />
      <q-inner-loading :showing="isLoading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-menu>
  </q-item>
</template>
<script lang="ts">
import { QScrollArea, QSelect } from 'quasar';
import ChatMessage, { ChatData, ChatMessageData } from 'src/models/ChatMessage';
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
    const chatMessageScrollArea = ref<QScrollArea | null>(null);
    const isLoading = ref(true);
    let chatMesssageObsever = () => {
      return;
    };

    if (chat.value) {
      watchChatMessages();
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

    async function createChat() {
      if (members.value.length > 0) {
        const hasChat = getChatIfExists();
        if (hasChat) {
          chat.value = hasChat;
          watchChatMessages();
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
        chatMessageScrollArea.value.setScrollPercentage('vertical', 1);
      }
    }

    // function checkPosition() {
    //   if (chatMessageScrollArea.value) {
    //     console.log(
    //       'position',
    //       chatMessageScrollArea.value.getScrollPosition().top
    //     );
    //   }
    // }

    function watchChatMessages() {
      if (!UserViewModel.properties.appProfile.value || !chat.value) return;
      clearChatMessages();
      AppRepository.chat.watchChatMessages(
        chat.value.id,
        chatMesssageObsever,
        addChatMessage,
        updateChatMessage,
        removeChatMessage
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
      console.log('chat added', messageData);
      messages.value.push(messageData);
      scrollToBottom();
    }

    function onShowChat() {
      scrollToBottom();
      isLoading.value = false;
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
      isLoading,
      onShowChat,
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
</style>
