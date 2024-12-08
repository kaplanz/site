---
layout: ../../layouts/page.astro
title: Work
---

## Altera (formerly Intel)

I'm currently employed as an FPGA Architect at Altera.[^altera] My team is
primarily responsible for designing and modelling the architecture for our next
generation [Field Programmable Gate Arrays][fpga] (FPGAs). My specific expertise
has most recently been in automating the simulation and analysis wire delays
within the fabric and clock subsystems. In practice, this means a lot of working
on top of (but usually not directly with) [SPICE].

[^altera]: Altera was formerly known as Intel's Programmable Solutions Group
    (pre-2025). Before that, it was formerly formerly Altera (pre-2015).

As an architecture team, we have the privilege of working on the most bleeding
edge designs; this gives us the opportunity to dream big about what enhancements
we can put into our next silicon. It's exciting to see how designs I will have
worked on will contribute to the future of FPGA computing.

## Qualcomm

Between my third and fourth year of studies, I had the amazing opportunity to
complete a 16-month long internship at Qualcomm as a computer architect.
During this time, I've had the opportunity to solve interesting and challenging
problems working on the [Snapdragon]'s digital signal processor (DSP).

In this role, I diagrammed and reasoned about the design of a multi-client cache
system, after which I created a functional and transaction-level cycle-accurate
performance model of the cache. This model is being used to provide power
estimates as part of the architecture's specification, and will be used together
with detailed schematics in the ASIC design of this module.

My latest project involves researching various high-level synthesis (HLS)
workflows for our team to help improve the time-to-market latency within our
team.

I am especially grateful to my supervisors for all the experience, guidance, and
wisdom they have provided me throughout my internship!

## Geomechanica

In the summer of 2020, I worked as a software developer for
[Geomechanica][geomecha], an engineering company that develops simulation
software for rock mechanics. During this time, I had the opportunity to solve
complex problems developing features for Irazu, their geomechanical simulation
software.

Some of the most interesting projects I worked on involved the design and
creation of various tools to edit and make CAD models to run within the
simulator. I got to apply linear algebra to solve and render complex
visualizations of the engine's outputs, and worked on improving the
user-experience managing project creation.

As well, I learned hands-on about how software-enforced licensing works and
implemented several improvements to the existing licensing system. These
considerations have been tremendously helpful in furthering my general
understanding of computer security.

<!-- Reference-style links -->
[fpga]:       https://en.wikipedia.org/wiki/Field-programmable_gate_array
[geomecha]:   https://www.geomechanica.com
[snapdragon]: https://en.wikipedia.org/wiki/Qualcomm_Snapdragon
[spice]:      https://en.wikipedia.org/wiki/SPICE
