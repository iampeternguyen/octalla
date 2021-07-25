<template>
  <div>
    <!-- <bubble-menu
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
      v-if="editor"
    >
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        Bold
      </button>
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        Italic
      </button>
      <button
        @click="editor?.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        Strike
      </button>
    </bubble-menu> -->

    <editor-content :editor="editor" />
  </div>
</template>
<script lang="ts">
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditorBlock',
  components: {
    EditorContent,
    // BubbleMenu,
  },
  setup() {
    const editor = useEditor({
      content: '<p>I’m running tiptap with Vue.js. 🎉</p>',
      extensions: [StarterKit],
    });
    return { editor };
  },
});
</script>

<style lang="scss" scoped></style>
