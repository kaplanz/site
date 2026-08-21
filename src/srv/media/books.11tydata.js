export default {
  eleventyComputed: {
    books: (data) => ({
      read: data.fetch.media.books
        .flatMap(book => book
          .logs
          .filter(log => log.kind === "done")
          .map(log => ({
            ...book,
            year: new Date(log.date * 1000).getUTCFullYear(),
            log
          }))
        )
        .sort((a, b) => b.log.date - a.log.date),

      live: data.fetch.media.books
        .filter(book => book.logs.at(-1)?.kind === "start")
        .map(book => ({
          ...book,
          year: new Date(book.logs.at(-1).date * 1000).getUTCFullYear()
        }))
        .sort((a, b) => b.logs.at(-1).date - a.logs.at(-1).date)
    })
  }
};
