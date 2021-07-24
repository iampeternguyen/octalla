<template>
  <editor-content :editor="editor" />
</template>
<script lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditorBlock',
  components: {
    EditorContent,
  },
  setup() {
    const editor = useEditor({
      content: '<p>I’m running tiptap with Vue.js. 🎉</p>',
      extensions: [StarterKit],
    });

    console.log('editor', editor);
    return { editor };
  },
});
</script>

<style lang="scss" scoped></style>
