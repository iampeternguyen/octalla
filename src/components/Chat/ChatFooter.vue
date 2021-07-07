<template>
  <div class="footer row justify-end full-width q-gutter-xs">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="count++" />
    </q-page-sticky>

    <q-item
      clickable
      class="col-2 bg-white row justify-between items-center"
      v-for="index in count"
      :key="index"
    >
      <span class="chat-title col-10">
        Peter, Lavender, and Duri and others and xyz
      </span>
      <q-item-section
        ><q-btn color="primary" icon="check" round flat @click.stop="count--"
      /></q-item-section>
      <q-menu fit anchor="top start" self="bottom left">
        <q-scroll-area
          style="height: 35rem"
          class="q-pl-md q-pt-md q-pb-xs q-pr-lg bg-grey-2"
        >
          <q-chat-message label="Sunday, 19th" />

          <q-chat-message
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            size="8"
            :text="['hey, how are you?']"
            sent
            stamp="7 minutes ago"
          />
          <q-chat-message
            name="Jane"
            size="8"
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            :text="['doing fine, how r you?']"
            stamp="4 minutes ago"
          />
          <q-chat-message
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            size="8"
            :text="['hey, how are you?']"
            sent
            stamp="7 minutes ago"
          />
          <q-chat-message
            name="Jane"
            size="8"
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            :text="['doing fine, how r you?']"
            stamp="4 minutes ago"
          />
          <q-chat-message
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            size="8"
            :text="['hey, how are you?']"
            sent
            stamp="7 minutes ago"
          />
          <q-chat-message
            name="Jane"
            size="8"
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            :text="['doing fine, how r you?']"
            stamp="4 minutes ago"
          />
          <q-chat-message
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            size="8"
            :text="['hey, how are you?']"
            sent
            stamp="7 minutes ago"
          />
          <q-chat-message
            name="Jane"
            size="8"
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            :text="['doing fine, how r you?']"
            stamp="4 minutes ago"
          />
          <q-chat-message
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            size="8"
            :text="['hey, how are you?']"
            sent
            stamp="7 minutes ago"
          />
          <q-chat-message
            name="Jane"
            size="8"
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            :text="['doing fine, how r you?']"
            stamp="4 minutes ago"
          />
        </q-scroll-area>
        <q-input
          class="q-pa-sm"
          v-model="text"
          type="text"
          placeholder="Message"
          borderless
        />
      </q-menu>
    </q-item>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ChatFooter',
  setup() {
    const count = ref(0);
    return {
      count,
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

.chat-title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
