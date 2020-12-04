<template>
  <main>
    <quill-editor v-model="content" />
  </main>
</template>

<script>
import QuillEditor from "~/components/quill-editor.vue";

export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      content: "<hello-world>comfuture</hello-world>",
    };
  },
};
</script>
