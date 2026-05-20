import Fetch from "@11ty/eleventy-fetch";

const owned = new URL("https://api.zakhary.dev/media/games/owned");
owned.searchParams.set("sort",  "system");
owned.searchParams.set("order", "asc");

const system = new URL("https://api.zakhary.dev/media/games/system");
system.searchParams.set("sort",  "title");
system.searchParams.set("order", "asc");

const extra = new URL("https://api.zakhary.dev/media/games/extras");
extra.searchParams.set("sort",  "title");
extra.searchParams.set("order", "asc");

export default async () => ({
  owned:  await Fetch(owned.href,  { duration: "5m", type: "json" }),
  system: await Fetch(system.href, { duration: "5m", type: "json" }),
  extra:  await Fetch(extra.href,  { duration: "5m", type: "json" }),
});
