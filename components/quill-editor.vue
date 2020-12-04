<template>
  <div class="ql-container"><div ref="editor"></div></div>
</template>
<script>
export default {
  name: "quill-editor",
  props: {
    value: String,
    placeholder: String,
  },
  data() {
    return {
      content: "",
    };
  },
  mounted() {
    Promise.all([
      import("quill"),
      import("quill/dist/quill.core.css"),
      import("quill/dist/quill.snow.css"),
    ]).then(([{ default: Quill }, _, __]) => {
      // define custom element
      class HelloWorldElement extends HTMLElement {}
      window.customElements.define("hello-world", HelloWorldElement);

      // define custom blot
      const Embed = Quill.import("blots/block/embed");
      class HelloWorldBlot extends Embed {
        static create(value) {
          let node = super.create(value);
          node.appendChild(document.createTextNode("asdf"));
          return node;
        }
        static value(node) {
          return node.innerHTML;
        }
      }
      HelloWorldBlot.tagName = "hello-world"; // 중요!
      HelloWorldBlot.blotName = "hello-world";
      Quill.register(HelloWorldBlot);

      var quill = (this.quill = new Quill(this.$refs.editor, {
        theme: "snow",
        placeholder: this.placeholder,
        modules: {
          toolbar: {
            container: [
              // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ font: [] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              // ['blockquote', 'code-block'],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["clean"],
              // ["link", "image", "video"],
              [{ "hello-world": "hello~" }],
            ],
            handlers: {
              // define handler for toolbar
              "hello-world": function (value = null) {
                quill.insertEmbed(
                  quill.getSelection(true).index,
                  "hello-world",
                  value
                );
              },
            },
          },
        },
      }));
      quill.pasteHTML(this.value);
      quill.on("text-change", (delta, oldDelta, source) => {
        let html = this.$refs.editor.children[0].innerHTML;
        const text = quill.getText();
        if (html === "<p><br></p>") html = "";
        this.content = html;
        this.$emit("input", this.content);
        this.$emit("change", { html, text, quill });
      });
      quill.focus();
    });
  },
  watch: {
    value(newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this.content) {
          this.content = newVal;
          this.quill.pasteHTML(newVal);
        } else if (!newVal) {
          this.quill.setText("");
        }
      }
    },
  },
};
</script>
<style>
.ql-container .ql-snow {
  border: 1px solid rgba(34, 36, 38, 0.15);
}
.ql-toolbar {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.ql-container {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.ql-editor {
  min-height: 200px;
}

.ql-hello-world:after {
  content: "Hi";
}

hello-world {
  width: 100%;
  padding: 0.5em;
  background: #ddd;
  border: solid 1px #888;
}
</style>
