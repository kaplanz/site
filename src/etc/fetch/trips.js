import Fetch from "@11ty/eleventy-fetch";

const url = {
  2026: {
    japan: new URL(
      "https://cdn.zakhary.dev/usr/share/files/2026/japan/timeline.json",
    ),
  },
};

export default async () => Object.fromEntries(await Promise.all(
  Object.entries(url).map(async ([year, slugs]) => [
    year,
    Object.fromEntries(await Promise.all(
      Object.entries(slugs).map(async ([slug, src]) => [
        slug,
        await Fetch(src.href, {
          duration: "0s",
          type: "json",
        }),
      ]),
    )),
  ]),
));
