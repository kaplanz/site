---
title: GBC Boot Animation 88×31 Web Button
created: 2026-01-04 23:30
tags: [game-boy, 88x31, magick]
---

Like many other 90s styles coming back in fashion, I've been seeing those retro
[88x31] web buttons on more personal websites these days. What a throwback.
Naturally, I scoured the internet to find buttons to add to my footer (see
below). Since I couldn't find a Game Boy one that I liked, obviously I had to
make my own.

There's only one problem: I'm not patient (read: talented) enough to make the
art myself.

[88x31]: https://indieweb.org/88x31

## The Concept

My idea was to use the boot animation from the Game Boy Color placed inside the
traditional grey frame. Something like this:

<figure>
  <img src="/img/usr/8304eeab.png" alt="Mock-up of the web button"/>
  <figcaption>
    A rough mock-up of the web button.
  </figcaption>
</figure>

Not too complicated, right? So you'd think.[^mock]

[^mock]: Wait just a second. Surely it can't be that hard to make the animation
    if I already have the mock-up, right? Well, I kinda cheated and used the
    final result to make that.

## Animating

First, we've got to find a way to export the animation from boot ROM. The
easiest way I could think of to do that was to play it in an emulator[^emu] and
save screenshots of each frame individually. Well, in order to do that we need a
way to stop the emulator at each frame. Thankfully, the emulator I used has
breakpoints.

[^emu]: Regrettably my emulator [Rugby] doesn't (yet) support Game Boy Color,
    so I used the fantastic [SameBoy] for this next part.

[rugby]:    https://rugby.zakhary.dev
[sameboy]:  https://sameboy.github.io

So, where should those breakpoints go? Time for a quick crash course:

The animation is programmed into the Game Boy's boot ROM in GBZ80 assembly. This
is proprietary code written by Nintendo that powers up the system and validates
the cartridge before handing off execution to the game. Thankfully, some smart
people have done the hard work of (1) dumping, (2) disassembling, and (3)
labelling the [boot ROM][boot-rom] for us.[^fair]

[^fair]: I feel pretty comfortable calling my use of the boot ROM in this
    project "fair use."

[boot-rom]: https://gist.github.com/drhelius/6063265

For each Game Boy frame, there's a period of time where the LCD idles before
drawing the next frame. This is called [vblank]. Taking a look at the
disassembly, we can see where vblank occurs:

[vblank]:   https://en.wikipedia.org/wiki/Vertical_blanking_interval

```asm
; =============== S U B R O U T I N E =======================================

; Wait until LCD VBlank Interrupt is flagged.
;
; Input: None.
; Output: None.

Wait_for_next_VBLANK:
    push    hl
    ld  hl, $FF0F
    res 0, [hl]

_wait_vblank_loop:
    bit 0, [hl]       ; wait until hardware sets the vblank flag (bit 0 of FF0F)
    jr  z, _wait_vblank_loop
    pop hl
    ret
; End of function Wait_for_next_VBLANK
```

Using the debugger, we can see that this function is called from the following
code:

```asm
sub_0291:
    call    Wait_for_next_VBLANK
    ; -- snip --
```

As we can see from the generated label `sub_0291`, this block probably lives at
address `$0291`. Putting a breakpoint here and stepping into the function
reveals the address of `Wait_for_next_VBLANK` to be `$0211`. After a quick reset
and setting the breakpoint, we can step through each frame of the animation.

This next part was a bit tedious: I repeatedly `continue`d the debugger, taking
an emulator screenshot at each frame.[^capture] Once that was done, I had 175
screenshots at 160x144 saved as PNGs on my desktop. Using some quick ✨
`magick`[^magick] ✨, I collected these into a GIF[^gif] with this command:

[^capture]: Using `⌘S` in SameBoy will capture a screenshot using the emulated
    LCD framebuffer. This will be at the true LCD resolution, completely
    independent of my laptop's display resolution.
[^magick]: If you haven't heard of the CLI image processing tool
    [ImageMagick][magick], I highly recommend checking it out.
[^gif]: Pronounced /dʒɪf/.

[magick]: https://imagemagick.org

```zsh
magick -delay 1.6742706299 -loop 0 *.png(n) animation.gif
```

Of note is the delay time, ~0.0167s[^delay], and the zsh-ism `*.png(n)` to sort
the expanded glob.

[^delay]: `70,224 [#/frame] ÷ 4,194,304 [#/sec] ~= 0.0167427 [sec/frame]`

Anyways, here's what it looks like:

<figure>
  <img src="/img/usr/d3dba7d5.gif" alt="Game Boy Color boot animation"/>
  <figcaption>
    Captured animation from the Game Boy Color boot ROM.
  </figcaption>
</figure>

## Making Art

Now that we've ~copied Nintendo's homework~ made our Game Boy animation, it's
time to reshape it into an artistic web button masterpiece.

### Cropping

Next up we've got to crop the animation to the desired 88x31. Let's load up the
GIF to see how big the logo is. I used [Aseprite] for this, but really any
application that lets you count pixels in an image will do. Doing this, we see
the "Game Boy" text logo is... 127x22 pixels wide. Hmm. That's too big to fit
into an 88x31 button, but I guess that makes sense considering the Game Boy
Color's screen is 160x144 pixels. It'll have to be scaled down later.

[aseprite]: https://www.aseprite.org

Measuring the logo's starting location to be `(x: 16, y: 48)`, we can now crop
away. Cropping a GIF sounds like it should be a lot of work, but it can be
easily accomplished on the CLI with, you guessed it, `magick`:

```shell
magick animation.gif -crop 127x22+16+48 +repage cropped.gif
```

<figure>
  <img src="/img/usr/76e784fc.gif" alt="Animated Game Boy logo"/>
  <figcaption>
    Cropped animation showing the Game Boy logo.
  </figcaption>
</figure>

### Scaling

The cropped logo needs to be scaled to fit into 88x31. Say it with me folks.
`magick`:

```shell
magick cropped.gif -resize 82x scaled.gif
```

This scales (resizes) the GIF to be 82 pixels wide while maintaining the aspect
ratio, the result being 82x14. I chose 82 pixels wide specifically since that'll
allow us to fit for the next stage.

<figure>
  <img src="/img/usr/a68bd208.gif" alt="Animated Game Boy logo (downscaled)"/>
  <figcaption>
    Scaled animation showing the (smaller) Game Boy logo.
  </figcaption>
</figure>

### Framing

Several of the 88x31 buttons I found online have a common frame with a
2-pixel-wide border. It looks like this:

<figure>
  <img src="/img/usr/1782903c.png" alt="Blank 88x31 template with centre"/>
  <img src="/img/usr/93b415d3.png" alt="Empty 88x31 frame without centre"/>
  <figcaption>
    Common 88x31 button frame, with and without the centre.
  </figcaption>
</figure>

To apply this frame to the scaled animation, we'll need to do the following:

1. Centre the scaled animation into a 88x31 space;
2. Fill in the newly added space with grey;
3. Add the border frame on top of the animation.

Hopefully you know the drill by now:

```shell
magick scaled.gif \
    -gravity center -background "#C0C0C0" -extent 88x31 \
    -coalesce null: frame.png -layers composite \
    framed.gif
```

Aaaand we're done! Let's take a look at the finished product in all its glory.

<figure>
  <img
    src="/img/usr/5b782a58.gif"
    alt="Framed web button with white surrounding the logo"
  />
  <figcaption>
    Something doesn't look quite right here.
  </figcaption>
</figure>

Wait, what's that ugly white square doing there? Oh, right. The animation had a
white background. Gotta fix that I guess.

### Fixing That

This is actually quite straightforward. Removing the white background is easy,
although if we do it with what we currently have there ends up being undesirable
artifacts caused by the prior scaling.

```shell
magick framed.gif -fill "#C0C0C0" -opaque "#FFFFFF" fixed.gif
```

<figure>
  <img
    src="/img/usr/bead6a98.gif"
    alt="Animation with white background removed that has scaling artifacts"
  />
  <figcaption>
    Replacing the white background at this stage doesn't really work.
  </figcaption>
</figure>

The trick here is to replace the white background before scaling. Here's also a
really great opportunity to fully show off how powerful ImageMagick's transform
pipeline can be. Going back to our uncropped animation, we can apply all
previous steps at once like so.

```shell
magick animation.gif \
    -crop 127x22+16+48 +repage \         # crop 127x22 logo from animation
    -fill "#C0C0C0" -opaque "#FFFFFF" \  # NEW: replace background with grey
    -resize 82x \                        # scale animation to 82x14
    -gravity center \                    # place logo in centre
    -background "#C0C0C0" \              # use grey for added background
    -extent 88x31 \                      # expand animation to 88x31
    -coalesce null: frame.png \          # apply frame border
    -layers composite \                  # composites each frame
    fixed.gif
```

It's amazing that we can do all this in a single command! Let's admire our
finished product.

<figure>
  <img
    src="/img/usr/06a4ef60.gif"
    alt="Game Boy logo animation with ghosting on fadeout"
  />
  <figcaption>
    Did anyone else see that ghost?
  </figcaption>
</figure>

## Exorcism

As we all know, the final stage of any good art project is excising tormented
apparitions from our glorious creation!

See that shadow of the logo that appears as it fades away? That's called
ghosting, and is caused by the original animation's fade going to white instead
of the grey we've chosen as our new background colour.

### Remapping

Fixing this is going to be a little more tricky than it was for the compression
artifacts above. In order to fix this, we'll need remap the transition colours
so that the logo’s blue-to-white transition instead fades to grey.

To do this, we'll first need a way to identify all those transition colours.
Extracting the frames of the animation will allow us to analyze their colours in
a histogram:

```shell
# Extract original animation's frames
mkdir frames
magick animation.gif frames/%03d.png

# Analyze each frame's colours
for frame in frames/*(n); do
    echo "frame: $frame"
    magick "$frame" -format %c histogram:info:
done
```

Running this script will produce a ton of output. Let's take a look at some
samples near the end.

```
-- snip --
frame: frames/160.png
           209: (232,232,232) #E8E8E8 grey91
          1560: (232,238,255) #E8EEFF srgb(232,238,255)
         21271: (255,255,255) #FFFFFF white
frame: frames/161.png
           209: (243,243,243) #F3F3F3 srgb(243,243,243)
          1560: (243,246,255) #F3F6FF srgb(243,246,255)
         21271: (255,255,255) #FFFFFF white
frame: frames/162.png
           209: (247,247,247) #F7F7F7 grey97
          1560: (247,249,255) #F7F9FF srgb(247,249,255)
         21271: (255,255,255) #FFFFFF white
frame: frames/163.png
            29: (250,251,255) #FAFBFF srgb(250,251,255)
         23011: (255,255,255) #FFFFFF white
frame: frames/164.png
         23040: (255,255,255) #FFFFFF gray(255)
frame: frames/165.png
         23040: (255,255,255) #FFFFFF gray(255)
frame: frames/166.png
         23040: (255,255,255) #FFFFFF gray(255)
-- snip --
```

It's not immediately obvious what we're looking for here, but we can see that by
frame 164 there's only one colour. That corresponds to the whiteout at the end
of the animation. Looking a few frames before, we consistently see 209 frames
helpfully labelled as grey, and 1560 frames in some other colour. Conspicuously,
that other colour only varies in red and green, but remains fully blue.

<figure>
  <img src="/img/usr/d3dba7d5.gif" alt="Game Boy Color boot animation"/>
  <figcaption>
    Let's take another look at that captured animation.
  </figcaption>
</figure>

Matching that up with the animation, those 1560 pixels must be the fading logo.
With a little Unix wizardry[^bash] we can extract the colour hex codes from this
output to obtain an exact list of the blue-to-white transition colours![^f163]

[^bash]: `grep 1560 output.txt | awk '{ print $3 }' | uniq`
[^f163]: I'm not entirely sure why frame 163 has 29 seemingly random light-blue
    pixels, but I've manually added `#FAFBFF` to the list to capture them as
    well.

<details>
  <summary>Fade colours (blue to white)</summary>

  ```
  #006BFF
  #066CFF
  #0C6DFF
  #146FFF
  #1C71FF
  #2474FF
  #2D77FF
  #387CFF
  #4281FF
  #4C86FF
  #588DFF
  #6494FF
  #719CFF
  #7DA3FF
  #89ABFF
  #95B3FF
  #A1BBFF
  #ACC3FF
  #B6CAFF
  #C0D1FF
  #CAD8FF
  #D2DEFF
  #DAE4FF
  #E1E9FF
  #E8EEFF
  #F3F6FF
  #F7F9FF
  #FAFBFF
  #FFFFFF
  ```
</details>

From this list, the logo fade transitions from `[#006BFF, #FFFFFF)`.[^ninc]
Since we're updating the background colour to `#C0C0C0`, we'll need a way to
modify the transition colours to instead fade to that shade of grey.
Functionally, for each colour we (1) compute how far along the transition we
are, then (2) use this value to re-compute an equivalent transition colour in
the desired fade range.

[^ninc]: This is a non-inclusive range.

Here's where I'll admit my shame: by this point I was getting lazy and didn't
feel like using my brain to write my own colour interpolation. So I turned to
the AI overlords to do this work for me.

<details>
  <summary>Interpolation script (AI slop)</summary>

  ```python
  def hex_to_rgb(hex):
      """Convert hex string (#RRGGBB) to RGB tuple."""
      return tuple(int(hex.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))

  def rgb_to_hex(rgb):
      """Convert RGB tuple to hex string (#RRGGBB)."""
      return "#{:02X}{:02X}{:02X}".format(*rgb)

  def remap_color(color, start_old, end_old, start_new, end_new):
      """Remap a color from old range to new range."""
      r_old, g_old, b_old = start_old
      r_end_old, g_end_old, b_end_old = end_old
      r_new_start, g_new_start, b_new_start = start_new
      r_new_end, g_new_end, b_new_end = end_new
      r, g, b = color

      # Compute relative position t in old range
      t = (
          (r - r_old) / (r_end_old - r_old) if r_end_old != r_old else 0
      )  # using red as representative; you could average channels instead

      # Map to new range
      r_mapped = round(r_new_start + t * (r_new_end - r_new_start))
      g_mapped = round(g_new_start + t * (g_new_end - g_new_start))
      b_mapped = round(b_new_start + t * (b_new_end - b_new_start))

      # Clamp values between 0-255
      r_mapped = min(max(r_mapped, 0), 255)
      g_mapped = min(max(g_mapped, 0), 255)
      b_mapped = min(max(b_mapped, 0), 255)

      return (r_mapped, g_mapped, b_mapped)

  # Define old and new ranges
  start_old = hex_to_rgb("#006BFF")
  end_old   = hex_to_rgb("#FFFFFF")

  start_new = hex_to_rgb("#006BFF")
  end_new   = hex_to_rgb("#C0C0C0")

  # Process file
  with open("color.txt", "r") as f:
      colors = [line.strip() for line in f if line.strip()]

  fixed_colors = []
  for hex_color in colors:
      rgb = hex_to_rgb(hex_color)
      new_rgb = remap_color(rgb, start_old, end_old, start_new, end_new)
      fixed_colors.append(rgb_to_hex(new_rgb))

  # Write output
  with open("remap.txt", "w") as f:
      f.write("\n".join(fixed_colors))

  print("Finished! Fixed colors saved to remap.txt")
  ```
</details>

Looks great, I'm sure it works fine.

<details>
  <summary>Fade colours (blue to grey)</summary>

  ```
  #006BFF
  #056DFE
  #096FFC
  #0F72FA
  #1574F8
  #1B77F6
  #227AF4
  #2A7EF1
  #3281EF
  #3984EC
  #4288E9
  #4B8CE6
  #5591E3
  #5E95E0
  #6799DD
  #709DDA
  #79A1D7
  #82A4D5
  #89A8D2
  #91ABD0
  #98AECD
  #9EB1CB
  #A4B4C9
  #A9B6C7
  #AFB8C6
  #B7BCC3
  #BABDC2
  #BCBEC1
  #C0C0C0
  ```
</details>

Huh. This looks surprisingly correct. Adding in `#FFFFFF` to the original list
and running again, we see that it does indeed get transformed to `#C0C0C0`. As
an additional sanity check, here are generated images of the palettes we intend
to swap.

<figure>
  <img
    src="/img/usr/78b8d029.png"
    alt="Palette from blue to white"
    width="112"
  />
  <img
    src="/img/usr/3d0b4004.png"
    alt="Palette from blue to grey"
    width="112"
  />
  <figcaption>
    Comparison of original and replacement colour palettes.
  </figcaption>
</figure>

All that's left is to perform the colour substitution. Admittedly, I was having
some trouble doing this using ImageMagick's `-clut`, so I arrived at a much less
elegant solution: use a series of `-fill`/`-opaque` to manually replace each
colour. Adding the following to the bottom of the Python script, we can at least
automate writing all that out.

```python
# Generate ImageMagick command
cmd = ""
for old, new in zip(colors, fixed_colors):
    cmd += f' -fill "{new}" -opaque "{old}" \\\n'

print(f"Generated ImageMagick replacement:\n{cmd}")
```

<details>
  <summary>Generated replacement options</summary>

  ```
  -fill "#006BFF" -opaque "#006BFF" \
  -fill "#056DFE" -opaque "#066CFF" \
  -fill "#096FFC" -opaque "#0C6DFF" \
  -fill "#0F72FA" -opaque "#146FFF" \
  -fill "#1574F8" -opaque "#1C71FF" \
  -fill "#1B77F6" -opaque "#2474FF" \
  -fill "#227AF4" -opaque "#2D77FF" \
  -fill "#2A7EF1" -opaque "#387CFF" \
  -fill "#3281EF" -opaque "#4281FF" \
  -fill "#3984EC" -opaque "#4C86FF" \
  -fill "#4288E9" -opaque "#588DFF" \
  -fill "#4B8CE6" -opaque "#6494FF" \
  -fill "#5591E3" -opaque "#719CFF" \
  -fill "#5E95E0" -opaque "#7DA3FF" \
  -fill "#6799DD" -opaque "#89ABFF" \
  -fill "#709DDA" -opaque "#95B3FF" \
  -fill "#79A1D7" -opaque "#A1BBFF" \
  -fill "#82A4D5" -opaque "#ACC3FF" \
  -fill "#89A8D2" -opaque "#B6CAFF" \
  -fill "#91ABD0" -opaque "#C0D1FF" \
  -fill "#98AECD" -opaque "#CAD8FF" \
  -fill "#9EB1CB" -opaque "#D2DEFF" \
  -fill "#A4B4C9" -opaque "#DAE4FF" \
  -fill "#A9B6C7" -opaque "#E1E9FF" \
  -fill "#AFB8C6" -opaque "#E8EEFF" \
  -fill "#B7BCC3" -opaque "#F3F6FF" \
  -fill "#BABDC2" -opaque "#F7F9FF" \
  -fill "#BCBEC1" -opaque "#FAFBFF" \
  -fill "#C0C0C0" -opaque "#FFFFFF" \
  ```
</details>

Putting it all together, we obtain a monstrosity that looks like this:

```shell
magick animation.gif \
    -crop 127x22+16+48 +repage \         # crop 127x22 logo from animation
    \ # remap transition colours from white to grey
    -fill "#006BFF" -opaque "#006BFF" \
    -fill "#056DFE" -opaque "#066CFF" \
    -fill "#096FFC" -opaque "#0C6DFF" \
    -fill "#0F72FA" -opaque "#146FFF" \
    -fill "#1574F8" -opaque "#1C71FF" \
    -fill "#1B77F6" -opaque "#2474FF" \
    -fill "#227AF4" -opaque "#2D77FF" \
    -fill "#2A7EF1" -opaque "#387CFF" \
    -fill "#3281EF" -opaque "#4281FF" \
    -fill "#3984EC" -opaque "#4C86FF" \
    -fill "#4288E9" -opaque "#588DFF" \
    -fill "#4B8CE6" -opaque "#6494FF" \
    -fill "#5591E3" -opaque "#719CFF" \
    -fill "#5E95E0" -opaque "#7DA3FF" \
    -fill "#6799DD" -opaque "#89ABFF" \
    -fill "#709DDA" -opaque "#95B3FF" \
    -fill "#79A1D7" -opaque "#A1BBFF" \
    -fill "#82A4D5" -opaque "#ACC3FF" \
    -fill "#89A8D2" -opaque "#B6CAFF" \
    -fill "#91ABD0" -opaque "#C0D1FF" \
    -fill "#98AECD" -opaque "#CAD8FF" \
    -fill "#9EB1CB" -opaque "#D2DEFF" \
    -fill "#A4B4C9" -opaque "#DAE4FF" \
    -fill "#A9B6C7" -opaque "#E1E9FF" \
    -fill "#AFB8C6" -opaque "#E8EEFF" \
    -fill "#B7BCC3" -opaque "#F3F6FF" \
    -fill "#BABDC2" -opaque "#F7F9FF" \
    -fill "#BCBEC1" -opaque "#FAFBFF" \
    -fill "#C0C0C0" -opaque "#FFFFFF" \  # replace background with grey
    -resize 82x \                        # scale animation to 82x14
    -gravity center \                    # place logo in centre
    -background "#C0C0C0" \              # use grey for added background
    -extent 88x31 \                      # expand animation to 88x31
    -coalesce null: frame.png \          # apply frame border
    -layers composite \                  # composites each frame
    button.gif
```

## Conclusion

As someone who doesn't have an artistic bone in my body (doctor's diagnosis), I
think it turned out pretty great! I learned a lot about ImageMagick throughout
this adventure, and I hope you did too. Please feel free to use this button
however you wish. Attribution is not at all necessary, but is welcome and
appreciated regardless.

<figure>
  <img
    src="/img/usr/abc6e97e.gif"
    alt="Game Boy Color boot animation web button"
  />
  <figcaption>
    Here it is in all its glory!
  </figcaption>
</figure>

Well, I guess all that’s left is this final plea: Nintendo, please don't sue me.

<style>
  img {
    image-rendering: pixelated;
    border-radius: 0;
  }
</style>
