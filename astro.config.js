import { defineConfig } from "astro/config";

import markdown from "@astropub/md";
import sitemap from "@astrojs/sitemap";

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
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      themes: {
        light: "rose-pine-dawn",
        dark: "catppuccin-frappe",
      },
    },
  },
});
