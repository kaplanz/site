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
    .map(item => ({
      ...item,
      platform: {
        slug: item.platform,
        ...plat[item.platform],
      },
    }));
  const kind = want => owned.filter(item => item.kind === want);
  return {
    releases: kind("release")
      .map(item => ({
        ...item,
        title: item.title ?? item.game.map(game => game.title).join(" / "),
      })),
    consoles: kind("console"),
    extras: kind("extra"),
  };
};
