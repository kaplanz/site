# site

My personal website. Built with [Eleventy][11ty].

## Usage

Requires [Bun][bun] to be installed.

```sh
bun install        # install dependencies
bun run build      # build production site to ./dist
bun run dev        # start local dev server at localhost:8080
```

## Organization

Source layout is loosely inspired by the [Filesystem Hierarchy Standard][fhs].

```
./
├── eleventy.config.js  # 11ty configuration
├── package.json        # project manifest
├── README.md           # this document
├── ...
├── pkg/                # package plugins
└── src/                # source files
   ├── etc/             # configuration
   ├── lib/             # templates
   │  ├── layout/       # page layouts
   │  └── widget/       # components
   ├── srv/             # page content
   │  ├── ...
   │  ├── blog/         # blog articles
   │  ├── note/         # microblog notes
   │  └── tags/         # tag indices
   └── www/             # static content
      ├── ...
      └── assets/       # static assets
          ├── css/      # stylesheets
          └── img/      # image files
```

## License

Content on this site is licensed under [CC BY-NC-SA 4.0][cc]. Source code is
available under the [MIT License](./LICENSE).

<!--
  Reference-style links
-->

[11ty]: https://www.11ty.dev
[bun]:  https://bun.sh
[cc]:   https://creativecommons.org/licenses/by-nc-sa/4.0/
[fhs]:  https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard
