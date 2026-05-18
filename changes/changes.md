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
