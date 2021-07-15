<template>
  <div class="footer row justify-end full-width q-gutter-xs">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="addNewChat" />
    </q-page-sticky>
    <mini-chat
      v-for="(chat, index) in chats"
      :chat="chat"
      :index="index"
      :key="chat.id"
    ></mini-chat>
    <create-mini-chat
      v-for="(item, index) in newChatArray"
      :key="index"
      :remove="() => onRemove(index)"
    ></create-mini-chat>
  </div>
</template>
<script lang="ts">
import ChatViewModel from 'src/viewmodels/ChatViewModel';
import { defineComponent, ref } from 'vue';
import CreateMiniChat from './CreateMiniChat.vue';
import MiniChat from './MiniChat.vue';

export default defineComponent({
  name: 'ChatFooter',
  components: {
    MiniChat,
    CreateMiniChat,
  },
  setup() {
    const chats = ChatViewModel.properties.openChats.value;
    const newChatArray = ref<string[]>([]);
    function onRemove(index: number) {
      newChatArray.value.splice(index, 1);
    }

    function addNewChat() {
      newChatArray.value.push('');
    }
    return {
      newChatArray,
      chats,
      onRemove,
      addNewChat,
    };
  },
});
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  padding-right: 10rem;
  bottom: 0;
  z-index: 1;
}
</style>
