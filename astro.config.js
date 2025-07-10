import { defineConfig } from "astro/config";

import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import markdown from "@astropub/md";

import rehypeShiki from "@shikijs/rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import rehypeExternalLinks from "rehype-external-links";
import remarkCallouts from "remark-callouts";
import remarkDeflist from "remark-deflist";
import remarkModifiedTime from "remark-modified-time";
import remarkReadingTime from "remark-reading-time";
import remarkSidenotes from "remark-sidenotes";

// https://astro.build/config
export default defineConfig({
  site: "https://zakhary.dev",
  integrations: [alpinejs(), markdown(), mdx(), sitemap()],
  publicDir: "www",
  trailingSlash: "never",
  build: {
    format: "preserve",
  },
  markdown: {
    syntaxHighlight: false,
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
      [
        rehypeExternalLinks,
        {
          target: "_blank",
        },
      ],
      [
        rehypeShiki,
        {
          themes: {
            light: "everforest-light",
            dark: "everforest-dark",
          },
          defaultColor: "light-dark()",
        },
      ],
    ],
    remarkPlugins: [
      remarkCallouts,
      remarkDeflist,
      remarkModifiedTime,
      remarkReadingTime,
      remarkSidenotes,
    ],
  },
});
