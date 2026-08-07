import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ linkify: true, typographer: false });

// Read the calendar day off a stamp.
//
// Parsing to a Date would resolve the offset and re-render the result in the
// runtime's zone, so a Tokyo morning lands on the previous day in Toronto.
// These are wall-clock labels rather than instants, so they are taken as
// written.
const parseDate = ts => ts.match(/^\d{4}-\d{2}-\d{2}/)[0];

// Read the wall clock off a stamp.
//
// Same reason: converting would show 08:10 in Tokyo as 19:10 the evening
// before, and would differ by wherever the build ran. Ordering and overlap
// use part.since, which is parsed as a true instant.
const parseTime = ts => ts.match(/T(\d{2}:\d{2})/)[1];

const moves = e => e.transit != null;

const tint = e =>
  e.category != null ? `${e.label ?? "area"} ${e.category}` : e.label ?? "area";

const cities = parts =>
  [...new Set(parts.map(p => p.city && String(p.city).trim()).filter(Boolean))];

// Moves before stops
const order = (a, b) => {
  if (!a.time && !b.time) return moves(a) && !moves(b) ? -1 : 1;
  if (!a.time) return 1;
  if (!b.time) return -1;
  if (a.since !== b.since) return a.since < b.since ? -1 : 1;
  return moves(a) && !moves(b) ? -1 : 1;
};

// How a marker sits in its event.
//
// A whole event has no mode. The rest are one end of something that had to be
// split: across midnight (dawn/dusk), or around the events it contains
// (open/shut).
const RANK = { open: 0, shut: 1 };

/**
 * Lays out a trip's entries for rendering.
 *
 * Takes the timeline as fetched and returns one object per day, in order,
 * carrying that day's cities, its bridge colour, and its events. Every layout
 * decision is made here, so the template only has to walk the result.
 */
function build(entries) {
  const { days, bridges } = schedule(entries);

  return Object.keys(days).sort().map(date => {
    const parts = days[date].sort(order);
    relate(parts);
    const marks = markers(parts);
    stitch(parts, marks);
    adjoin(marks);
    thin(marks);
    fold(marks);

    return {
      date,
      cities: cities(parts),
      bridge: bridges[date] ?? null,
      events: marks.filter(m => !m.merged).map(view),
    };
  });
}

// Bucket by day.
//
// Anything crossing midnight is split in two, so each day owns a whole row.
// The until-day also records a bridge: the colour of the span passing
// through it, drawn above its marker.
function schedule(entries) {
  const days = {};
  const bridges = {};
  const put = (date, part) => (days[date] ||= []).push(part);

  for (const entry of entries) {
    const part = { ...entry };
    if (part.time) {
      part.since = Date.parse(part.time.since);
      part.until = Date.parse(part.time.until);
    }
    const first = part.time && parseDate(part.time.since);
    const last = part.time && parseDate(part.time.until);

    if (first && first !== last) {
      part.half = "dawn";
      put(first, part);
      put(last, { ...part, half: "dusk", city: "" });
      if (bridges[last]) {
        console.warn(`day ${last} crossed by two spans; rendering first`);
      } else {
        bridges[last] = tint(part);
      }
    } else {
      put(part.date, part);
    }
  }
  return { days, bridges };
}

// Overlap and nesting.
//
// Only whole same-day events take part. A half is the stub of a span already
// drawn across two days, so nesting it inside its own neighbours would
// double-count it.
function relate(parts) {
  const whole = parts.filter(p => p.time && !p.half);

  for (const a of whole) {
    for (const b of whole) {
      if (a !== b && a.since < b.until && b.since < a.until) {
        a.overlaps = true;
        b.overlaps = true;
      }
    }
  }

  for (const inner of whole) {
    inner.nested = whole.some(outer =>
      outer !== inner &&
      outer.since <= inner.since && inner.until <= outer.until &&
      (outer.since < inner.since || inner.until < outer.until));
  }

  for (const span of parts) {
    if (!span.time || span.half !== "dawn") continue;
    for (const part of whole) {
      if (span.since <= part.since && part.until <= span.until) {
        part.nested = true;
        span.covers = true;
      }
    }
  }
}

// One marker per instant.
//
// An overlapping event needs two: a start carrying the body, and a bare tick
// at its own close, so the rail can pass between them.
function markers(parts) {
  const marks = [];
  for (const part of parts) {
    if (part.overlaps && part.time && !part.half && !part.nested) {
      marks.push({ part, when: part.since, mode: "open", mute: {} });
      marks.push({ part, when: part.until, mode: "shut", mute: {} });
    } else {
      marks.push({
        part,
        when: part.time ? part.since : null,
        mode: part.half,
        mute: {},
      });
    }
  }
  return marks.sort((a, b) => {
    if (a.when === null && b.when === null) return 0;
    if (a.when === null) return 1;
    if (b.when === null) return -1;
    if (a.when !== b.when) return a.when < b.when ? -1 : 1;
    return (RANK[a.mode] ?? 2) - (RANK[b.mode] ?? 2);
  });
}

// Paint the gaps between anchors
function stitch(parts, marks) {
  for (const mark of marks) mark.pieces = [];
  const points = anchors(marks);

  for (let i = 0; i + 1 < points.length; i++) {
    const from = points[i], to = points[i + 1];
    if (from.when === to.when && from.k === to.k) continue;
    const live = innermost(parts, from.when, to.when, marks[to.k].part);
    if (!live || live.nested) continue;
    const colour = tint(live);
    marks[from.k].pieces.push({
      part: from.foot ? "startTick" : "start",
      class: colour,
    });
    marks[to.k].pieces.push({
      part: to.foot ? "endTick" : "end",
      class: colour,
    });
  }

  // Span running past the last anchor
  const span = parts.find(p => p.covers);
  const last = points.at(-1);
  if (span && last && last.when < span.until) {
    marks[last.k].pieces.push({
      part: last.foot ? "startTick" : "start",
      class: tint(span),
    });
  }
}

// Where a rail piece can begin or end
function anchors(marks) {
  const points = [];
  marks.forEach((mark, k) => {
    if (mark.when === null) return;
    const { part, mode } = mark;
    points.push({
      k,
      foot: false,
      when: mode === "shut" ? part.until : part.since,
    });
    if (!mode && part.time && part.since !== part.until) {
      points.push({ k, foot: true, when: part.until });
    }
  });
  return points;
}

// The deepest event still running across a gap.
//
// A 2px rail cannot show two colours side by side, so instead of forking into
// parallel rails the one spine changes hue to whichever event is innermost.
function innermost(parts, lo, hi, skip) {
  const instant = lo === hi;
  let best = null;
  for (const part of parts) {
    if (instant && part === skip) continue;
    const live = part.time && !part.half && (part.overlaps || part.nested);
    if (!live && !(part.covers && part.time)) continue;
    const spans = instant
      ? part.since <= lo && lo < part.until
      : part.since < hi && lo < part.until;
    if (!spans) continue;
    if (!best || part.since > best.since ||
      (part.since === best.since && part.until < best.until)) best = part;
  }
  return best;
}

// Join events that meet exactly.
//
// Where one begins as the previous ends, the two share a single glyph: the
// ending event's ring with the starting event's dot inside it.
function adjoin(marks) {
  for (let k = 0; k < marks.length - 1; k++) {
    const prev = marks[k], next = marks[k + 1];
    const opens = (!next.mode || next.mode === "open") && !next.part.nested;
    if (!opens || !next.part.time) continue;
    const ranged = !prev.mode && prev.part.time &&
      prev.part.since !== prev.part.until && !prev.part.nested;
    const closes = prev.mode === "shut" || prev.mode === "dusk";
    if (!ranged && !closes) continue;
    if (prev.part.until !== next.part.since) continue;

    next.joins = tint(prev.part);
    // A container tail vanishes into the glyph; a day tail must stay to
    // draw the rest of its bar.
    if (prev.mode === "shut") prev.merged = true;
    else prev.absorbed = true;
  }
}

// Print a shared minute once
function thin(marks) {
  // A marker prints its own close only if it draws one: whole events and day
  // tails, unless the next marker already absorbed it.
  const draws = m => (!m.mode || m.mode === "dusk") && !m.absorbed &&
    m.part.time && m.part.since !== m.part.until;

  const head = m => !m.part.time || m.mode === "dusk" ? null
    : parseTime(m.mode === "shut" ? m.part.time.until : m.part.time.since);
  const foot = m => draws(m) ? parseTime(m.part.time.until) : null;

  const shown = marks.filter(m => !m.merged);
  for (let k = 1; k < shown.length; k++) {
    const prev = shown[k - 1], cur = shown[k];
    const time = head(cur);
    if (time === null) continue;
    if (head(prev) === time) cur.mute.head = true;
    if (foot(prev) === time) prev.mute.foot = true;
  }
}

// Hand pieces to the surviving marker
function fold(marks) {
  for (let k = 0; k < marks.length - 1; k++) {
    if (marks[k].merged && marks[k].pieces.length) {
      marks[k + 1].pieces.push(...marks[k].pieces);
    }
  }
}

// Shape a marker for the template
function view(mark) {
  const { part, mode, pieces } = mark;
  const head = part.time && parseTime(part.time.since);
  const foot = part.time && parseTime(part.time.until);

  // What shape of row this is.
  const shut = mode === "shut";
  const bare = mode === "dusk" || shut;               // a closing tick, no body
  const spans = part.time && head !== foot && mode !== "open" && !shut;
  const ticks = spans && mode !== "dawn" && !mark.absorbed;

  const classes = [tint(part)];
  if (shut) classes.push("oend");
  if (mode === "dawn") classes.push("since");
  if (mode === "dusk") classes.push("until");
  if (spans && mark.absorbed) classes.push("inner");
  if (spans && !(mode === "dawn" && part.covers)) classes.push("bar");
  if (ticks) classes.push("tick");
  if (part.time && !bare) classes.push("ring");
  if (mark.joins) classes.push("combined");

  // A shut marker has only one label, and it reads its own close.
  const stamp = shut ? part.time.until : part.time?.since;
  const since = part.time && !mark.mute.head && (shut || mode !== "dusk")
    ? { at: stamp, text: shut ? foot : head }
    : null;
  const until = ticks && !mark.mute.foot
    ? { at: part.time.until, text: foot }
    : null;

  const rail = mark.joins
    ? [...pieces, { part: "end", class: mark.joins }]
    : pieces;
  const side = part.quest === "side";

  return {
    class: classes,
    since,
    until,
    segments: rail.map(piece => ({
      class: piece.class
        ? ["seg", piece.part, piece.class]
        : ["seg", piece.part],
    })),
    joint: mark.joins ?? null,
    body: bare ? null : {
      category: part.category ?? part.label,
      ...detail(part),
      sidequest: side,
      people: side && part.with ? part.with : [],
      notes: part.notes ? md.render(part.notes) : "",
    },
  };
}

// Name and supporting detail
function detail(part) {
  const meta = [];
  const money = amount => {
    const n = Number(amount);
    meta.push({
      fare: true,
      text: Number.isFinite(n) ? n.toLocaleString("en-CA") : amount,
    });
  };

  let name = "";
  if (moves(part)) {
    const { src, dst, fare, operator, route } = part.transit;
    if (src || dst) name = `${src || ""} → ${dst || ""}`;
    if (fare) money(fare);
    if (operator) meta.push({ text: operator });
    if (route) meta.push({ text: route });
  } else {
    name = part.place?.name || (part.coord
      ? `${part.coord.lat.toFixed(4)}, ${part.coord.lon.toFixed(4)}`
      : "(unknown)");
  }
  if (part.price != null && Number.isFinite(Number(part.price))) {
    money(part.price);
  }

  return { name, meta };
}

export { build };
