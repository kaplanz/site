export default {
  eleventyComputed: {
    title: data => data.note ? `Note #${data.note.fileSlug}` : undefined,
    created: data => data.note?.created,
    tags:    data => data.note?.tags ?? [],
    slug:    data => data.note?.fileSlug,
  },
};
