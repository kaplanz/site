export default {
  layout: "post",
  eleventyComputed: {
    date(data) {
      data.page.date = new Date(data.created);
    },
  },
};
