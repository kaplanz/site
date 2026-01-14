---
title: Slashpages
---

> [!TIP]
>
> Slash pages (à la [slashpages.net][slash]) are common pages you may across the
> [IndieWeb][indie].

[slash]: https://slashpages.net
[indie]: https://indieweb.org

Think of this page as a more concise and human-friendly [sitemap](/sitemap.xml)
of various pages of interest.

# Pages

[/about](/about)
: About me: interests, projects, education, and work.

[/blog](/blog/)
: Blog where I occasionally post.

[/books](/books)
: My reading timeline and book lists.

[/colophon](/colophon)
: About the stack used to build this website.

[/contact](/contact)
: What's the best way to reach out.

[/links](/links)
: Pages I've bookmarked from across the internet.

[/note](/note/)
: Micro-blog of miscellaneous short-form posts.

[/now](/now)
: What I'm focused on at this moment. Updated often.

[/privacy](/privacy)
: Policy for how this site respects your privacy.

[/uses](/uses)
: Stuff (mostly tech) that I use daily.

<style>
  dl {
    dt {
      display: flex;
      align-items: center;

      font-family: var(--mono);
      font-weight: lighter;
      font-size: 1.5em;

      margin-block-start: 1em;

      a {
        text-decoration: none;
      }

      &::after {
        content: "";
        flex-grow: 1;
        border-bottom: 1px dashed var(--foregd);
        margin-inline-start: 8px;
      }
    }

    dd {
      font-family: var(--serif);
      font-style: italic;

      margin-block-end: 1em;
      margin-inline: 0;
    }
  }
</style>
