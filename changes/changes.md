# Changes log

## Initial build — ALLUVI recreation
- Analysed the reference site with Playwright (tech stack, motion, scroll model,
  cursor parallax) — captured a warm-luxury, scroll-driven, WebGL-led aesthetic.
- Scaffolded Vite + React 18 + TS + Tailwind. Stack: Motion, GSAP/ScrollTrigger,
  Lenis, Three.js, React Router.
- Design system: warm museum-light palette (cream / gold / warm noir) as Tailwind
  tokens + CSS vars; fonts Fraunces (display) + Jost (labels). Easing
  `cubic-bezier(0.22,1,0.36,1)`; `prefers-reduced-motion` neutraliser.
- Core lib: `gsap.ts`, `images.ts` (glob resolver), `products.ts` (8 ALLUVI
  products), `site.ts` (brand + nav).
- Shared components: `Img` + `Placeholder`, `SmoothScroll` (Lenis), `Cursor`
  (custom dot + lagging ring), `Header` (full-screen overlay nav), `Footer`
  (newsletter + watermark), `Reveal` / `LineReveal`, `ProductCard`.
- WebGL hero (`HeroCanvas`): warm-lit faceted form + drifting golden motes,
  cursor-parallax camera, scroll-reactive, off-screen/reduced-motion gated.
- Home sections: Hero (typewriter + 3D), Features, About (count-up + cycling
  media), Marquee, Products (8-card grid), Why Us (flip circles), Help CTA
  (parallax), Testimonials (carousel), Contact.
- Pages: Home, Shop, Product detail (gallery thumbnails, accordion, related),
  routing + fade page transitions.
- Fixes: Tailwind dynamic `object-fit` classes made static; single flat
  `tsconfig.json` (dropped composite project refs).
- Verified: `npm run build` passes clean (no TS errors). Hero verified live in
  browser. Full section-by-section browser pass pending (Playwright session
  dropped mid-verification).

## Motion rebuild — step 1: deep reference analysis
- Re-confirmed Playwright MCP works.
- Deep-captured the reference (Cartier "Watches & Wonders") with Playwright:
  116 frames in `changes/ref-analysis/` — full incremental sweep of all 6
  chapter rooms (captured twice — the experience loops), the landing hero, and
  an isolated cursor-parallax test (`cursor-L/R/...`).
- Key findings: virtual scroll (Lenis, no DOM scroll) scrubs a Theatre.js
  timeline driving one persistent Three.js camera through 1 hero + 6 "rooms";
  per-room camera dolly + scaling hero object + scrubbed title fade; void-room
  cross-dissolve between rooms; dual cursor effect (damped scene parallax +
  hero-object orbit); infinite loop, no footer.
- Wrote `changes/ref-analysis/motion-analysis.md` — full choreography map +
  translation plan for the ALLUVI motion rebuild (step 2).

## Motion rebuild — step 2: motion engine (increment 1)
- New `src/lib/motionPrefs.ts` — single `prefersReducedMotion()` helper.
- New `src/components/Chapter.tsx` — pinned scroll-scrubbed "room" primitive
  (GSAP ScrollTrigger pin + scrub) exposing a 0→1 progress MotionValue via
  context; falls back to a plain stacked section under reduced motion.
- New `src/components/Scrub.tsx` — reveal scrubbed to chapter progress, with
  optional in/hold/out range (reference-style title fades).
- `HeroCanvas` rebuilt: camera now DOLLIES forward + the form SCALES UP
  scrubbed to chapter progress; dual cursor effect added (damped camera
  parallax + independent form orbit toward the cursor).
- `Hero` section rebuilt as a pinned `<Chapter>` (distance 1.3): scroll scrubs
  the 3D camera while the content drifts up and dissolves.
- `Reveal` / `LineReveal` converted from one-shot `whileInView` to
  scroll-SCRUBBED, reversible reveals (same API — every section auto-upgraded).
- New `src/components/ChapterNav.tsx` — persistent right-edge side-nav dots
  tracking the home chapters (active dot highlights; click smooth-scrolls).
- Verified: `npm run build` passes clean; browser pass — hero pins + form
  grows monumental, scrubbed headings reveal on scroll, side-nav tracks, 0
  console errors.
- Still open: only the Hero is a true pinned chapter so far; the other
  sections carry the scrubbed feel via the reveals but are not yet pinned
  "rooms" — a follow-up increment.

## Menu overlay polish
- Reduced the overlay menu size: nav items `clamp(2.6→1.7rem … 6.2→3.4rem)`,
  index numerals `0.9→0.65rem`, tighter spacing/margins.
- Fixed dead nav links: the `grain-layer` div sat above the menu buttons and
  ate every click — added `pointer-events-none`. Items now navigate.
- White custom cursor on the dark menu: `Header` toggles a `menu-open` class on
  `<html>`; `Cursor` dot/ring tagged `cursor-dot`/`cursor-ring`; `index.css`
  scopes the white override to `.menu-open` only.
- `ALLUVI` wordmark and the `Buy Now` button turn golden (`gold-light`) while
  the menu overlay is open.

## Cart + search
- New `src/lib/cart.tsx` — `CartProvider` / `useCart`: line items, count,
  subtotal, `localStorage` persistence, and shared cart-drawer open state.
  `priceValue` matches the digit-led number token (the `د.إ` mark itself
  contains a period, so a plain non-digit strip produced `NaN`).
- New `src/components/CartDrawer.tsx` — slide-in cart panel: line items with
  image + qty stepper, remove, subtotal, clear, and a WhatsApp checkout
  (pre-fills the order — the brand's stated ordering channel; no checkout
  backend exists). Empty state links to the shop.
- New `src/components/SearchOverlay.tsx` — full-screen product search that
  live-filters the catalogue by name; results link to product pages.
- `Header`: cart icon is now a button that opens the drawer (with a live
  count badge); added a search icon next to it; body scroll locks for the
  menu, search, or cart. App wrapped in `CartProvider` (`main.tsx`).
- `Product` page: the `Add to Cart` button now adds the chosen quantity and
  opens the cart drawer.
- Verified live: search filters + links, add-to-cart, qty steppers,
  qty-to-zero removal, empty state, subtotal maths; `npm run build` clean.

## Rotating "globe" page carousel
- Replaced the earlier ArcSection approach (removed) with a 3D globe carousel,
  per clarified intent: pages 2+ do not scroll vertically — scroll rotates a
  faceted globe and the next page swings in from the right.
- New `src/components/GlobeCarousel.tsx` — pins to the viewport; scroll is
  converted (GSAP ScrollTrigger pin + scrub + snap) into a Y-axis rotation of
  a 7-sided prism. Each section is a face: `rotateY(i·seg) translateZ(R)`; the
  prism sits back `translateZ(-R)` so the front face is on the camera plane.
  Radius/perspective recomputed on resize. Reduced motion → plain vertical
  stack (no pin, no 3D).
- New `src/components/FitToScreen.tsx` — measures a section's natural height
  and uniformly downscales it so each "page" fits one viewport with no
  internal scrolling.
- `Reveal.tsx` — added `RevealStaticContext`; inside the globe, scroll-scrubbed
  reveals render statically (a non-scrolling face would otherwise leave them
  invisible).
- `index.css` — `.globe-scene/prism/face` 3D rules; `.globe-face section`
  padding trimmed so sections fit; `overflow-x: hidden` on `html, body`.
- `Home` — Hero (normal) → `GlobeCarousel` faces Features…Testimonials →
  Contact (normal) → footer.
- Verified live: globe rotates + snaps per face, all 7 faces opaque/readable/
  fit one screen, Hero unchanged, Contact normal after the globe, reduced
  motion falls back to a stack, no horizontal overflow; `tsc` + `npm run
  build` clean, 0 console errors.
- Known limitation: in-page nav (menu links, ChapterNav dots) scrolls to the
  globe but does not yet rotate it to the targeted face.
- Dropped the Marquee from the globe — as a full face it was near-empty dark
  space. The globe is now 6 faces (Features, About, Products, WhyUs, HelpCTA,
  Testimonials); `Marquee.tsx` is left in the repo unused.

## Golden cursor on dark pages
- The custom `Cursor` turns golden (`gold-light`) while hovering a dark/brown
  area; stays the default noir cursor over light pages. It detects
  `closest('[data-dark]')` in the pointermove handler.
- `data-dark` is set on dark globe faces (`bg` includes `noir` — WhyUs,
  HelpCTA) and on the `Footer`. The `.menu-open` white-cursor override still
  wins on the menu overlay.

## Docs
- Added `changes/instruction.md` — a standalone A-to-Z recreation guide for the
  hero "golden glob scroll-zoom" effect (concept, libraries, full code for
  `gsap.ts` / `Chapter` / `HeroCanvas` / `Hero` / `SmoothScroll`, step-by-step
  rebuild, tuning knobs, a11y/perf, pitfalls, non-React adaptation). Intended
  to be dropped into another repo as a build brief.
