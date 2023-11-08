---
sort_by: weight
---

## Hi there 👋

<p align="center">
  <i>
    I am an engineering graduate, programmer, and aspiring computer architect
    with a passion for exploring the world of computing.
  </i>
</p>

## About me

```rust
use Area::*;
use Languages::*;
use Skills::*;
use Tools::*;

let zakhary = Person {
  about: Contact {
    name: "Zakhary Kaplan",
    email: "me@zakhary.dev",
    country: "🇨🇦",
  },
  edu: vec![Degree {
    school: "University of Toronto",
    discipline: "Computer Engineering",
    level: Level::Bachelors,
    grad: 2023,
  }],
  area: Hardware | Software,
  work: Developer {
    languages: vec![Assembly, C, Cpp, Lua, Python, Rust, Verilog],
    skills: vec![Algorithms, Compilers, Embedded, Emulation, Fpga],
    tools: vec![Docker, GnuMake, Neovim, Tmux, Unix, Zsh],
    os: "*nix",
    editor: "(neo)?vim",
  },
};
```
