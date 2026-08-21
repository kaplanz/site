export default {
  eleventyComputed: {
      media: (data) => Object.values(data.fetch.media).flat()
  }
};
