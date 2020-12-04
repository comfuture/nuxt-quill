module.exports = {
  theme: {},
  variants: {},
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === "production",
    content: ["components/**/*.vue", "pages/**/*.vue"],
    options: {
      whitelist: [
        "h1",
        "h2",
        "h3",
        "p",
        "blockquote",
        "strong",
        "ol",
        "li" /* etc. */
      ]
    }
  }
};
