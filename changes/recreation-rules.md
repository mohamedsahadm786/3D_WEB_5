# Recreation Rules & Playbook

> **Purpose.** A reusable ruleset for recreating a marketing/shop website like
> this one. It tells Claude Code *what to look at* in a reference site, *how to
> rebuild it*, which libraries own which motion, and the conventions and
> guard-rails to follow.
>
> Use this together with `content-and-assets.md` (the content + image system to
> reuse) and `information.md` (a full map of this codebase as a worked example).

---

## 1. What this kind of project is

A **behavioural recreation** of an existing website: the same structure,
section order, page count, fonts, colour theme, copy *feel*, and
motion/transition feel — rebuilt from scratch on a lean modern stack instead of
copying the original's code. Photos, 3D renders, and the logo are placeholders
to be swapped for real assets later.

The goal is to reproduce the **experience**, not to trace pixels or copy markup.

---

## 2. The recreation workflow (phases)

1. **Analyse the reference site** → write `docs/source-analysis.md`.
2. **Plan the build** → write `docs/build-plan.md`.
3. **Add `CLAUDE.md`** → project rules (stack, conventions, do-nots, tokens).
4. **Scaffold** the project (stack in §5).
5. **Build section by section**, in order, verifying each in a browser.
6. **Motion-polish pass** comparing against the original's feel.
7. Keep a running **`changes/changes.md`** log.

Do not skip phases 1–2: the analysis and plan are what make the rebuild
faithful instead of generic.

---

## 3. Phase 1 — Analyse the reference site

Inspect the original (browser dev tools + a tool like Playwright). Capture, in
`docs/source-analysis.md`, a **behavioural spec** (not a tracing):

- **Tech & motion stack detected** — what animation libraries the original uses
  (GSAP, ScrollTrigger, SplitText, Lenis, Swiper, parallax libs, WOW.js, tilt,
  WebGL/three.js, custom cursor, typewriter, counters…). You will reproduce the
  *feel* of these with a lean stack, not the same libraries.
- **Global design tokens** — background, surface, body text, heading, hairline
  border colours; the overall theme (e.g. monochrome dark, luxury/minimal).
- **Typography** — every font family and where each is used. Find free
  equivalents (Google Fonts, Fontshare) and use the *exact same* fonts.
- **Page inventory** — every page/route, and how long each is.
- **Section-by-section spec** of each page — for every section record: layout,
  the copy, the animation trigger, and the *feel*.
- **Product / item catalogue** — every product, name, price, etc.
- **Nav structure** — links, anchors, buttons.

---

## 4. Phase 2 — Build plan

In `docs/build-plan.md` record:

- The **stack** and why.
- An **animation-ownership table** — every effect mapped to the library that
  will own it (see §8).
- The **folder structure** and component tree.
- The **build order** (section by section).
- The **asset-placeholder strategy** — sized placeholders per slot so real
  images drop in later without touching layout.

---

## 5. Tech stack (the lean rebuild stack)

| Layer            | Choice                                                        |
|------------------|---------------------------------------------------------------|
| Build tool       | **Vite** + `@vitejs/plugin-react`                             |
| Framework        | **React 18** + **TypeScript**                                 |
| Styling          | **Tailwind CSS** (design tokens in the theme + CSS variables) |
| Routing          | **React Router**                                             |
| UI animation     | **Motion** (`motion/react`)                                   |
| Scroll animation | **GSAP** + **ScrollTrigger** + **SplitText** (`@gsap/react`)  |
| Smooth scroll    | **Lenis**                                                     |
| Misc motion      | Pure CSS keyframes (marquee, ring spin, bob, blink, glow)     |
| Hand-written     | Canvas 2D for bespoke effects (e.g. cursor trails)            |

**Never** use Create React App. **Never** add another animation library beyond
Motion / GSAP / Lenis without asking first.

---

## 6. Project structure & conventions

```
src/
  main.tsx, App.tsx, index.css
  lib/        gsap.ts (plugin registration), images.ts, products.ts (data)
  hooks/      one file per custom hook
  components/ shared UI (header, footer, cursor, cards, Img, …)
  sections/   one file per home-page section
  pages/      one file per route
  images/     real-image slots, one folder per section
docs/         source-analysis.md, build-plan.md
changes/      changes.md + reference docs
```

- Components in `src/components`, page sections in `src/sections`, routes in
  `src/pages`.
- Register GSAP plugins **once** in `src/lib/gsap.ts`; import GSAP from there.
- Use `useGSAP` (from `@gsap/react`) for GSAP code — never raw `useEffect`.
- Design tokens come from the Tailwind theme + CSS variables. **No hardcoded
  hex** in components.
- Real images go in `src/images/<section>/` and are referenced through the
  `<Img>` component; a missing file falls back to `<Placeholder>`. Never inline
  base64 images.
- Keep a running `changes/changes.md` log of every change.

---

## 7. Design system rules

- Define **design tokens** in `tailwind.config.js` (`theme.extend.colors`,
  `fontFamily`, etc.) and global CSS — background, surface, body, heading,
  hairline border, plus a single standard easing curve
  (`cubic-bezier(0.22, 1, 0.36, 1)`).
- Match the **original's theme** exactly (e.g. monochrome dark — white on
  near-black, no coloured accent). If a request conflicts with the theme rule,
  flag it and ask before breaking it.
- Use the **exact fonts** of the original (free equivalents). Never substitute
  generic fonts (Inter / Roboto / Arial).
- A shared max-width container (`.shell`) centres page content.
- Always keep a `prefers-reduced-motion` block that neutralises animation.

---

## 8. Motion & animation — technique catalog

Reproduce the *feel* of the original. Map each effect to one owner:

| Effect                            | Owner                              |
|-----------------------------------|------------------------------------|
| Smooth scroll                     | Lenis                              |
| Hero load-in stagger              | Motion                             |
| Hero typewriter headline          | Custom hook                        |
| Hero parallax background          | GSAP ScrollTrigger (`scrub`)       |
| Floating / bobbing element        | CSS keyframes                      |
| Section heading line reveals      | GSAP SplitText + ScrollTrigger     |
| Word-by-word scrubbed reveal      | GSAP SplitText + ScrollTrigger     |
| Card reveal on scroll (stagger)   | Motion `whileInView`               |
| Card hover tilt / image zoom      | Motion (`useMotionValue`/`useSpring`) |
| Count-up numbers                  | GSAP + ScrollTrigger + custom hook |
| Marquee infinite strip            | CSS keyframes                      |
| Carousel (testimonials)           | Motion (`AnimatePresence`) + autoplay |
| Custom cursor                     | Motion (spring)                    |
| Decorative rotating ring          | CSS keyframes                      |
| Bespoke effects (cursor trails…)  | Hand-written Canvas 2D             |
| Page / route transitions          | Motion                             |

Rules of motion:
- **Animate `transform` and `opacity` only** — never `width`/`height`/`top`/
  `left` (causes layout jank). `box-shadow` glow is acceptable (paint only).
- Every animation must respect `prefers-reduced-motion` — disable or simplify.
- Bespoke canvas effects: gate to fine-pointer devices, disable for
  reduced-motion, and clean up listeners / `requestAnimationFrame` on unmount.
- Heading reveals use masked lines (`overflow:hidden` wrapper + `yPercent`).
- Reveal-on-scroll plays **once** (`viewport={{ once: true }}`).

---

## 9. Image asset system

Reuse the system documented in `content-and-assets.md`:
- `src/images/` with one sub-folder per section.
- A resolver (`src/lib/images.ts`, `import.meta.glob`) keyed by
  `"folder/name"` without extension.
- An `<Img>` component that renders the photo, a looping video, or a sized
  placeholder.
- File names map to slots; extensions are free; missing files degrade
  gracefully to placeholders.

When recreating, **keep the folder structure and `<Img>` slot names** so the
existing image folder can be dropped in unchanged.

---

## 10. Content replacement workflow

To turn this base into a different site:

1. Read `content-and-assets.md` for the full inventory of current copy and
   product data.
2. Replace copy **section by section** — headlines, eyebrows, paragraphs,
   button labels, nav labels, testimonials, footer text, meta title/description.
3. Update brand details — name, address, email, phone, WhatsApp, social links.
4. Update `src/lib/products.ts` — slugs, names, prices, blurbs — and rename the
   `products/` + `product-gallery/` image files to the new slugs.
5. Keep section structure, layout, and motion intact unless the reference site
   genuinely differs.
6. Re-verify every page (see §12).

---

## 11. Do-not rules

- No Create React App.
- No new animation library beyond Motion / GSAP / Lenis without asking.
- No generic fonts (Inter / Roboto / Arial) — fonts are fixed to the original's.
- Do not animate layout properties (`width`/`height`/`top`/`left`).
- Do not remove `prefers-reduced-motion` handling.
- No hardcoded hex colours in components — use design tokens.
- No inline base64 images — use the `src/images/` + `<Img>` system.
- Do not declare a section "done" before verifying it in a browser.
- Do not break the original's theme (e.g. introduce colour into a strict
  monochrome design) — if asked to, flag the conflict first.

---

## 12. Verification rules

Before calling anything done:
- `tsc` / the build must pass with **no type errors**.
- **No console errors** in the browser.
- Check **every page and every scroll animation** in a real browser
  (Playwright works well) — at desktop and mobile widths.
- Confirm `prefers-reduced-motion` still disables / simplifies motion.
- Confirm routing works on direct load and refresh (SPA rewrite config).
- Keep `changes/changes.md` updated with what changed and why.
