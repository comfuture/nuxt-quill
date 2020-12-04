<template>
  <section>
    <article><quill-editor v-model="content" /></article>
  </section>
</template>

<script>
import QuillEditor from "~/components/quill-editor.vue";

export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      content: "Hello, world",
    };
  },
};
</script>
