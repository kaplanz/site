---
title: About Me
---

> [!TIP]
>
> If you're looking for a more casual and up-to-date brief on what I'm currently
> doing, check out my [/now](/now) page.

## Interests

### Programming

I first learned to code with Python in 2014. Since then, I've focused more on
low-level/systems programming (specifically C,[^clang] C++,[^cpp] and
Rust[^rust]) and hardware (namely Verilog[^vlog]), though my quick scripting
language of choice is _usually_ still Python. I see no purpose in further
enumerating every language I know, as picking up new syntax is generally
inconsequential compared to understanding language paradigms and how they are
best applied. In brief I most enjoy solving low-level problems on constrained
systems where performance considerations are heavily relevant.

[^clang]: Note the comma instead of a slash for C/C++.
[^cpp]:   Which I have _opinions_ about.
[^rust]:  Which I have <u>opinions</u> about.
[^vlog]:  Although I don't use this at my current job.

Over the years my computer usage has irreversibly shifted towards being
terminal-first for most non-web tasks. Perhaps unsurprisingly, my preferred
procrastination pertains to perfecting personal [dotfiles][dots].

[dots]: https://git.zakhary.dev/dotfiles

### Retro-computing

For the past few years I've been developing
[Rugby][src:rugby], a robust, cycle-accurate Game Boy emulator which has grown
to over 30kloc[^kloc] and runs across several platforms.[^plat] I am extremely
proud of this project and hope to continue to see it grow.

[^kloc]: Kilo (thousand) lines of code.
[^plat]: Native (macOS, Linux, Windows), iOS (SwiftUI), [online][rugby-web]
    (Wasm), and [libretro].

[src:rugby]: https://git.zakhary.dev/rugby
[rugby-web]: https://rugby.zakhary.dev
[libretro]: https://www.libretro.com

## Education

I earned my Bachelor's of Applied Science (BASc) in Computer Engineering from
the University of Toronto from 2018 to 2023. During this degree I proudly
achieved the honour of **Dean's List Scholar**[^dean] for all semesters, and
was conferred with **High Honours**[^high] upon graduation.

[^dean]: Awarded to students who obtained a semester course average of 80%.
[^high]: Awarded for achieving a cumulative weighted average of 87.5% or higher
  over second, third, and fourth years.

## Experience

### Altera (formerly Intel)

I'm currently employed as an FPGA Architect at Altera.[^altera] My team is
primarily responsible for designing and modelling the architecture for our next
generation FPGAs. My specific expertise is in simulation and analysis of wire
delays within the fabric and clock subsystems. In practice, this means a lot of
working on top of (but usually not directly with) SPICE.

[^altera]: Altera was formerly known as Intel's Programmable Solutions Group
  (pre-2025). Before that, it was formerly formerly Altera (pre-2015).

### Qualcomm

Between 2021 to 2022 I completed a 16-month long internship at Qualcomm as a
computer architect, where I worked on Snapdragon's digital signal processor
(DSP). This role mainly focused on the design of a multi-IP prefetching cache
system, for which I created a transaction-level any cycle-accurate performance
model to provide power estimates as part of the architecture's specification. I
was involved in researching high-level synthesis (HLS) workflows for our team to
help improve our time-to-market latency for upcoming IPs.

## Research

During my second year of undergraduate studies, I conducted research at the
University's [iQua Research Group][iqua], working on two separate machine
learning (ML) related projects.

1. Explored the use of the well-established ML models [BERT][bert] and
   [XLNet][xlnet] to extract topics from tweets via natural language processing.
   The key innovation was to utilize the models' word prediction capabilities to
   determine which "key words" within a given text sample (tweet) carry the most
   value towards its overall sentiment and meaning.
2. Researched improvements to the distributed federated learning (FL) algorithm.
   Specifically, FL often suffers from degraded quality of model updates after
   training due to a mixture of low-quality improvements from biased (non-IID)
   clients and poor aggregation techniques that don't take such biases into
   account. I created an open-source [framework][flsim] that supports quickly
   creating specially biased clients on which to train the federated model.

   Using this framework, we were able to classify clients into their
   corresponding bias classes using only their suggested global model updates.
   These classifications allowed us to build and train a reinforcement learning
   model to assign weights to each client to improve upon baseline FL.

   Findings from this project were published and presented at the [IEEE INFOCOM
   2020][icom20] conference.

[bert]:   https://arxiv.org/abs/1810.04805v2
[flsim]:  https://github.com/iQua/flsim
[icom20]: https://infocom2020.ieee-infocom.org/index.html
[iqua]:   https://iqua.ece.toronto.edu
[xlnet]:  https://arxiv.org/abs/1906.08237

### Publications

- Optimizing Federated Learning on Non-IID Data with Reinforcement Learning
  <sup>[[PDF]][icom20:paper][[Talk]][icom20:slides]</sup><br/>
  Hao Wang, <ins>Zakhary Kaplan</ins>, Di Niu, Baochun Li. *IEEE INFOCOM 2020*.

[icom20:paper]:  /papers/infocom20/paper.pdf
[icom20:slides]: /papers/infocom20/slides.pdf

---

Updated on `{{ modified | dated }}`.
