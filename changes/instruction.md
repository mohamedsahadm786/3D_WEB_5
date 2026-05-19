# Hero Animation — "Golden Glob Scroll-Zoom" — full recreation guide

> **What this document is.** A complete, self-contained spec for the home-page
> hero animation in this project — the **golden 3D form that zooms in as you
> scroll while the text in front of it dissolves**. Drop this file into another
> repository and an AI agent (or a developer) can rebuild the exact same effect
> from it alone. It explains the concept, the libraries, every file, full code,
> step-by-step recreation, tuning knobs, and the gotchas.

---

## 1. The effect, in plain words

On first load the visitor sees a centred **headline + sub-text + buttons**, and
behind them a slowly rotating **gold faceted "glob"** (a low-poly sphere) inside
a faint wireframe shell, floating in a field of drifting golden dust motes.

As the visitor **scrolls down**, the page does **not** scroll away immediately.
Instead the hero **pins** (sticks to the viewport) and, for the length of
roughly one extra screen-height of scrolling, two things happen *together*,
driven by scroll position:

1. **The glob zooms in / grows monumental** — the 3D camera dollies forward and
   the form scales up.
2. **The text dissolves** — the headline/sub-text/buttons fade to transparent
   and drift gently upward.

When that scroll budget is spent, the hero unpins and the next section scrolls
up normally. Scrolling back up reverses everything (it is *scrubbed*, not a
one-shot trigger).

The whole thing is **scroll-position-driven** ("scrubbed"), so it feels welded
to the scrollbar / trackpad — not a timed animation.

---

## 2. Libraries used

| Job | Library | Why |
|-----|---------|-----|
| 3D "glob", motes, lighting, camera | **three** (Three.js) | Bare WebGL scene — no React-Three-Fiber needed. |
| Scroll-driven **pin + progress** | **gsap** + **ScrollTrigger** plugin | ScrollTrigger pins the section and reports a `0→1` progress value. |
| `useGSAP` React hook | **@gsap/react** | Safe GSAP lifecycle inside React (auto-cleanup). |
| Carrying scroll progress to React/UI | **motion** (`motion/react`, formerly Framer Motion) | `MotionValue` + `useTransform` map progress → opacity/translate without re-rendering. |
| Smooth-scroll feel | **lenis** | Makes the scrub buttery; syncs to ScrollTrigger. Optional but recommended. |
| Rotating typewriter headline | tiny custom hook | No library — see §8. Optional. |

Install (npm):

```bash
npm i three gsap @gsap/react motion lenis
npm i -D @types/three
```

> **Minimum viable version:** you only strictly need **three + gsap +
> ScrollTrigger**. `motion` just makes the text fade ergonomic (you can do it
> with plain inline styles instead). `lenis` only improves the *feel*.

---

## 3. Mental model — how it actually works

The trick is one shared number: **`progress`, a value from 0 to 1**.

```
            scroll position
                  │
                  ▼
        ┌───────────────────────┐
        │  ScrollTrigger        │  pins the section,
        │  (pin + scrub)        │  outputs progress 0→1
        └───────────┬───────────┘
                    │  progress
        ┌───────────┴───────────┐
        ▼                       ▼
  Three.js scene           Text layer
  • camera.z  (dolly)      • opacity 1→0
  • form.scale (zoom)      • translateY 0→ -96px
```

- **ScrollTrigger** pins the hero and converts "how far through the pinned
  region am I" into `progress` (`0` = just entered, `1` = about to leave).
- That single `progress` number is fanned out to **two consumers**:
  - the **WebGL render loop**, which sets the camera distance and the form's
    scale every frame from `progress`;
  - the **text layer**, whose opacity and Y-offset are mapped from `progress`.

Because both read the *same* scrubbed value, the zoom and the fade are always
perfectly in sync, forwards and backwards.

In this codebase the pinning logic is wrapped in a reusable component called
**`Chapter`**, and `progress` is shared via React Context as a `MotionValue`.
You can copy that pattern or inline it — both are explained below.

---

## 4. File-by-file (full code)

Paths below assume a `src/` React + Vite + TypeScript app. Adapt freely.

### 4.1 `src/lib/gsap.ts` — register GSAP once

```ts
/* Single GSAP entry-point — register plugins once, import gsap from here. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

> Register plugins exactly once for the whole app. Always import `gsap` /
> `ScrollTrigger` from this file, never from `'gsap'` directly elsewhere.

### 4.2 `src/lib/motionPrefs.ts` — reduced-motion check

```ts
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
```

### 4.3 `src/components/Chapter.tsx` — the pinned, scrubbed "room" primitive

This is the reusable wrapper. It pins its content and publishes `progress`
(0→1) through React Context. Under reduced-motion it degrades to a normal
static section.

```tsx
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motionPrefs';

const ChapterCtx = createContext<MotionValue<number> | null>(null);

/** Chapter scroll progress (0→1), or null when used outside a <Chapter>. */
export function useChapterProgress(): MotionValue<number> | null {
  return useContext(ChapterCtx);
}

interface ChapterProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** extra scroll length while pinned, in viewport-heights (default 1) */
  distance?: number;
  /** pin the chapter while its timeline scrubs (default true) */
  pin?: boolean;
  /** scrub smoothing in seconds, or true for instant catch-up (default 1) */
  scrub?: number | boolean;
}

export default function Chapter({
  children,
  id,
  className = '',
  distance = 1,
  pin = true,
  scrub = 1,
}: ChapterProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !wrapRef.current || !pinRef.current) return;
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: () => '+=' + window.innerHeight * distance,
        pin: pin ? pinRef.current : false,
        pinSpacing: pin,
        scrub,
        onUpdate: (self) => progress.set(self.progress),
      });
      return () => st.kill();
    },
    { scope: wrapRef, dependencies: [distance, pin, scrub] },
  );

  return (
    <ChapterCtx.Provider value={progress}>
      <section ref={wrapRef} id={id} className={className} data-chapter>
        <div ref={pinRef} className="relative flex min-h-[100svh] flex-col overflow-hidden">
          {children}
        </div>
      </section>
    </ChapterCtx.Provider>
  );
}
```

**Key lines:**
- `start: 'top top'` — begin when the section's top hits the viewport's top.
- `end: '+=' + innerHeight * distance` — the pinned region lasts `distance`
  screen-heights (`1.3` in the hero → ~1.3 screens of scroll).
- `pin` + `pinSpacing` — physically stick the inner element and reserve space.
- `scrub: 1` — progress lags scroll by 1s of smoothing → that welded feel.
- `onUpdate` → `progress.set(self.progress)` — publish 0→1 every tick.

### 4.4 `src/components/HeroCanvas.tsx` — the WebGL "golden glob"

Plain Three.js (no R3F). It reads the chapter `progress` and, every frame,
**dollies the camera** and **scales the form** from that value.

```tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useChapterProgress } from './Chapter';

/*
 * WebGL hero scene — a warm-lit faceted form in a field of drifting motes.
 * - The camera DOLLIES forward and the form SCALES UP, scrubbed to the parent
 *   Chapter's scroll progress — the object grows monumental as you scroll in.
 * - Dual cursor effect: the camera reprojects toward the cursor (damped lerp)
 *   and the form independently ORBITS to follow the cursor.
 * Pauses when off-screen / tab hidden; disabled for reduced motion.
 */
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const chapterProgress = useChapterProgress();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;
    const isMobile = window.innerWidth < 768;

    /* ---- renderer ---- */
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.3 : 1.6));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    /* ---- scene + camera ---- */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xefe8da, 0.085); // match your page bg colour

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const CAM_Z_FAR = 9;   // camera distance at progress 0
    const CAM_Z_NEAR = 5.2; // camera distance at progress 1 (zoomed in)
    camera.position.set(0, 0, CAM_Z_FAR);

    /* ---- lighting (warm museum key) ---- */
    scene.add(new THREE.AmbientLight(0xf4ecd9, 0.9));
    const key = new THREE.DirectionalLight(0xffe9c4, 2.1);
    key.position.set(4, 6, 7);
    scene.add(key);
    const rim = new THREE.PointLight(0xa6824c, 3.4, 26);
    rim.position.set(-6, -2, 4);
    scene.add(rim);

    /* ---- central faceted form (the "glob") ---- */
    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.IcosahedronGeometry(1.65, 1); // detail 1 = low-poly facets
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xc9a86a,      // gold
      metalness: 0.55,
      roughness: 0.32,
      flatShading: true,    // crisp facets
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const shellGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const shell = new THREE.Mesh(
      shellGeo,
      new THREE.MeshBasicMaterial({
        color: 0x8b7b62,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      }),
    );
    group.add(shell);

    /* ---- drifting motes ---- */
    const COUNT = isMobile ? 420 : 900;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
      speeds[i] = 0.08 + Math.random() * 0.22;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0xc6a36a,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    /* ---- interaction state ---- */
    const pointer = { x: 0, y: 0 };
    const cam = { x: 0, y: 0 };
    const orbit = { x: 0, y: 0 };
    let scrollN = 0; // scrubbed chapter progress 0→1

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer);

    /* ---- visibility gating (don't render off-screen) ---- */
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0,
    });
    io.observe(mount);

    /* ---- resize ---- */
    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    /* ---- render loop ---- */
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      // >>> THE SCROLL VALUE <<< — read the scrubbed chapter progress 0→1
      scrollN = chapterProgress ? chapterProgress.get() : 0;

      // idle rotation
      core.rotation.x = t * 0.12;
      core.rotation.z = t * 0.05;
      shell.rotation.x = -t * 0.06;
      shell.rotation.y = t * 0.09;

      // cursor orbit — the form turns to follow the pointer (damped catch-up)
      orbit.x += (pointer.x * 0.6 - orbit.x) * 0.045;
      orbit.y += (-pointer.y * 0.35 - orbit.y) * 0.045;
      group.rotation.y = orbit.x + t * 0.17;
      group.rotation.x = orbit.y;

      // >>> SCROLL ZOOM #1: the form rises + grows monumental <<<
      group.position.y = Math.sin(t * 0.6) * 0.18 - scrollN * 0.6;
      group.scale.setScalar(1 + scrollN * 0.55);

      // motes rise + wrap around
      const pos = moteGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        let y = pos.getY(i) + speeds[i] * dt;
        if (y > 8) y = -8;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      motes.rotation.y = t * 0.02;

      // damped camera parallax + >>> SCROLL ZOOM #2: camera dolly-in <<<
      cam.x += (pointer.x * 0.85 - cam.x) * 0.045;
      cam.y += (-pointer.y * 0.55 - cam.y) * 0.045;
      camera.position.x = cam.x;
      camera.position.y = cam.y;
      camera.position.z = CAM_Z_FAR + (CAM_Z_NEAR - CAM_Z_FAR) * scrollN;
      camera.lookAt(0, group.position.y * 0.4, 0);

      renderer.render(scene, camera);
    };
    tick();

    /* ---- cleanup (critical — dispose GPU resources) ---- */
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      coreGeo.dispose();
      shellGeo.dispose();
      moteGeo.dispose();
      coreMat.dispose();
      moteMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [chapterProgress]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
```

**The two lines that make the zoom:**
```ts
group.scale.setScalar(1 + scrollN * 0.55);                          // form grows
camera.position.z = CAM_Z_FAR + (CAM_Z_NEAR - CAM_Z_FAR) * scrollN; // camera moves in
```
Doing both at once gives a strong "rushing in" feel; you can use either alone.

### 4.5 `src/sections/Hero.tsx` — assembling glob + text

The hero wraps `HeroCanvas` and the text layer in a `Chapter`, and maps the
same `progress` to the text's opacity + translateY.

```tsx
import { lazy, Suspense } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import Chapter, { useChapterProgress } from '@/components/Chapter';

/* Three.js scene split into its own chunk — loads after first paint */
const HeroCanvas = lazy(() => import('@/components/HeroCanvas'));

export default function Hero() {
  return (
    <Chapter id="home" distance={1.3} scrub={1}>
      <HeroInner />
    </Chapter>
  );
}

function HeroInner() {
  /* scrubbed to the chapter's pinned scroll progress */
  const fallback = useMotionValue(0);
  const progress = useChapterProgress() ?? fallback;

  // map the SAME 0→1 progress onto the text layer
  const contentY = useTransform(progress, [0, 0.6], [0, -96]);   // drift up
  const contentFade = useTransform(progress, [0, 0.55], [1, 0]); // fade out

  return (
    <div className="relative flex flex-1 items-center justify-center">
      {/* live WebGL glob — camera scrubs to chapter progress */}
      <Suspense fallback={null}>
        <HeroCanvas />
      </Suspense>

      {/* text layer — fades + lifts as you scroll */}
      <motion.div
        style={{ y: contentY, opacity: contentFade }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <span className="eyebrow">High-Purity Research Peptides</span>
        <h1 className="display mt-7 text-[clamp(2.6rem,7vw,6rem)]">
          Your headline here
        </h1>
        <p className="mt-7 max-w-xl">Your sub-paragraph here.</p>
        <div className="mt-10 flex gap-4">
          <a className="btn-primary">Primary CTA</a>
          <a className="btn-ghost">Secondary CTA</a>
        </div>
      </motion.div>
    </div>
  );
}
```

**The two lines that fade the text:**
```ts
const contentY    = useTransform(progress, [0, 0.6],  [0, -96]); // 0→60% scroll: slide up 96px
const contentFade = useTransform(progress, [0, 0.55], [1, 0]);   // 0→55% scroll: opacity 1→0
```
`useTransform` re-maps the input range to the output range; the text is fully
gone at 55 % of the pinned scroll, before the chapter unpins.

### 4.6 Smooth scroll (Lenis) — optional but recommended

The scrub feels much smoother with Lenis driving scroll, synced to
ScrollTrigger. Mount this once near the app root, wrapping everything:

```tsx
import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);          // keep ST in sync
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);                              // drive Lenis from GSAP's ticker
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

---

## 5. Step-by-step recreation checklist

1. **Install** the libraries (§2).
2. Add **`lib/gsap.ts`** (register ScrollTrigger once) and
   **`lib/motionPrefs.ts`** (§4.1–4.2).
3. Add the **`Chapter`** component (§4.3). This is the pin + `progress` engine.
4. Add **`HeroCanvas`** (§4.4). It draws the glob and reads `progress` from the
   chapter to dolly the camera and scale the form.
5. Build the **Hero section** (§4.5): a `<Chapter distance={1.3}>` containing
   `<HeroCanvas/>` plus a text layer whose `opacity`/`y` are `useTransform`-ed
   from the same `progress`.
6. (Recommended) Wrap the app in **`SmoothScroll`** (§4.6) for the buttery feel.
7. Make sure the hero's text layer sits **above** the canvas (`z-10` vs the
   canvas's `absolute inset-0`) and the canvas container is `position:absolute`
   filling the hero.
8. Set the Three.js **`scene.fog`** colour and the page background to the same
   value so the glob blends into the page edges.
9. **Test**: scroll slowly — glob should grow as text fades; scroll back up — it
   reverses. Resize the window; check mobile.

---

## 6. Tuning knobs (where to change the feel)

| You want… | Change |
|-----------|--------|
| Longer / shorter pinned scroll | `<Chapter distance={…}>` — viewport-heights (1.3 default). |
| Snappier vs. floatier scrub | `<Chapter scrub={…}>` — seconds of lag; `0.4` snappy, `1.5` floaty. |
| Stronger / weaker zoom (form) | `group.scale.setScalar(1 + scrollN * 0.55)` — raise `0.55`. |
| Stronger / weaker zoom (camera) | `CAM_Z_FAR` / `CAM_Z_NEAR` — bigger gap = more dolly. |
| Text disappears sooner / later | `contentFade` input range `[0, 0.55]` — lower the `0.55`. |
| How far text lifts | `contentY` output range `[0, -96]` — px of upward drift. |
| Glob shape | `IcosahedronGeometry(radius, detail)` — `detail 0`=chunky, `2`=smoother. Or swap for `DodecahedronGeometry`, `TorusKnotGeometry`, etc. |
| Glob colour / finish | `coreMat` `color`, `metalness`, `roughness`, `flatShading`. |
| Mote density | `COUNT` (900 desktop / 420 mobile). |

---

## 7. Accessibility & performance (do not skip)

- **Reduced motion:** every entry point checks `prefers-reduced-motion`.
  `Chapter` skips pinning (renders a normal section); `HeroCanvas` returns
  early and never starts WebGL; `SmoothScroll` skips Lenis. The page is fully
  usable, just static.
- **Off-screen gating:** `HeroCanvas` uses an `IntersectionObserver` + the
  `document.hidden` check to skip rendering when the hero is scrolled away or
  the tab is hidden — saves battery/GPU.
- **GPU cleanup:** the `useEffect` return disposes every geometry, material and
  the renderer, and removes the canvas. Skipping this leaks GPU memory on route
  changes / hot-reload.
- **Code-split the 3D:** `HeroCanvas` is `lazy()`-imported so Three.js
  (~470 KB) is a separate chunk and does not block first paint.
- **Mobile:** lower pixel-ratio cap, fewer motes, antialias off — already in
  the code via the `isMobile` flag.
- **`min-h-[100svh]`** (small-viewport-height) avoids mobile-browser URL-bar
  jump while pinned.

---

## 8. Optional extras used in the original hero

- **Rotating typewriter headline** — a small hook types a phrase, holds,
  deletes, advances to the next; under reduced-motion it shows the first phrase
  statically. Not required for the zoom/fade effect; include only if you want
  the headline to cycle.
- **Cursor parallax** — in `HeroCanvas` the camera and the form both ease
  toward the pointer (the `cam` / `orbit` damped lerps). Drop those blocks if
  you only want the scroll effect.
- **Parallax background photo** — the original also drifts a faint background
  image with `useTransform(progress, [0,1], ['0%','18%'])`. Pure decoration.

---

## 9. Common pitfalls

- **`ScrollTrigger` not registered** → pin silently does nothing. Always
  `gsap.registerPlugin(ScrollTrigger)` once (§4.1).
- **Forgetting `pinSpacing`** → the page "jumps" when the section unpins
  because no space was reserved. Keep `pinSpacing: pin`.
- **Reading `progress` via React state** → re-renders every frame, janky. Use a
  `MotionValue` (`.get()` in the render loop, `useTransform` for UI) — it does
  **not** trigger React re-renders.
- **Canvas eats clicks** → give the canvas wrapper `pointer-events: none` if
  buttons sit on top, or ensure the text layer has a higher `z-index`.
- **Lenis + ScrollTrigger out of sync** → you must call
  `lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from
  `gsap.ticker` (§4.6), or pin positions drift.
- **Hot-reload leaks** → without the disposal cleanup you stack WebGL contexts
  until the browser kills them. Keep the `useEffect` return block.
- **`end` not a function** → use `end: () => '+=' + innerHeight * distance` so
  it recomputes on resize.

---

## 10. Adapting to a non-React stack

The concept is framework-agnostic:

- **Vanilla JS:** use `ScrollTrigger.create({... onUpdate: self => { const p =
  self.progress; /* set camera.z, form.scale, text.style.opacity */ }})`. No
  `Chapter`/Context needed — just a module-scope `progress` variable.
- **Vue / Svelte:** keep `gsap.ts`, `HeroCanvas` logic, and ScrollTrigger
  identical; replace the React Context with a store/ref holding `progress`.
- The **Three.js scene code (§4.4) is 100 % portable** — it is plain WebGL.

The only React-specific parts are `Chapter` (Context + `useGSAP`) and the
`useTransform` text mapping. Everything else copies verbatim.
