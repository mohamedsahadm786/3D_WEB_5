# RESUME — full project context

> **Purpose.** This file is a self-contained handoff. After a Claude Code
> restart, the only instruction needed is: *"Read `changes/resume.md` and
> continue."* Everything required to resume is below — no external context.

---

## 0. TL;DR — what to do next

The ALLUVI website is **fully built and compiles clean**. The **motion system
rebuild is underway** (the original build used standard fade-in reveals; the
reference — Cartier "Watches & Wonders" — is a scroll-scrubbed, pinned,
cinematic experience). Increment 1 of the rebuild is done: the motion engine
exists, the Hero is a pinned scrubbed chapter, and all reveals are now
scroll-scrubbed. Next: turn the remaining home sections into pinned chapters.

**Agreed plan (user chose this):**
1. ~~**Deep-analyse the reference with Playwright**~~ — ✅ DONE. 116 frames
   captured in `changes/ref-analysis/`; full choreography mapped in
   `changes/ref-analysis/motion-analysis.md`.
2. **Rebuild ALLUVI's motion engine** — 🟡 IN PROGRESS (increment 1 done).
   Done so far: `Chapter` (pin+scrub primitive) + `Scrub` + `motionPrefs`;
   `HeroCanvas` scrubbed camera dolly + dual cursor effect; `Hero` rebuilt as a
   pinned chapter; `Reveal`/`LineReveal` now scroll-scrubbed & reversible
   (whole site auto-upgraded); `ChapterNav` side-nav dots. Build + browser
   verified clean. See `changes.md` "Motion rebuild — step 2".
   **Remaining:** convert the other home sections (Features, About, Products,
   WhyUs, HelpCTA, Testimonials, Contact) into pinned `<Chapter>` "rooms" with
   bespoke scrubbed inner timelines + void/breath transitions between them.

On resume: continue step 2 — wrap more sections in `<Chapter>` and use
`<Scrub>` for their inner choreography. See `motion-analysis.md` §7.

---

## 1. What this project is

A website for **ALLUVI** — a premium research-peptide / supplement e-commerce
brand (Dubai, UAE). Located at `D:\Web works\3D_web_5`.

All content, products, copy, and images are **ALLUVI's own** — defined in
`changes/content-and-assets.md`. (Note: that file says "Luma/LUMI" in places —
the correct brand name is **ALLUVI**; this was corrected throughout the build.)

The **reference site** — used only for motion/aesthetic feel, not for copying
content/assets/code — is:

**Cartier "Watches & Wonders"** → `https://www.cartier.com/en-fr/watchesandwonders#/`

The deliverable is the reference's **motion vocabulary and warm-luxury feel**
applied to ALLUVI's own content and scenes — NOT a clone of the reference's
specific scenes, 3D models, or code.

---

## 2. Reference site analysis (already done — first session)

Detected via Playwright runtime inspection:

- **Framework:** Nuxt 3 (Vue) — `useNuxtApp`
- **3D engine:** Three.js (raw, not R3F) — `__THREE__`
- **Animation:** Theatre.js — `__TheatreJS_CoreBundle` (timeline/sequencer)
- **Smooth scroll:** Lenis — `.lenis` class on `page__scrollWrapper`
- **Audio:** Howler.js — `HowlerGlobal` (the "SOUND" toggle)
- **GPU tiering:** detect-gpu
- One full-screen `<canvas>` inside a `.gpuApp` div — one WebGL context.

**The key mechanic:** the page is only **one viewport tall** — it does NOT
scroll in the DOM sense. Lenis converts wheel/touch input into a normalized
**progress value 0→1**, which **scrubs a Theatre.js timeline**. That timeline
drives the **camera path, object transforms, lighting, and post-processing**
through **8 sequential 3D scenes** (console logs "Warming up scene 1/8…8/8").

**Cursor effects (tested):** (1) camera parallax — whole scene reprojects toward
the cursor with a damped lerp; (2) the hero 3D object rotates/orbits to follow
the cursor. Motion is eased catch-up (`lerp(current, target, ~0.045)` per frame).

**8 scenes observed by scrolling:** (1) hero gallery room w/ hanging panels →
(2) curved panoramic screen w/ artisan figures → (3) abstract ribbons scene →
(4) sketch/film projection → (5) bright projection wall → (6) floating photo
gallery → (7) dark geometric transition → (8) product showroom.

**Assets (all public on `websitefactory.cartier.com/.../ww26/`):** `mainScene.glb`,
per-watch GLBs, octahedral EXR env maps + spherical-harmonics JSON, baked
lightmaps (webp), MSDF shape textures, blue/RGB noise + Bayer textures, a video
texture. → Do NOT download/embed these; rebuild equivalents originally.

**Analysis COMPLETE:** the fine-grained per-scroll-step capture is done —
see `changes/ref-analysis/` (116 frames) and `motion-analysis.md`. Notable
additions from that capture: the experience **loops infinitely** (no footer);
the journey is **1 hero + 6 chapter "rooms"**; rooms cross-dissolve through a
featureless **void room**; the cursor effect is **dual** (damped scene
parallax + independent hero-object orbit).

---

## 3. Current build state

**Stack:** Vite 5 + React 18 + TypeScript + Tailwind 3 + Motion (`motion/react`)
+ GSAP 3.13 + ScrollTrigger + Lenis + Three.js 0.171 + React Router 6.

**Status:** all sections + pages built. `npm run build` passes clean (0 TS
errors). Code-split: main ~130 kB gzip, Three.js lazy chunk ~118 kB gzip.

### File tree (everything under `D:\Web works\3D_web_5`)

```
package.json  vite.config.ts  tsconfig.json  postcss.config.js
tailwind.config.js  index.html  CLAUDE.md  .gitignore
public/favicon.svg
changes/
  content-and-assets.md   (content + image-slot spec — pre-existing)
  recreation-rules.md     (recreation playbook — pre-existing)
  changes.md              (change log)
  resume.md               (this file)
src/
  main.tsx                React + Router entry
  App.tsx                 routes (/ /shop /product/:slug), page fade transitions
  index.css               Tailwind layers, CSS vars, .shell, grain, reduced-motion
  vite-env.d.ts
  lib/
    gsap.ts               registers ScrollTrigger + useGSAP; exports gsap
    images.ts             import.meta.glob resolver -> "folder/name" lookup
    products.ts           8 ALLUVI products (slug/name/price/tint/blurb)
    site.ts               BRAND constants + NAV array
  hooks/
    useTypewriter.ts      rotating typewriter for the hero headline
    useCounter.ts         scroll-triggered count-up (About stat)
  components/
    Img.tsx               renders photo / video / Placeholder by name
    Placeholder.tsx       warm gradient fallback tile
    SmoothScroll.tsx      Lenis provider + scrollToId() helper
    Cursor.tsx            custom cursor (dot + lagging ring), fine-pointer only
    Header.tsx            fixed header + full-screen overlay nav
    Footer.tsx            dark footer, newsletter, giant watermark
    Reveal.tsx            <Reveal> + <LineReveal> scroll-reveal helpers
    HeroCanvas.tsx        Three.js hero scene (faceted form + motes + parallax)
    ProductCard.tsx       product card w/ hover Enquire + wishlist
  sections/               (home page, in order)
    Hero.tsx Features.tsx About.tsx Marquee.tsx Products.tsx
    WhyUs.tsx HelpCTA.tsx Testimonials.tsx Contact.tsx
  pages/
    Home.tsx              assembles the 9 sections
    Shop.tsx              /shop — breadcrumb + 8-card grid
    Product.tsx           /product/:slug — gallery, accordion, related
  images/                 real assets, one folder per section (pre-existing)
```

### Run commands
- Dev: `npm run dev` (Vite picks first free port from 5173).
- Build: `npm run build` (runs `tsc --noEmit && vite build`).
- Deps already installed (`node_modules` present).

---

## 4. THE PROBLEM — why the motion must be rebuilt

The current build uses **normal DOM scrolling** + Motion `whileInView`
fade/rise reveals (`src/components/Reveal.tsx`) + a few `useScroll` parallax
transforms. It is a polished marketing site, but it does **not** reproduce the
reference's defining feel.

The reference's identity = **scroll-scrubbed cinematic sequencing**: sections
**pin** to the viewport while scroll progress **scrubs** continuous timelines
and a **3D camera path**. The current ALLUVI build has none of that pinning or
scrubbing. That is the gap the user is (rightly) frustrated about.

---

## 5. THE MOTION REBUILD — approach

Rebuild the motion layer (content/layout/components mostly stay):

1. **Lenis stays** as the smooth-scroll driver (already wired in
   `SmoothScroll.tsx`, synced to `ScrollTrigger.update`).
2. **GSAP ScrollTrigger as the timeline engine** — replace `whileInView`
   reveals with `scrub`-based timelines. Key sections become **pinned**
   (`pin: true`) with a scroll distance, and their inner animation **scrubs**
   to scroll progress.
3. **Scroll-driven Three.js camera** — `HeroCanvas` (and possibly a larger
   shared canvas) should move the camera / scene along a path tied to a global
   scroll-progress value, not just the hero's local scroll.
4. **Cursor parallax everywhere** — damped-lerp parallax on the 3D camera and
   on key 2D layers, not only the hero.
5. **Scrubbed text reveals** — headings reveal *as you scroll through them*
   (scrub), not a one-shot trigger.
6. Keep `prefers-reduced-motion` handling — pinning/scrubbing disabled or
   simplified when reduced motion is set.

Build incrementally and verify each pinned/scrubbed section in the browser
with Playwright. Match easing/timing to the reference capture from step 1.

---

## 6. Conventions / guard-rails (from CLAUDE.md + recreation-rules.md)

- Components in `src/components`, home sections in `src/sections`, routes in
  `src/pages`. Register GSAP plugins only in `src/lib/gsap.ts`.
- Design tokens only — no hardcoded hex in components. Palette = warm museum
  luxury (cream `#EFE8DA`, gold `#A6824C`, warm-noir `#171109`); tokens in
  `tailwind.config.js` + CSS vars in `src/index.css`.
- Fonts: **Fraunces** (display/serif) + **Jost** (labels/UI). No generic fonts.
- Images via `<Img name="folder/name" />` → `src/images/<folder>/`; missing
  files fall back to `<Placeholder>`.
- Animate `transform`/`opacity` only. Standard easing `cubic-bezier(0.22,1,0.36,1)`.
- No new animation library beyond Motion / GSAP / Lenis without asking.
- Keep `changes/changes.md` updated.
- Build originally, from scratch — reproduce the reference's *motion technique
  and feel*, never its specific scenes, 3D models, assets, or code.

---

## 7. Known issues / open items

- **Task #10 (browser verification)** is incomplete — only the hero was
  verified live before the Playwright MCP disconnected. After the rebuild, do a
  full section-by-section + responsive (mobile/tablet/desktop) pass.
- The Playwright MCP server disconnected in the previous session; a Claude Code
  restart was needed to reconnect it. Confirm it works on resume.
- Production hosting will need an SPA rewrite (all routes → `index.html`) for
  `/shop` and `/product/:slug` to load on direct hit. Not yet configured.
- `motion/react` logs one benign "container non-static position" warning — low
  priority; revisit during the rebuild.

---

## 8. Memory files (also persisted)

Project memory also lives at
`C:\Users\PC\.claude\projects\D--Web-works-3D-web-5\memory\` —
`alluvi-recreation.md`, `user-wants-scroll-scrubbed-motion.md`,
`motion-rebuild-plan.md`. This `resume.md` is the authoritative, fuller version.
