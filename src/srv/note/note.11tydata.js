export default {
  layout: "note",
  eleventyComputed: {
    date(data) {
      data.page.date = new Date(data.created);
    },
    title: data => data.title || (
      `Note #${data.page.fileSlug}`
    ),
    created: data => data.created || (
      new Date(1000 * parseInt(data.page.fileSlug, 16))
    ),
  },
};
