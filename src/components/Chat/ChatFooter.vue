<template>
  <div class="footer row justify-end full-width q-gutter-xs">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="count++" />
    </q-page-sticky>
    <mini-chat v-for="chat in chats" :chat="chat" :key="chat.id"></mini-chat>
    <mini-chat v-for="index in count" :key="index"></mini-chat>
  </div>
</template>
<script lang="ts">
import ChatViewModel from 'src/viewmodels/ChatViewModel';
import { defineComponent, ref } from 'vue';
import MiniChat from './MiniChat.vue';

export default defineComponent({
  name: 'ChatFooter',
  components: {
    MiniChat,
  },
  setup() {
    const chats = ChatViewModel.properties.allChats.value;
    const count = ref(0);
    return {
      count,
      chats,
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
