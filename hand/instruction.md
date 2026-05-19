# Hand-Holding-Phone Scroll Animation — Exact Implementation Guide

> **For the AI assistant reading this:** This `hand/` folder contains every image and
> a precise spec to recreate the scroll-driven "hand holding a phone" animation
> exactly as it runs on the Alluvi website. Read this whole file. Copy the images
> into the target project, then implement the effect with the code below.
>
> This document describes the **exact behaviour** of the live site (extracted from
> the site's Webflow interaction data), and gives a **portable, dependency-free
> reimplementation** that reproduces it 1:1. The live site uses Webflow's IX2
> engine — that is NOT portable, so use the vanilla/React code here instead. The
> *visual result is identical*.

---

## 1. What the effect actually does (exact behaviour)

A photo of a **hand holding an iPhone** sits in the hero section. The hand+phone
photo **never moves, never scales, never zooms** — it is 100% static. Only the
**image shown on the phone's screen changes** as the user scrolls.

There are **3 screen images** and they do **NOT crossfade**. They **slide**:

| Scroll progress | What happens on the phone screen |
|-----------------|----------------------------------|
| **0% → 24%**    | **Lock screen** is shown, sitting still. |
| **24% → 42%**   | **Lock screen slides straight UP** and off the top, revealing the **Home screen** underneath. |
| **42% → 57%**   | **Dashboard slides IN from the right** and covers the Home screen. At the same time the Home screen nudges slightly left (−10%) for a subtle parallax. |
| **57% → 100%**  | **Dashboard** stays in place. |

So the order the user sees is: **Lock screen → Home screen → Dashboard.**

The phone section is **sticky** — the phone stays pinned in the viewport while the
user scrolls through a tall scroll region, and that scroll distance drives the 0→100%
progress above.

> **Important:** This is a *slide* transition, not a fade and not a zoom. The hand
> and phone are a fixed photo; the screens are layered images that translate
> (move) in and out behind the phone's screen cut-out.

---

## 2. Images in this folder (exact files used)

Copy **all** of these into the target project. Recommended location:
`public/images/hand/`. The code below assumes that path.

### The hand + phone — static base layer
| File | Purpose |
|------|---------|
| `Holding-iPhone_1Holding-iPhone.webp` | **Primary image** — hand holding the iPhone. Main `src`. |
| `Holding-iPhone_1-p-500.png`  | Responsive `srcset` variant — 500w |
| `Holding-iPhone_1-p-800.png`  | Responsive `srcset` variant — 800w |
| `Holding-iPhone_1-p-1080.png` | Responsive `srcset` variant — 1080w |
| `Holding-iPhone_1-p-1600.png` | Responsive `srcset` variant — 1600w |
| `Holding-iPhone_1-p-2000.png` | Responsive `srcset` variant — 2000w |

### The 3 screens that slide — overlay layers
| File | Role on site | Class on the live site |
|------|--------------|------------------------|
| `Home-screen.png` | Home screen (base layer, always centered) | `product-phone-demo-image _1` |
| `Dashboard.png`   | Dashboard (slides in from the right) | `product-phone-demo-image _2` |
| `68922e37fb646dfb29e968e7_📱-Lock-Screen-2.jpg` | Lock screen (starts on top, slides up) | `iphone-lock-screen-image` |

> ⚠️ The third filename contains a literal emoji (`📱`) and a hash prefix. It works,
> but in HTML/JS the `src` may need URL-encoding (`%F0%9F%93%B1`). To avoid trouble,
> you may rename it to `lock-screen.jpg` after copying and update the path. The code
> below keeps the **exact original filename** and shows it encoded.

---

## 3. DOM structure & stacking order

The 3 screen images are stacked inside a clipped box (the "phone screen"). DOM order
sets the stacking (last = on top):

```
phone screen box  (overflow: hidden — clips everything to the phone's display)
├── Home-screen.png   ← bottom layer  (always at center, x: 0)
├── Dashboard.png     ← middle layer  (starts off-screen right, x: 100%)
└── Lock-Screen.jpg   ← top layer     (starts visible, y: 0)
```

The hand+phone photo sits *behind* this box; the box is positioned over the phone's
glass area so the screens appear "inside" the phone.

---

## 4. Exact animation keyframes (the source of truth)

Driven by **scroll progress 0 → 100** of the phone section. Each screen is moved
with a CSS `transform: translate(...)`. Values between keyframes are **linearly
interpolated**.

**Lock screen** (`Lock-Screen.jpg`) — vertical slide:
| Progress | `translateY` |
|----------|--------------|
| 0%       | `0%`   (fully covering the phone screen) |
| 24%      | `0%`   (still still) |
| 42%      | `-100%` (slid completely up & out) |
| 42–100%  | stays `-100%` |

**Dashboard** (`Dashboard.png`) — horizontal slide:
| Progress | `translateX` |
|----------|--------------|
| 0%       | `100%` (off-screen to the right) |
| 42%      | `100%` (still off-screen) |
| 57%      | `0%`   (slid fully into center) |
| 57–100%  | stays `0%` |

**Home screen** (`Home-screen.png`) — base layer, small parallax nudge:
| Progress | `translateX` |
|----------|--------------|
| 0%       | `0%`  (centered) |
| 42%      | `0%`  (centered) |
| 57%      | `-10%` (nudged slightly left as Dashboard covers it) |
| 57–100%  | stays `-10%` |

> The live Webflow interaction also slides the big hero heading text apart and
> resizes a background glow during the same scroll. Those are separate hero-text
> decorations, **not** part of the phone effect, and are intentionally omitted here.

---

## 5. Implementation A — Plain HTML / CSS / JS (no dependencies)

### 5.1 HTML
```html
<!-- Tall section = the scroll distance that drives the animation -->
<section class="phone-scroll-section">
  <!-- Sticky wrapper pins the phone while the section scrolls past -->
  <div class="phone-sticky">
    <div class="phone-stage">

      <!-- STATIC base: hand holding the phone (never moves/scales) -->
      <img
        class="hand-phone"
        src="images/hand/Holding-iPhone_1Holding-iPhone.webp"
        srcset="
          images/hand/Holding-iPhone_1-p-500.png 500w,
          images/hand/Holding-iPhone_1-p-800.png 800w,
          images/hand/Holding-iPhone_1-p-1080.png 1080w,
          images/hand/Holding-iPhone_1-p-1600.png 1600w,
          images/hand/Holding-iPhone_1-p-2000.png 2000w,
          images/hand/Holding-iPhone_1Holding-iPhone.webp 2475w"
        sizes="(max-width: 768px) 90vw, 600px"
        alt="Hand holding a phone" />

      <!-- The phone's screen cut-out: clips the sliding screens -->
      <div class="phone-screen">
        <!-- DOM order = stacking order: Home (bottom) -> Dashboard -> Lock (top) -->
        <img class="screen screen-home"
             src="images/hand/Home-screen.png" alt="" />
        <img class="screen screen-dashboard"
             src="images/hand/Dashboard.png" alt="" />
        <img class="screen screen-lock"
             src="images/hand/68922e37fb646dfb29e968e7_%F0%9F%93%B1-Lock-Screen-2.jpg" alt="" />
      </div>

    </div>
  </div>
</section>
```

### 5.2 CSS
```css
/* Tall section height = how long the phone stays pinned.
   300vh ≈ two full viewport scrolls of animation. Tune to taste. */
.phone-scroll-section {
  position: relative;
  height: 300vh;
}

/* Pins the phone in the viewport while the section scrolls through */
.phone-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Holds the hand photo; the screen box is positioned relative to this */
.phone-stage {
  position: relative;
  width: min(600px, 90vw);
}

/* STATIC hand + phone — no transform is ever applied to this */
.hand-phone {
  display: block;
  width: 100%;
  height: auto;
}

/* The phone's screen area. TUNE these % values so the box sits exactly
   over the phone's glass in the photo (see section 8). overflow:hidden
   is what makes the screens "slide in/out" of the phone. */
.phone-screen {
  position: absolute;
  top: 30%;       /* tune */
  left: 30.5%;    /* tune */
  width: 47%;     /* tune */
  height: 46%;    /* tune */
  border-radius: 8% / 4%;
  overflow: hidden;
}

/* All 3 screens fill the screen box and stack on top of each other */
.phone-screen .screen {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

/* Initial resting positions (before JS runs / progress = 0):
   Home centered, Dashboard off-screen right, Lock covering. */
.screen-home      { transform: translateX(0%); }
.screen-dashboard { transform: translateX(100%); }
.screen-lock      { transform: translateY(0%); }

@media (prefers-reduced-motion: reduce) {
  /* Optional: jump straight to the final state instead of animating */
}
```

### 5.3 JavaScript
```js
(function () {
  const section   = document.querySelector('.phone-scroll-section');
  const home      = document.querySelector('.screen-home');
  const dashboard = document.querySelector('.screen-dashboard');
  const lock      = document.querySelector('.screen-lock');
  if (!section || !home || !dashboard || !lock) return;

  // Linear interpolation helper: map progress p (within [a,b]) onto [from,to]
  function lerpRange(p, a, b, from, to) {
    if (p <= a) return from;
    if (p >= b) return to;
    const t = (p - a) / (b - a);
    return from + (to - from) * t;
  }

  function update() {
    const rect = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;

    // progress: 0 when section top hits viewport top, 100 when fully scrolled
    const progress = scrollable > 0
      ? Math.min(100, Math.max(0, (-rect.top / scrollable) * 100))
      : 0;

    // --- Lock screen: translateY 0% (0–24) -> -100% (42) ---
    const lockY = lerpRange(progress, 24, 42, 0, -100);
    lock.style.transform = `translateY(${lockY}%)`;

    // --- Dashboard: translateX 100% (0–42) -> 0% (57) ---
    const dashX = lerpRange(progress, 42, 57, 100, 0);
    dashboard.style.transform = `translateX(${dashX}%)`;

    // --- Home screen: translateX 0% (0–42) -> -10% (57) ---
    const homeX = lerpRange(progress, 42, 57, 0, -10);
    home.style.transform = `translateX(${homeX}%)`;
  }

  // rAF-throttled scroll handler for smoothness
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update(); // initial paint
})();
```

That's the whole effect. The keyframe ranges `24/42`, `42/57`, `42/57` are taken
**directly** from the live site's interaction data — do not change them if you want
an exact match.

---

## 6. Implementation B — React + TypeScript component

For React/Next/Vite projects (the source project is Vite + React). Render
`<PhoneScrollAnimation />` where the effect should appear. Needs the CSS from 5.2.

```tsx
import { useEffect, useRef } from 'react';

// progress p mapped from [a,b] onto [from,to], clamped
function lerpRange(p: number, a: number, b: number, from: number, to: number) {
  if (p <= a) return from;
  if (p >= b) return to;
  return from + (to - from) * ((p - a) / (b - a));
}

export default function PhoneScrollAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const homeRef    = useRef<HTMLImageElement>(null);
  const dashRef    = useRef<HTMLImageElement>(null);
  const lockRef    = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0
        ? Math.min(100, Math.max(0, (-rect.top / scrollable) * 100))
        : 0;

      if (lockRef.current)
        lockRef.current.style.transform =
          `translateY(${lerpRange(progress, 24, 42, 0, -100)}%)`;
      if (dashRef.current)
        dashRef.current.style.transform =
          `translateX(${lerpRange(progress, 42, 57, 100, 0)}%)`;
      if (homeRef.current)
        homeRef.current.style.transform =
          `translateX(${lerpRange(progress, 42, 57, 0, -10)}%)`;
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section ref={sectionRef} className="phone-scroll-section">
      <div className="phone-sticky">
        <div className="phone-stage">
          <img
            className="hand-phone"
            src="/images/hand/Holding-iPhone_1Holding-iPhone.webp"
            srcSet="
              /images/hand/Holding-iPhone_1-p-500.png 500w,
              /images/hand/Holding-iPhone_1-p-800.png 800w,
              /images/hand/Holding-iPhone_1-p-1080.png 1080w,
              /images/hand/Holding-iPhone_1-p-1600.png 1600w,
              /images/hand/Holding-iPhone_1-p-2000.png 2000w,
              /images/hand/Holding-iPhone_1Holding-iPhone.webp 2475w"
            sizes="(max-width: 768px) 90vw, 600px"
            alt="Hand holding a phone"
          />
          <div className="phone-screen">
            <img ref={homeRef} className="screen screen-home"
                 src="/images/hand/Home-screen.png" alt="" />
            <img ref={dashRef} className="screen screen-dashboard"
                 src="/images/hand/Dashboard.png" alt="" />
            <img ref={lockRef} className="screen screen-lock"
                 src="/images/hand/68922e37fb646dfb29e968e7_%F0%9F%93%B1-Lock-Screen-2.jpg"
                 alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 7. Optional: scroll smoothing (match the live site exactly)

The live Webflow interaction applies **smoothing** (lag) so the screens ease toward
their target instead of tracking the scrollbar 1:1. To replicate, interpolate the
progress value toward its target each animation frame instead of jumping:

```js
let current = 0;            // smoothed progress
let target  = 0;            // raw progress from scroll

function loop() {
  target = computeRawProgress();          // 0–100 from getBoundingClientRect
  current += (target - current) * 0.12;   // 0.12 ≈ smoothing factor
  applyTransforms(current);               // same lerpRange calls as above
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

This is optional — the basic version in section 5/6 already looks correct. Add
smoothing only if you want the exact "weighted" feel of the original.

---

## 8. Tuning the screen cut-out (REQUIRED step)

The `.phone-screen` box (`top`, `left`, `width`, `height`, `border-radius`) **must
be hand-adjusted** so it sits exactly over the phone's glass display in
`Holding-iPhone_1Holding-iPhone.webp`. The values in the CSS are an estimate.

1. Temporarily add `outline: 2px solid red;` to `.phone-screen`.
2. Adjust `top` / `left` / `width` / `height` (percentages of `.phone-stage`)
   until the red box covers exactly the phone's screen.
3. Adjust `border-radius` to match the phone's rounded screen corners.
4. If the phone in the photo is tilted, add a matching `transform: rotate(...)`
   to `.phone-screen` (and account for it on the sliding screens).
5. Remove the outline.

If the screens look misaligned while sliding, the cut-out box is the cause — not
the JS.

---

## 9. Libraries / dependencies

**None required.** The portable implementation uses only built-in browser APIs:
- `getBoundingClientRect()` + `requestAnimationFrame`
- CSS `position: sticky` and CSS `transform`

The **live Alluvi site** uses **Webflow's IX2 interaction engine + jQuery** for this
(interaction `e-190`, action list `a-68` "Product Demo - On Desktop", a
`SCROLLING_IN_VIEW` continuous interaction). That stack is heavy and not portable —
**do not reproduce it.** The vanilla code above reproduces the exact visible result.

Optional alternatives (only if the target project already uses them):
- **GSAP ScrollTrigger** — `scrub: true` timeline with the same translate keyframes.
- **Framer Motion** — `useScroll` + `useTransform` mapping progress to translate.

---

## 10. Implementation checklist

- [ ] Copy every image from this `hand/` folder into `public/images/hand/` (or
      adjust the paths in the code).
- [ ] Add the CSS from section 5.2.
- [ ] Add Implementation A (vanilla) or B (React) — match the project's stack.
- [ ] Place `.phone-scroll-section` where the effect should appear (typically right
      after the hero).
- [ ] **Tune the `.phone-screen` cut-out** per section 8 — this is required.
- [ ] Verify on scroll: Lock screen sits → slides up → Home screen shows →
      Dashboard slides in from the right → Dashboard stays. Phone never moves.
- [ ] Keep the keyframe ranges (`24→42`, `42→57`) unchanged for an exact match.
- [ ] Test on mobile; reduce `.phone-scroll-section` height (e.g. `200vh`) if the
      pinned region feels too long.

---

## 11. Reference — the original live-site markup

From `src/routes/Home.tsx` on the Alluvi site (rendered inside a Webflow HTML block).
For reference only — build the clean version above instead.

```html
<div data-w-id="6017496f-b567-cee1-8497-55314a28c2dc" class="hero-product-demo">
  <div class="product-demo-sticky">
    <div class="product-phone-image-container">
      <div class="product-container">
        <div class="product-phone-image-holder">
          <img src="images/Holding-iPhone_1Holding-iPhone.webp" class="product-phone-image">
          <div class="product-phone-content">
            <img src="images/Home-screen.png"   class="product-phone-demo-image _1">
            <img src="images/Dashboard.png"     class="product-phone-demo-image _2">
            <img src="images/...Lock-Screen-2.jpg" class="iphone-lock-screen-image">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

- `data-w-id="6017496f-b567-cee1-8497-55314a28c2dc"` is the Webflow trigger element
  for the `SCROLLING_IN_VIEW` interaction that runs action list `a-68`.
- `.product-demo-sticky` provides the sticky pin.
- `.product-phone-content` is the clipped screen cut-out (`overflow: hidden`).
- `._1` = Home screen, `._2` = Dashboard, `.iphone-lock-screen-image` = Lock screen.
```
