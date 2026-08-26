import Fetch from "@11ty/eleventy-fetch";

const url = new URL("https://api.zakhary.dev/media/games/owned");

const opts = {
  duration: "0s",
  type: "json",
};

export default async () => {
  const plat = await Fetch(
    "https://cdn.zakhary.dev/usr/share/media/games/platform.json",
    { type: "json" },
  );
  const owned = (await Fetch(url.href, opts))
    .map(({ kind, item, games }) => ({
      kind,
      item: {
        ...item,
        platform: {
          slug: item.platform,
          ...plat[item.platform],
        },
      },
      games,
    }));
  const filter = want => owned.filter(owned => owned.kind === want);
  return {
    releases: filter("release")
      .map(owned => ({
        ...owned,
        item: {
          ...owned.item,
          title: owned.item.title
            ?? owned.games.map(game => game.title).join(" / "),
        },
      })),
    consoles: filter("console"),
    extras: filter("extra"),
  };
};
