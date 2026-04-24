import Fetch from "@11ty/eleventy-fetch";

const url = new URL("https://api.zakhary.dev/media/links");
url.searchParams.set("sort", "created");
url.searchParams.set("order", "desc");

export default async () =>
  (await Fetch(url.href, { duration: "30m", type: "json" }))
    .map(({ item, meta, tags }) => ({
      url: item.url,
      title: item.title,
      created: new Date(meta.created * 1000),
      tags,
    }));
