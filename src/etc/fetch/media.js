import Fetch from "@11ty/eleventy-fetch";

const url = new URL("https://api.zakhary.dev/media/");
url.searchParams.set("sort", "created");
url.searchParams.set("order", "desc");

export default async () => Object.groupBy(
  (await Fetch(url.href, { duration: "5m", type: "json" })).map(({
    kind,
    item,
    meta,
    tags,
  }) => ({
    kind,
    ...item,
    created: new Date(meta.created * 1000),
    tags: tags ?? [],
  })),
  item => item.kind,
);
