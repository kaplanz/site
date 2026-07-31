import Fetch from "@11ty/eleventy-fetch";

const url = {
  owned:  new URL("https://api.zakhary.dev/media/games/owned"),
  system: new URL("https://api.zakhary.dev/media/games/system"),
  extras: new URL("https://api.zakhary.dev/media/games/extras"),
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
    owned: (await Fetch(url.owned.href, opts))
      .map(item => ({
        ...item,
        title: item.game.title,
        system: {
          slug: item.system,
          ...plat[item.system],
        },
      })),
    system: (await Fetch(url.system.href, opts))
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
