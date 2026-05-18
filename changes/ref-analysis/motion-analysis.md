# Reference motion analysis — Cartier "Watches & Wonders"

> Deep Playwright capture of `https://www.cartier.com/en-fr/watchesandwonders`
> (1440×900 desktop). Source frames live beside this file in
> `changes/ref-analysis/`. This document maps the reference's motion
> vocabulary so ALLUVI's motion engine can be rebuilt to match the *feel* —
> not the scenes, models, or code.

---

## 0. How to read the capture set

| Files | What they are |
|---|---|
| `hero-clean.jpeg` | Pristine landing hero, no modal — the definitive hero reference |
| `hero00–hero12.jpeg` | Landing → hero → section 1 → section 2 (fine, 150px steps) |
| `s000–s088.jpeg` | Full sweep through all 6 watch sections, twice (the experience loops) — 220px wheel steps |
| `cursor-c/L/R/T/B.jpeg` | Same static scene, cursor at centre / left / right / top / bottom — isolates the cursor effect |

Each step = one `mouse.wheel` of 150–220px, ~300ms apart (Lenis settle time).

---

## 1. The core mechanic — virtual scroll → scrubbed timeline

This is the single most important finding and the thing the current ALLUVI
build is missing.

- **The page does not DOM-scroll.** `<body>` is `overflow:hidden`; the
  `.page__scrollWrapper` is exactly one viewport tall. `window.scrollY`
  never changes. `window.scrollTo()` does nothing.
- **Lenis 1.1.20** runs in *virtual* mode: it captures wheel/touch/key input
  and converts it into a normalised progress value.
- That progress **scrubs a Theatre.js 0.7.2 timeline** (`__TheatreJS_CoreBundle`).
- The timeline drives **one persistent Three.js camera** travelling through a
  series of 3D "rooms" on **one full-screen WebGL canvas** (one context).
- Console warms up **8 environment scenes** (`Warming up scene 1/8…8/8`); the
  side-nav exposes **6** of them as watch chapters.
- **The experience loops infinitely.** There is *no footer / no end*. After
  the last section (`webgl.loopIndex` ticks 0→1) the camera passes through a
  black void straight back to section 1. The landing hero is shown **once**
  and skipped on every loop.

**Implication for ALLUVI:** scroll input must drive a single global
progress value (0→N), and that value scrubs everything — camera, reveals,
environment swaps. Standard `whileInView` reveals cannot reproduce this.

---

## 2. Structure — 1 hero + 6 chapter "rooms"

The journey is a chain of self-contained 3D sets. Each is entered and left
through a featureless **void room** (bright cream — see `s045` — or near-black
— see `s071`); the environments cross-dissolve inside that void.

| # | Side-nav dot | Title (serif) | Watch / subject | Environment |
|---|---|---|---|---|
| — | (none, dot −1) | WATCHES & WONDERS | — | Dark gallery room, hanging framed shape-panels, polished floor |
| 1 | 0 | TAILORED CRAFTS / serving one form | ROADSTER | Curved panoramic LED screen w/ mountains; gold + steel cylinders |
| 2 | 1 | THE EYE / of the jeweller | BAIGNOIRE | White rock canyon, blue sky, gold oval watch |
| 3 | 2 | SHAPING / MOVEMENT | CARTIER PRIVÉ (Crash) | Bright white-out void, soft god-rays |
| 4 | 3 | THE / MANUFACTURE | SANTOS-DUMONT | Concrete room, gold spiral staircase, painterly green screens |
| 5 | 4 | THE / FILM | — | Dark room, live-action film projected on angled screens |
| 6 | 5 | THE SOUND / OF CRAFT | — | Warm tan room, floating gallery of watch photographs |

Wheel cost ≈ **1600–2000px per room** (≈7–9 of my 220px steps).

---

## 3. Per-room choreography

Within a room, scroll progress continuously scrubs:

1. **Camera dolly** — the camera tracks forward into / through the set
   (also slight orbit). The set reveals depth as you scroll.
2. **The hero object (giant watch)** — enters small/receding, scales up to
   ~viewport height as it becomes the focal point mid-room, then recedes /
   is overtaken as you scroll out. Always centred, hovering, no support.
3. **Section title** — fades + slight upward drift *in* on room entry, holds,
   fades *out* on exit. It is **scrubbed** to progress, not a one-shot
   trigger (see `hero02` — "& WONDERS" caught mid-fade-out).
4. **Craftsperson figures** — small human silhouettes populate every set at
   realistic human scale. The deliberate scale gap (tiny people vs a
   building-sized watch) is what makes it read as monumental / cinematic.

**Room-to-room transition:** title text + active side-nav dot **snap** at the
boundary (discrete), while the 3D camera + environment dissolve is
**continuous** through the void room. Hero → section 1 specifically fades the
hero room to black, then fades the section 1 set up from black (`hero02`→`hero04`).

---

## 4. Cursor interaction (two layered effects)

Confirmed by comparing `cursor-L.jpeg` vs `cursor-R.jpeg` (same scroll
position, cursor only moved):

1. **Scene camera parallax** — the whole 3D scene reprojects toward the
   cursor. Floor shadows, figures, set pieces all shift. Damped catch-up,
   roughly `lerp(current, target, ~0.045)` per frame — slow, weighty, never
   snappy.
2. **Hero object orbit** — the giant watch independently rotates/orbits to
   face the cursor. Between far-left and far-right cursor the Crash watch
   rotates noticeably (~±15–20°), showing different faces.

Both run every frame, independent of scroll. This is *everywhere*, not just
the hero.

---

## 5. Persistent 2D UI overlay

Fixed on top of the canvas across the whole experience:

- **`SOUND`** toggle — top-left (Howler.js ambient audio).
- **`Cartier`** wordmark — top-centre.
- **Scene title** — top-centre, just under the wordmark; serif display face,
  letter-spaced, 2–3 lines, all-caps. Fades with the room.
- **CTA** — bottom-centre, condensed sans caps with an underline tick
  (`EXPLORE`, `WATCH THE FILM`).
- **Side-nav** — 6 dots on the right edge; active dot enlarges/brightens.
- **Scroll cue** — a small circular progress indicator near the CTA; on the
  hero it is a `↓` arrow.

---

## 6. Aesthetic notes

- Warm museum-luxury palette; **heavy film grain** over everything.
- Soft volumetric lighting / god-rays; shallow depth-of-field.
- High-contrast monumental scale (giant object ↔ tiny figures).
- Each room carries its own colour key (mountain green, sky blue, white void,
  gold, dark film room, warm tan) while staying inside the warm range.
- Serif display for titles; condensed sans for UI labels.
- All motion is eased catch-up — weighty, slow settle, never linear.

---

## 7. Translation to the ALLUVI motion rebuild

Mapping the vocabulary onto ALLUVI (premium research-peptide brand, existing
content/products/images kept):

1. **Virtual-scroll progress engine.** Keep Lenis as the input driver. Add a
   single global `progress` value; GSAP ScrollTrigger `pin` + `scrub` is the
   pragmatic stand-in for Theatre.js — pin each chapter, scrub its inner
   timeline to progress. (Alternatively a real virtual-scroll progress store.)
2. **One persistent Three.js scene, scrubbed camera.** `HeroCanvas` should
   grow into (or be replaced by) a shared canvas whose camera dollies along a
   path tied to global progress — not per-section local scroll.
3. **Chapter "rooms".** Turn the home sections (Hero, Features, About,
   Products, WhyUs, …) into pinned chapters, each with: a monumental centred
   hero element, a themed backdrop, and a scrubbed title fade. Void/breath
   transitions between them.
4. **Monumental scale + figures.** Reproduce the scale-contrast trick — an
   oversized focal product/form against small human-scale supporting
   elements.
5. **Cursor everywhere.** Damped-lerp (~0.045) camera parallax on the 3D
   scene + an independent orbit of the hero 3D form toward the cursor. Apply
   to key 2D layers too.
6. **Scrubbed titles.** Headings fade + drift as you scroll *through* them,
   reversible — not one-shot `whileInView`.
7. **Persistent overlay UI.** Fixed wordmark / chapter title / CTA / side-nav
   dots / scroll cue, with the title fading per chapter.
8. **`prefers-reduced-motion`.** Disable pin/scrub and the loop; fall back to
   static chapters with simple fades.

Loop note: the reference loops infinitely. ALLUVI is an e-commerce site that
needs a real footer and routes (`/shop`, `/product/:slug`) — do **not** copy
the infinite loop; end the journey at the footer/CTA instead.

---

## 8. Technical fingerprint (reference, for reference only)

Nuxt 3 (Vue) · Three.js (raw) · Theatre.js 0.7.2 · Lenis 1.1.20 ·
Howler.js · detect-gpu · Pinia stores (`webgl`, `ui`, `transition`,
`datas`, `podcasts`). Assets on `websitefactory.cartier.com/.../ww26/`.
Rebuild equivalents originally — do not download or embed reference assets.
