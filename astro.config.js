import { defineConfig } from "astro/config";

import markdown from "@astropub/md";
import sitemap from "@astrojs/sitemap";

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import remarkCallouts from "remark-callouts";
import remarkReadingTime from "remark-reading-time";
import remarkSidenotes from "remark-sidenotes";

// https://astro.build/config
export default defineConfig({
  site: "https://zakhary.dev",
  integrations: [markdown(), sitemap()],
  publicDir: "src/static",
  build: {
    format: "preserve",
  },
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: "anchor",
            rel: "nofollow",
          },
        },
      ],
    ],
    remarkPlugins: [remarkCallouts, remarkReadingTime, remarkSidenotes],
    shikiConfig: {
      themes: {
        light: "rose-pine-dawn",
        dark: "catppuccin-frappe",
      },
    },
  },
});
