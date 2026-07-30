import Fetch from "@11ty/eleventy-fetch";

import retcon from "../data/retcon.json" with { type: "json" };

const url = {
  games:  new URL("https://api.zakhary.dev/media/games"),
  owned:  new URL("https://api.zakhary.dev/media/games/owned"),
  system: new URL("https://api.zakhary.dev/media/games/system"),
  extras: new URL("https://api.zakhary.dev/media/games/extras"),
};

const opts = { duration: "5m", type: "json" };

export default async () => {
  const title = Object.fromEntries(
    (await Fetch(url.games.href, opts)).map(({ item }) => [
      item.id,
      item.title,
    ]),
  );
  return {
    owned: (await Fetch(url.owned.href, opts))
      .map(item => ({
        ...item,
        title: title[item.game],
        system: {
          slug: item.system,
          ...retcon[item.system],
        },
      })),
    system: (await Fetch(url.system.href, opts))
      .map(item => ({
        ...item,
        system: {
          slug: item.system,
          ...retcon[item.system],
        },
      })),
    extras: (await Fetch(url.extras.href, opts))
      .map(item => ({
        ...item,
        system: {
          slug: item.system,
          ...retcon[item.system],
        },
      })),
  };
};
