import path from "path";

// 11ty
import { HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

// dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

// features
import readingTime from "reading-time";

// markdown-it plugins
import markdownItDeflist from "markdown-it-deflist";
import markdownItAnchor from "markdown-it-anchor";
import markdownItGithubAlerts from "markdown-it-github-alerts";
import markdownItInlineFootnotes from "markdown-it-inline-footnotes";

// transforms
import { transform } from "lightningcss";
import htmlnano from "htmlnano";

// metadata
const site = {
  title: "Zakhary's Site",
  about: "My little corner of the internet.",
  author: {
    name:  "Zakhary Kaplan",
    email: "me@zakhary.dev"
  },
  url: "https://zakhary.dev",
  lang: "en-CA",
};

// eleventy
export default async function(cfg) {
  // Site metadata
  cfg.addGlobalData("site", site);
  // Build info
  cfg.addGlobalData("build", {
    date: new Date(),
  });
  // Page layout
  cfg.addGlobalData("layout", "page")

  // Remove trailing slashes
  //
  // See: https://www.11ty.dev/docs/permalinks/#remove-trailing-slashes
  //
  // Set global permalinks to resource.html style
  cfg.addGlobalData("permalink", () => {
    return data =>
      `${data.page.filePathStem}.${data.page.outputFileExtension}`;
  });
  // Remove .html from `page.url`
  cfg.addUrlTransform(page => {
    if (page.url.endsWith(".html")) {
      return page.url.slice(0, -1 * ".html".length);
    }
  });

  // Minify HTML
  cfg.addTransform("html-minify",async (content, outputPath) => {
    if (!outputPath?.endsWith(".html"))
      return content;
    const result = await htmlnano.process(content, {
      minifyCss: false,
      minifyJs:  false,
      minifySvg: false,
      collapseWhitespace: "aggressive"
    });
    return result.html;
  });

  // Per-page bundles
  //
  // See: https://github.com/11ty/eleventy-plugin-bundle
  //
  // Bundle <style> content and adds a {% css %} paired shortcode
  cfg.addBundle("css", {
    // Optional subfolder (relative to output directory) files will write to
    toFileDirectory: "assets/css",
    // Modify bundle content
    transforms: [
      function(content) {
        // type contains the bundle name.
        let { page } = this;
        let { code } = transform({
          filename: page.inputPath,
          code: Buffer.from(content),
          minify: true,
          sourceMap: true,
        });
        return code;
      }
    ],
    // Add all <style> content to `css` bundle
    //
    // (use <style eleventy:ignore> to opt-out)
    //
    // Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
    bundleHtmlContentFromSelector: "style",
  });

  // Copy static assets
  cfg.addPassthroughCopy({ "src/www": "/" });

  // HTML base plugin
  cfg.addPlugin(HtmlBasePlugin);

  // Generate RSS feeds
  for (const [type, { path: outputPath, stylesheet }] of Object.entries({
    atom: { path: "/atom.xml",  stylesheet: "/atom.xsl" },
    rss:  { path: "/feed.xml",  stylesheet: "/feed.xsl" },
    json: { path: "/feed.json", stylesheet: null },
  })) {
    cfg.addPlugin(feedPlugin, {
      type,
      outputPath,
      collection: {
        name: "blog",
        limit: 0,
      },
      metadata: {
        language: site.lang,
        title: site.title,
        subtitle: site.about,
        base: site.url,
        author: site.author,
      },
      stylesheet,
    });
  }

  // Configure markdown-it library with plugins
  let markdown;
  cfg.amendLibrary("md", md => {
    // Store for external use
    markdown = md;

    // Enable GFM features
    md.configure({
      options: {
        linkify: true,
        typographer: true,
      },
    });

    // Enable plugins
    md.use(markdownItDeflist)
      .use(markdownItGithubAlerts)
      .use(markdownItInlineFootnotes)
      .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.headerLink({
          safariReaderFix: true,
          class: "anchor",
        })
      });

    // External links
    //
    // Add `target="_blank"` to external links.
    md.renderer.rules.link_open = function(tokens, idx, options, _env, self) {
      const token = tokens[idx];
      const index = token.attrIndex("href");
      if (index >= 0) {
        // Check if it's an external link
        const href = token.attrs[index][1];
        if (href && !(href.startsWith('/') || href.startsWith('#'))) {
          token.attrSet("target", "_blank");
        }
      }
      return self.renderToken(tokens, idx, options);
    };

    // Alert renderer
    //
    // Use blockquote tags instead of div tags.
    md.renderer.rules.alert_open = function(tokens, idx) {
      const { type } = tokens[idx].meta;
      return `<blockquote class="callout ${type}">`;
    };
    md.renderer.rules.alert_close = function() {
      return "</blockquote>\n";
    };

    return md;
  });

  // Add markdown filter
  cfg.addFilter("markdown", content => markdown.render(content));
  // Inspect filter
  cfg.addFilter("inspect", data => {
    console.log(data);
    return data;
  });
  // Retrieve tags
  cfg.addFilter("tags", data =>
    Object.keys(data).filter(tag => ["all"].indexOf(tag) === -1)
  );
  // Generated timestamp
  cfg.addFilter("date", date =>
    date ? new Date(date) : new Date()
  );
  // Format given date
  cfg.addFilter("dated", (date, fmt) =>
    dayjs(date).format(fmt)
  );
  // Format since date
  cfg.addFilter("since", date =>
    dayjs(date).fromNow()
  );
  // Calc reading time
  cfg.addFilter("readingTime", content =>
    readingTime(content).minutes
  );
  // Take from array
  cfg.addFilter("take", (arr, len) => {
    return arr ? arr.slice(0, len) : [];
  });
  cfg.addFilter("firstParagraph", content => {
    const match = content.match(/<p>(.*?)<\/p>/s);
    return match ? match[1].replace(/<[^>]*>/g, "") : "";
  });
  cfg.addFilter("split", (str, separator) => {
    return str ? str.split(separator) : [];
  });

  // Collect posts
  cfg.addCollection("blog", api => api
    .getFilteredByGlob("src/srv/blog/**/*.md")
    .sort((a, b) => new Date(b.data.created) - new Date(a.data.created))
  );
  // Collect notes
  cfg.addCollection("note", api => api
    .getFilteredByGlob("src/srv/note/*.md")
    .sort((a, b) => parseInt(b.fileSlug, 16) - parseInt(a.fileSlug, 16))
  );

  // Layout aliases for cleaner front matter
  cfg.addLayoutAlias("base", "base.njk");
  cfg.addLayoutAlias("page", "page.njk");
  cfg.addLayoutAlias("post", "post.njk");
  cfg.addLayoutAlias("note", "note.njk");

  // Customize permalinks: output as .html files
  cfg.addGlobalData("permalink", () => {
    return data => {
      // Let CSS files use their own extension
      if (data.page.inputPath.endsWith(".css"))
        return;
      // Remove /srv prefix for content collections
      const stem = data.page.filePathStem.replace(/^\/srv/, "");
      return `${stem}.html`;
    };
  });

  // Watch for changes
  cfg.addWatchTarget("./src/css/");
  cfg.addWatchTarget("./pkg/");
}

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: [
    "md",
    "njk",
    "html",
    "liquid",
    "11ty.js",
  ],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: "njk",

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: "njk",

  // These are all optional:
  dir: {
    input: "src",              // default: "."
    includes: "lib",           // default: "_includes" (`input` relative)
    data: "etc",               // default: "_data" (`input` relative)
    output: "dist",
    layouts: "lib/layout",
  },

  // -----------------------------------------------------------------
  // Optional items:
  // -----------------------------------------------------------------

  // If your site deploys to a subdirectory, change `pathPrefix`.
  //
  // Read more:
  // https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

  // When paired with the HTML <base> plugin
  // it will transform any absolute URLs in your HTML to include this
  // folder name and does **not** affect where things go in the output folder.
  //
  // Read more: https://www.11ty.dev/docs/plugins/html-base/

  // pathPrefix: "/",
}
