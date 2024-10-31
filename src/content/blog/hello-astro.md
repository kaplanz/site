---
title: I Rewrote This Site (Again)
description: >
  Let's examine the history of this site's development, specifically from the
  POV of my journey exploring web development.
created: 2024-10-30 22:00
tags: [meta, webdev]
---

As yet another systems programmer, I don't pridefully engorge myself with the
bountiful blessing the ever-fruitful web development landscape produces, opting
instead to prefer elegant tools of a more civilized age.[^jedis] As such, I
avoided what I interpreted as a Node.js-infested wasteland, opting for a simple
static site generator to produce my HTML/CSS. (I'm evidently not one of those
masochists who writes it _on their own_.) So what is my site built using now?
Read on to find out![^astro]

## A Brief History

Over the past few years, this site has partaken in (partook?) the traditional
migration route ~flying thousands of kilometres south~ through various static
site generators (SSGs). Let's retrace its history!

- **Mesozoic Era**: Much to my dismay, I didn't grow up in the time where Real
  Programmers had to write their own HTML/CSS from scratch. Also, see my prior
  comment about masochists.
- **Antiquity**: When I first read about how easy it was to get a site online
  with GitHub Pages, I was naïve. I let myself be guided through setting
  everything up through the web portal with [Jekyll]. For what it's worth,
  Jekyll was quick and easy to use with the default provided templates. Over
  time I developed my own template, Thymeless, now long relegated to a junk
  folder somewhere.
- **Enlightenment**: As enlightenment came, I felt compelled to leave Jekyll's
  Ruby-crusted nest and join in the longstanding tradition to herald in a future
  where everything is [rewritten][riir] in The Greatest Programming Language
  That's Ever Lived™.[^sarcasm] Throughout this era, [Zola] reigned supreme,
  powering this site (along with its [theme][wallace]) for close to 3 years.
- **Modernism**: As a brief interlude, around the time I was getting married I
  built us a wedding site to host RSVPs among other things. This was built using
  [axum], and while not technically a part of this site's history, it deserves a
  mention as a part of my own webdev journey.
- **Postmodernism**: Being the certified adult I now am, I've come to realize
  that _maybe_ there's a reason most websites are built with over 100 metric
  megabytes sitting in `node_modules/`. Now that doesn't mean I need to like it,
  but, it certainly is easier than re-inventing 30 years of web development
  every time I want to host something online. This leads us to just yesterday,
  when I finally uploaded the past few months' passive work towards updating
  this site yet again. But this time using [Astro].[^rugby]

## Hello Astro

Coming from SSGs whose entire purpose was to avoid writing any JavaScript at any
cost, migrating to Astro has definitely been... a journey. I learned many
things, chiefly among them being that **I don't actually know JavaScript**. Now
it happens to be that I believe, like many others, that not knowing a
programming language shouldn't be a barrier to using/learning it. In fact,
having a motivating project may be the best way to learn new languages. That
being said, JavaScript has its quirks in terms of how it [coerces][coerce] types
and determines their [truthiness][truth]. Regardless, having a strong background
in C, Rust, and Python it wasn't that hard to pick up the syntax and semantics;
that and a moderate academic understanding of type systems doesn't hurt either.

Next up: the Node.js ecosystem is a microcosm of the developer zeitgeist: shiny
new frameworks come into existence every fortnight and you must constantly be
using the latest bleeding-edge tooling[^irony] otherwise they risk reeking of
obsolescence.[^sass] So much so that even Node.js may be on the out, with
"modern" replacements such as [Bun] and [Deno] vying for attention.

Anyways, this is all to say that searching through an abundance of frameworks
and web development tooling itself was a huge learning process. Starting off I
didn't even know what type of framework to search for![^framework] While I can't
claim I retained most of this knowledge, I at one point understood all [10
Rendering Patterns for Web Apps][render].[^fireship] At the end of all this, I
learned that the tool I need is... an SSG. Wait isn't that what you've been
reading about for the past 5 minutes. Yes. It is. I may have gone down a bit of
a rabbit hole here.

I settled on Astro mostly because it had a nice looking website (ever the
prerequisite for this type of thing) and overall decent documentation. That and
it claimed to support SSG rather than only the newest SSR-with-hydration. By the
way, the reason I'm getting hung on it being an SSG hearkens back to my
experience with GitHub Pages during aforementioned **Antiquity** -- I like the
simplicity of hosting static files, without having to worry about server hosting
and costs. Maybe I'm still naïve.

### Prepare for Trouble

I actually started the migrating to Astro back in _\*checks git log\*_... `Wed
Jul 24 00:00:00 2024 -0400`. So why did it take me this long to get everything
ready? Well--other than the fact that I work a full-time job--you could say I
got caught up in the ~complexity~ simplicity of it all. Allow me to explain:
Astro treats you like a Big Shot, and thus expects you to do certain things
yourself using the aforementioned JavaScript. This is in contrast to in Zola,
where you'd have to dig through arcane documentation to the exact config file
incantation that does exactly what you want to do.

What I perceived as the most prominent growing pain moving to Astro was
reimplementing that beautiful navbar you see at the top here.[^navbar] See I am
attached to this idea of taking inspiration from those cute [Apache] file icons
and using them as a little cursor-navigable filesystem as the navbar. The CSS
styles were easy to migrate. The content however, was trickier.

Unlike in Zola where every file under `content/` magically appears in an HTML
templating language variable, in Astro, I would need to reconstruct this myself.
First, you need to find the files using a good old shell-style glob. It's
tricky: only `.astro` files and friends (like Markdown) placed under
`src/pages/` get rendered. PDFs such as my [resume](/resume.pdf) and other
static files need to be gathered separately. This means I would need to:

1. Use `import.meta.glob` to pull in files I'm interested in displaying.
1. Merge together these separate lists of files, stripping their different path
   prefixes.
1. Reconstruct the hierarchy from the bare filepaths.

But it gets trickier: I can't actually render my blog posts this way! Astro
supports "content collections" as the encouraged mechanism for implementing blog
posts. Overall they're actually pretty convenient to work with other than the
fact that I need to manually sort posts myself every time I call
`getCollection()`. However, this doesn't fit nicely into my model of "glob for
files and manually build hierarchy." For a while I put migrating on hold, until
I ultimately decided to just omit showing blog posts in the nav.

I guess that's why I need to learn JavaScript.

### On Extensibility

After I got the hang of what needs to be implemented myself, things started to
move pretty quickly! I found it pretty easy to use plugins to reimplement choice
features Zola provided as builtins such as auto generating `robots.txt`,
sitemap, and RSS. I even got to play around with extending my Markdown rendering
with easily customizable code syntax highlighting and a custom plugin to mimic
[GitHub's Markdown Alerts][alerts] whose complexity I could probably write an
entire post about.[^callout]

## Conclusion

In hindsight, this entire exercise was just procrastination to starting writing
blog posts. I write these posts in Markdown, so there's no reason I couldn't
have been writing on the old blog until I eventually migrate them over. Either
way, I have a blog now! (And a pretty clean Astro codebase for my website
awaiting future enhancement.)

<!-- Footnotes -->
[^astro]: Keen observers will have recognized that, in fact, this site is now
    built using Astro. How should you have known that? Look at this post's URL.
[^callout]: If you're interesting in seeing how I implemented callouts, check
    out the source code in [`remark-callouts.js`][callout] for some abstract
    syntax tree goodness.
[^fireship]: Much thanks to [Fireship]'s YouTube channel for making 90% of this
    research take 10% of the time it otherwise would have.
[^framework]: It turns out "web framework" is a mostly useless term, as it
    doesn't differentiate at all between the various things you would use a
    framework to do.
[^irony]: The irony is not lost on me that I too am citing my jumping between
    web frameworks as the thesis of this post!
[^jedis]: A reference to tmux, vim, and zsh. Obviously.
[^navbar]: If you're reading this in the future after I've ~inevitably~ moved to
    another framework or redesigned the navbar, this part may not make sense.
[^rugby]: As an honourable mention, my Game Boy emulator has a playable
    [demo][rugby] (powered by Rust compiled to [Wasm]) with a frontend written
    in [Svelte].
[^sarcasm]: If you can't sense (or don't appreciate) my sarcasm then perhaps
    you're reading the wrong blog. Also, the language is Rust.
[^sass]: I apparently didn't get the memo that people don't use [Sass] anymore.

<!-- Reference-style links -->
[alerts]:   https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/
[apache]:   https://www.apache.org/icons/
[astro]:    https://astro.build
[axum]:     https://github.com/tokio-rs/axum
[bun]:      https://bun.sh
[callout]:  https://github.com/kaplanz/site/blob/main/pkg/remark-callouts/index.js
[coerce]:   https://stackoverflow.com/questions/19915688/what-exactly-is-type-coercion-in-javascript
[deno]:     https://bun.sh
[fireship]: https://fireship.io
[jekyll]:   https://jekyllrb.com
[render]:   https://www.youtube.com/watch?v=Dkx5ydvtpCA
[riir]:     https://transitiontech.ca/random/RIIR
[rugby]:    https://rugby.zakhary.dev
[sass]:     https://sass-lang.com
[svelte]:   https://svelte.dev
[truth]:    https://stackoverflow.com/questions/35642809/understanding-javascript-truthy-and-falsy
[wallace]:  https://git.zakhary.dev/wallace
[wasm]:     https://webassembly.org
[zola]:     https://www.getzola.org
