import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://zakhary.dev",
  integrations: [sitemap()],
  publicDir: "www",
  markdown: {
    shikiConfig: {
      themes: {
        light: "rose-pine-dawn",
        dark: "catppuccin-frappe",
      },
    },
  },
});
