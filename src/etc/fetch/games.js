import Fetch from "@11ty/eleventy-fetch";

const url = {
  copies:  new URL("https://api.zakhary.dev/media/games/copies"),
  systems: new URL("https://api.zakhary.dev/media/games/systems"),
  extras:  new URL("https://api.zakhary.dev/media/games/extras"),
};

const opts = {
  duration: "0s",
  type: "json",
};

export default async () => {
  const plat = await Fetch(
    "https://cdn.zakhary.dev/usr/share/media/games/platform.json",
    { type: "json" },
  );
  return {
    copies: (await Fetch(url.copies.href, opts))
      .map(item => ({
        ...item,
        title: item.title ?? item.game.map(game => game.title).join(" + "),
        system: {
          slug: item.system,
          ...plat[item.system],
        },
      })),
    systems: (await Fetch(url.systems.href, opts))
      .map(item => ({
        ...item,
        system: {
          slug: item.system,
          ...plat[item.system],
        },
      })),
    extras: (await Fetch(url.extras.href, opts))
      .map(item => ({
        ...item,
        system: {
          slug: item.system,
          ...plat[item.system],
        },
      })),
  };
};
