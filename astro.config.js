import { defineConfig } from "astro/config";

import markdown from "@astropub/md";
import sitemap from "@astrojs/sitemap";

import remarkCallouts from "remark-callouts";
import remarkReadingTime from "remark-reading-time";

// https://astro.build/config
export default defineConfig({
  site: "https://zakhary.dev",
  integrations: [markdown(), sitemap()],
  publicDir: "src/static",
  build: {
    format: "preserve",
  },
  markdown: {
    remarkPlugins: [remarkCallouts, remarkReadingTime],
    shikiConfig: {
      themes: {
        light: "rose-pine-dawn",
        dark: "catppuccin-frappe",
      },
    },
  },
});
