<template>
  <main>
    <quill-editor v-model="content" />
    <section>
      <button>버튼</button>
    </section>
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
      content: "<hello-world>Hello, world</hello-world>",
    };
  },
};
</script>
