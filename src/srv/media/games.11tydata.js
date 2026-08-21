export default {
  eleventyComputed: {
      games: (data) => data.fetch.media.games
        .filter(game => game.logs?.length)
        .sort((a, b) =>
          (b.logs?.at(-1)?.date ?? 0) - (a.logs?.at(-1)?.date ?? 0)
        )
  }
};
