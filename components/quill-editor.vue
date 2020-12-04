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
      // const Block = Quill.import("blots/block");
      class HelloWorldBlot /* Block */ extends Embed {
        static create(name = "world") {
          let node = super.create(name);
          node.contentEditable = "false";
          node.appendChild(document.createTextNode(`Hello, ${name}!`));
          return node;
        }
        static value(node) {
          return node.innerHTML;
        }

        static formats(domNode) {
          return true;
        }

        format(name, value = "world") {
          if (name === "value") {
            this.domNode.innerHTML = `Hello, ${value}!`;
          }
        }

        formats() {
          let formats = super.formats();
          formats["value"] = HelloWorldBlot.formats(this.domNode);
          return formats;
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
              [{ "hello-world": "world" }],
            ],
            handlers: {
              // define handler for toolbar
              "hello-world": function (value = null) {
                const { index } = quill.getSelection(true);
                quill.insertEmbed(index, "hello-world", value);
                quill.setSelection(index + 1, 0, "api");
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
      const Parchment = Quill.import("parchment");
      // quill.root.addEventListener("dblclick", (event) => {
      quill.on("dblclick", (event) => {
        const blot = Parchment.find(event.target);
        console.log(event, blot);
        if (blot instanceof HelloWorldBlot) {
          quill.setSelection(blot.offset(quill.scroll), 1, "user");
          const newName = prompt("Your name?");
          Quill.format(blot, "value", newName);
        }
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
<style lang="postcss">
.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 1.5em;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga" !important;
  -webkit-font-smoothing: antialiased;
}

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

.ql-toolbar button {
  @apply material-icons;
}

.ql-hello-world::after {
  content: "face";
}

hello-world {
  @apply border border-gray-800 py-2 px-4 bg-blue-600 text-white rounded;
}
</style>
