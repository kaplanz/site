import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

import sanitizeHtml from "sanitize-html";

import { about as description, title } from "../global";

export async function GET(context) {
  // Collect sorted posts
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.created.valueOf() - a.data.created.valueOf());
  return rss({
    // `<title>` field in output xml
    title,
    // `<description>` field in output xml
    description,
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Render RSS items with(out) a trailing slash
    trailingSlash: false,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: posts.map((post) => ({
      link: `/blog/${post.slug}`,
      pubDate: post.data.created,
      title: post.data.title,
      description: post.data.description?.trim(),
      content: sanitizeHtml(post.rendered?.html),
    })),
  });
}
