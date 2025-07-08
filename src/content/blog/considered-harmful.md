---
title: Harmful Practices Considered Best
description: >
  A mild critique of the nature of "best practices" and "considered harmful"
  manifestos.
created: 2024-11-18 18:45
updated: 2025-07-07 23:00
tags: [dev]
---

I recently came across Martin Tournoij's [Against Best Practices][arp242], and
while I generally agree with his post's thesis, I had my own thoughts on the
matter, so here they are.

You don't need to look hard within the developer discourse to come across a
[_Considered Harmful_][harmful] manifesto,[^harmful] the most famous of which is
likely from legendary computer scientist [Edsger Dijkstra][dijkstra]. Another
common analogue of these in the zeitgeist are "best practices," which are a
similarly opinionated codex of such laws,[^laws] often critically lacking the
former's justification. While I feel like both of these have their place, it's
important they are contextualized, for without context their intention is easily
distorted.

[^harmful]: That is to say, an essay, paper, or blog post arguing some feature
    or tool shouldn't be used _within a specific context_.
[^laws]: "The code is more what you'd call 'guidelines' than actual rules."

## Best Practices

When starting out with any new technology, it's easy to make what an expert
would consider to be rookie mistakes. That's a natural part of any learning
process, and there's nothing wrong with that. Best practices are meant to help
steer you away from these beginner pitfalls. I like to think of them like
training wheels on a bicycle: they're critically helpful when starting off, but
you eventually will need to learn to ride on your own. This means best practices
should really not be taken as gospel, rather, they serve as a learning aid which
you should eventually outgrow.

And just to be clear, I'm not claiming that strict adherence leads to bad
code.[^irony] Rather, I argue that overly relying on best practices can prevent
proper understanding of the underlying reasons from which they arose. This in
turn hinders your learning. A nice corollary would be that you can easily learn
the idiosyncrasies of a tool by studying the reasoning behind best practices.

[^irony]: Ironically, claiming this in and of itself could be considered a best
    practice.

## Considered Harmful

Manifestos alleging specific language features are problematic suffer from a
similar issue: their intended outcome often precedes justification.[^outcome]
They do this by snowcloning a sensationalized headline as a mnemonic device.
It's easy to avoid using `goto` when your brain associates the keyword with
"considered harmful." Obviously when such essays are written in good faith, they
expressly defend their thesis with sound arguments. But this format doesn't
explicitly link the effect (e.g. don't use `goto`) with the cause (only _misuse_
leads to bad code).

And I absolutely have fallen for this trap! In fact, I only actually read the
(in)famous [Go To Considered Harmful][goto] while writing this post. Let's
properly examine Dijkstra's arguments to better understand where we can (and
even _should_) use `goto`.

[^outcome]: What I mean by this is the thesis of _Considered Harmful_ is to
    steer away from a feature _more so_ than it is to justify why that feature
    leads to problematic behaviour.

### Case Study: Goings and Toings

The underlying intentions are noble and justified, summarily: `goto` statements
can lead to spaghetti code. While I wouldn't dare argue with Dijkstra on
this,[^argue] I think it's important to understand the context of his arguments.
My understanding of Dijkstra's claim is primarily centred on the inherent
obfuscation associated with unstructured jumps in code. This is among the
reasons that assembly language is particularly challenging for those with
experience only in high-level languages.[^hlls] In Dijkstra's own words:

[^argue]: Not that one shouldn't feel comfortable disagreeing with a _gadol
    hador_,[^gedolim] but doing so without proper research and carefully
    constructed arguments is foolish.
[^gedolim]: A Hebrew term that refers to one considered to be among the greatest
    of their generation.
[^hlls]: High-level language is admittedly a loaded term, so for now let's just
    agree it means at least as abstracted as C. This would include C++,
    JavaScript, Python, Rust, and other similar medical diagnoses you wouldn't
    wish on your enemies.

> We should do our utmost to shorten the conceptual gap between the static
> program and the dynamic process.

Here, "static program" refers to what's actually written in code, and "dynamic
process" is the actual execution path throughout that code. This is actually a
pretty powerful idea. Code as written is read very differently by a programmer
(statically) than it is by a computer (dynamically). It's very easy for a human
to see a function call and understand it as a statement without looking at the
function body. You may implicitly know that the code will necessarily jump into
and out of the function, but that is unimportant to understanding the calling
code.

With `goto`-riddled code, however, humans are forced to reason about every
branch. This mental context-switch takes away from understanding what the code
is trying to accomplish.

#### Example 1

Here's an admittedly simple example.[^example1]

[^example1]: If a reader has a better example, let me know and I'll update this!

```c
#include <stdio.h>
#include <string.h>

// Intentionally obfuscated name!
int foo(const char *str, const char *sub) {
    // No need to count if the string is empty
    if (strlen(sub) == 0)
        goto done;

    // Initialize our counter
    int count = 0;

next:
    // Search for the substring
    str = strstr(str, sub);
    // If we didn't find it anymore, we're done
    if (str == NULL)
        goto done;
    // Increase our count
    count++;
    // Move past this occurrence
    str += strlen(sub);
    // Continue the search
    goto next;

done:
    return count;
}

int main(void) {
    // By now you may have taken the time to parse and understand what `foo()`
    // does. At this function call site, we ask:
    //
    // How many times does "llo" occur in the provided string?
    printf("matches: %d\n", foo(
        "Hello, my fellow, why do you bellow?",
        "llo"
    ));
}
```

Did you spot the problem? That's right! Line 8 skips initializing `count` if the
string is empty, but we still `return count` on line 27. This is an easy pitfall
`goto` enables: skipping past a variable's initialization.

Now I can already see your comments about how "this is why we have
loops,"[^smart] but that's not the point! Situations like this can arise through
refactorings by multiple developers over several years. The underlying problem
is that every reader of this code shouldn't have to mentally follow every branch
in order to reason about if the code is sound. This instead should be
structurally guaranteed by the language's control flow constructs.

[^smart]: Or if you're a smart-ass, "modern C compilers will warn me of this and
    even fix it."

Could this be why Dijkstra claims that "the **go to** [sic] statement should be
abolished from all 'higher level' programming languages"? One need only read his
following parenthetical to see a hint of the context in which his claim is
valid, namely in "everything except, perhaps, plain machine code." Aha! So
Dijkstra admits that in certain contexts (namely assembly language) `goto`-like
structures are acceptable, even necessary.

#### Example 2

A great example of where `goto` should be used is in error handling. Again using
C, it might look something like this.[^example2]

[^example2]: I know it's long, but bear with me. You only really need to focus
    on the use of `goto`.

```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    FILE *file = NULL;
    char buffer[4096];
    const char *error = NULL;

    // Ensure an input file was provided
    if (argc == 1) {
        error = "missing input file";
        goto failure;
    }

    // Open the file
    file = fopen(argv[1], "r");
    if (file == NULL) {
        error = "could not open file";
        goto failure;
    }

    // Read the file line by line
    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        // Print each line to the console
        printf("%s", buffer);
    }

    // Check for reading errors
    if (ferror(file)) {
        error = "could not read file";
        goto cleanup;
    }

cleanup:
    // Handle errors and close the file if necessary
    if (file != NULL) {
        if (fclose(file) != 0) { // fclose can fail
            error = "could not close file";
            goto failure;
        }
    }

    // Exit if any critical error occurred
    if (error != NULL) {
        goto failure;
    }

    // Otherwise, return gracefully
    return EXIT_SUCCESS;

failure:
    fprintf(stderr, "error: %s\n", error);
    return EXIT_FAILURE;
}
```

This program prints the provided file. While admittedly simple, there are
several points of failure after which we would want to clean up and exit with an
error message. Here, `goto` is a great tool, as it prevents repetition of
cleanup code by instead jumping to the unhappy path whenever an error occurs.
Unlike spaghetti code which jumps around aimlessly, this is much easier to
reason about.[^noinit]

[^noinit]: Although you absolutely still could skip past the initialization of
    `char *error` if you're not careful with your jumps.

This takes us to what I would consider the most salient point in the essay:

> The **go to** [sic] statement as it stands is just too primitive.

I somewhat alluded to this earlier with a comment about how _Example 1_ is just
a loop. Given we have loops as a language construct, why not just use them!? If
we changed the code to loop `while (str != NULL) { ... }`, it would be trivially
easy to understand the jumps in the program. _Example 2_ could be similarly
"fixed" with a `defer` statement to ensure the file gets closed on the unhappy
path,[^defer] and this may be more clear then `goto cleanup`.

[^defer]: While C doesn't support `defer` as a language construct today, that
    too [might change][defer] someday in the future.

In summary, Dijkstra's argument is really that `goto`'s lack of implicit
semantics make its use challenging. I would argue this is the true thesis of his
seminal essay. However the title obfuscates this as a thesis, as the _Considered
Harmful_ movement it inspired seems mostly concerned with discouraging a
feature's use by any means.

## Conclusion

I think the underlying concept I'm getting at is **idiomaticity**. Ultimately,
both "best practices" and _Considered Harmful_ essays are designed to help a
language community codify what idiomatic code looks like to them. When framed
this way, it becomes less about strict rules and more about ideals. This works
well because ideals don't imply strict adherence while allowing room for
dismissal where applicable through critical justification.

Crucially, idiomatic code is context dependent![^dialect] In Rust, for example,
different idioms for error handling would be applied to application and library
crates. Applications may reasonably opt to `panic!`, `unwrap`, or return ad-hoc
`anyhow::Error`s with a simple message.[^unwrap] Libraries, however, generally
shouldn't ever panic (if they do, that's usually a bug) instead returning errors
that could be inspected and handled by application code (e.g. an enum with
variants for different error causes).

[^dialect]: You might have heard this referred to as a dialect of a language.
[^unwrap]: See Andrew Gallant's thoughts about how [using unwrap in
    Rust][unwrap] is idiomatic.

All that said, rather than promoting rote adherence to practices or manifestos,
I believe emphasis in understanding language idioms leads to a stronger and more
memorable message.

<!-- Reference-style links -->
[arp242]:   https://www.arp242.net/best-practices.html
[defer]:    https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3199.htm
[dijkstra]: https://en.wikipedia.org/wiki/Edsger_W._Dijkstra
[goto]:     https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf
[harmful]:  https://en.wikipedia.org/wiki/Considered_harmful
[unwrap]:   https://blog.burntsushi.net/unwrap/
