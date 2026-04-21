import Fetch from "@11ty/eleventy-fetch";

const url = new URL("https://memos.zakhary.dev/api/v1/memos");
url.searchParams.set("creator", "users/zakhary");
url.searchParams.set("pageSize", "50");

export default async () =>
  ((await Fetch(url.href, { duration: "30m", type: "json" })).memos ?? [])
    .map(({ createTime, content, tags }) => ({
      created: new Date(createTime),
      content,
      tags,
      fileSlug: Math.floor(new Date(createTime).getTime() / 1000).toString(16),
    }))
    .sort((a, b) => b.created - a.created);
