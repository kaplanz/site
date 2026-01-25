---
title: Colophon
---

This website is built using [Eleventy][11ty]. Pages are written in Markdown and
rendered using a customized [markdown-it][mdit] pipeline. [Bun] is used for
dependency management and packaging.

[11ty]: https://11ty.dev
[bun]:  https://bun.sh
[mdit]: https://markdown-it.github.io

Most of my deployments are hosted on a VPS instance from [Hetzner] (CAX11).
[Caddy] serves content from static directory and also provides a reverse proxy
for endpoints on this domain.

[caddy]:   https://caddyserver.com
[hetzner]: https://hetzner.cloud/?ref=hc4VDgJSNjAJ

All my domains are registered with [Porkbun] and use [Cloudflare] for DNS.

[cloudflare]: https://www.cloudflare.com
[porkbun]:    https://porkbun.com

## License

Content on this site is licensed under [CC BY-NC-SA 4.0][cc40]. Source code is
available under the [MIT License](./LICENSE).

[cc40]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[code]: https://git.zakhary.dev/site
