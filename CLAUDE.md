# ALLUVI — project rules

A behavioural recreation: the warm-luxury feel, smooth scroll and cinematic
motion of a high-end reference site, rebuilt from scratch for **ALLUVI**, a
premium research-peptide brand. Content is ALLUVI's own (see
`changes/content-and-assets.md`); the reference only informs aesthetic + motion.

## Stack
- Vite + React 18 + TypeScript
- Tailwind CSS (tokens in `tailwind.config.js` + CSS vars in `src/index.css`)
- React Router (`/`, `/shop`, `/product/:slug`)
- Motion (`motion/react`) — reveals, carousel, cursor, page transitions
- GSAP + ScrollTrigger — registered once in `src/lib/gsap.ts`
- Lenis — smooth scroll (`src/components/SmoothScroll.tsx`)
- Three.js — WebGL hero scene (`src/components/HeroCanvas.tsx`)

## Conventions
- Components in `src/components`, home sections in `src/sections`, routes in `src/pages`.
- Design tokens only — no hardcoded hex in components. Fonts: Fraunces (display/serif), Jost (labels/UI).
- Images via `<Img name="folder/name" />` → `src/images/<folder>/`; missing files fall back to `<Placeholder>`.
- Animate `transform`/`opacity` only. Every animation respects `prefers-reduced-motion`.
- Reveal-on-scroll plays once. Use `<Reveal>` / `<LineReveal>` from `src/components/Reveal.tsx`.

## Do-not
- No new animation library beyond Motion / GSAP / Lenis without asking.
- No generic fonts (Inter / Roboto / Arial).
- Do not break the warm-luxury theme.
- Keep `changes/changes.md` updated.
