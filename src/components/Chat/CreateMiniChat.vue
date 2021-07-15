<template>
  <q-item class="col-2 bg-white row items-center">
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
</template>
<script lang="ts">
import { QSelect } from 'quasar';
import ChatViewModel from 'src/viewmodels/ChatViewModel';
import UserViewModel from 'src/viewmodels/UserViewModel';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CreateMiniChat',
  props: {
    remove: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const members = ref<{ label: string; value: string }[]>([]);
    const chatMemberSelector = ref<QSelect | null>(null);

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

    return { members, options, filterFn, makeSelection, createChat };
  },
});
</script>

<style lang="scss" scoped></style>
