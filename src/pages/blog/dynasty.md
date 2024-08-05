---
title: Introducing Dynasty
date: 2023-11-12 19:00:00
template: post.html
taxonomies:
  categories: [intro, projects]
  tags: [cli, dns, rust, web]
---

I'm thrilled to share with you my very first open-source project in Rust,
[Dynasty][dynasty] ([repo][repo]) – a dynamic DNS client designed for
simplicity and extensibility.

<!-- more -->

#### What is Dynasty?

Dynasty is a lightweight and user-friendly dynamic DNS client, built for anyone
looking to effortlessly manage their DNS records. It's simple to use and
configure, and can be easily extended to support new DNS providers.

It's written in Rust so you know it'll be blazingly 🚀 fast (as a Canadian, I
am genuinely sorry about that).

#### Elevator pitch

IMHO something like a DDNS client (probably running on a Raspberry Pi
somewhere) should be easy to set up, and unopinionated in how and when it's run
(daemon, cron, etc.).

Configuring Dynasty is as easy as:

```toml
resolver = "dig @resolver4.opendns.com myip.opendns.com +short"

[daemon]
timeout  = "24h"

[[services]]
provider = "Cloudflare"
token    = "fkdzsjxnfi345wfni5dnfcdkncka4_dw4n44f_ce"
zone     = "0123456789abcdef0123456789abcdef"
record   = "fedcba9876543210fedcba9876543210"
```

#### Why did I build this?

While this isn't exactly anything particularly revolutionary or new, I built
this project because I was frustrated with my Internet provider constantly
changing my public IP. (I know most providers don't guarantee IP stability, but
in my past experience I would only need to update DNS entries every month or
so, as opposed to my new provider who changes it every other day.)

With ddclient now unmaintained, I couldn't find a de-facto replacement that
wasn't a nightmare to configure. Since DDNS isn't exactly rocket science
(obligatory 🚀🚀🚀), I decided to build my own tool for the job.

#### How is it "extensible"?

This is probably a good time to come clean: as I use Cloudflare for all my
self-hosted DNS records for Internetz stuff, that's the only provider I added
support for. *But*, I wanted it to be easy to add support later on for other
DNS providers, so Dynasty is written in a provider-agnostic way. I also tried
to use Rust idioms all the other cool kids use these days.

Providers can be added by adding and connecting a submodule under
`dynasty::sv`. It should be pretty self-explantory, but I'm intending to better
document the process soon regardless because self-documenting code is a bit of
an oxymoron (aside, oxymoron is a Rust crate name waiting to be used).

#### Contributions welcome!

If you find Dynasty interesting, please do contribute! I'm always looking to
learn how to improve my projects.

<!-- Reference-style links -->
[dynasty]: https://zakhary.dev/dynasty
[repo]:    https://github.com/kaplanz/dynasty
