import { useRef, type ReactNode } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motionPrefs';
import { RevealStaticContext } from './Reveal';
import FitToScreen from './FitToScreen';

/*
 * GlobeCarousel — the rotating "globe" of pages.
 *
 * Each face is one section, mounted on the side of a regular prism (a faceted
 * globe). The carousel pins to the viewport; scroll is converted into a Y-axis
 * rotation of the prism, so scrolling down turns the globe and the next page
 * swings in from the right — no vertical page movement at all.
 *
 *   scene  → holds the perspective
 *   prism  → preserve-3d, translateZ(-R) back so the front face sits on the
 *            camera plane, then rotateY(scroll)
 *   face i → rotateY(i·segment) translateZ(R) — fans the faces into a prism
 *
 * Reduced motion: no pin, no 3D — the sections render as a plain vertical
 * stack so the page stays fully usable.
 */

export interface GlobeFace {
  /** Tailwind background class matching the section, fills the face behind it. */
  bg: string;
  node: ReactNode;
}

export default function GlobeCarousel({ faces }: { faces: GlobeFace[] }) {
  const n = faces.length;
  const seg = 360 / n;

  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const prismRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !wrapRef.current || !pinRef.current || !prismRef.current) {
        return;
      }
      const prism = prismRef.current;
      const scene = sceneRef.current!;
      let radius = 0;

      /* size the prism to the viewport — recomputed on resize */
      const layout = () => {
        const w = window.innerWidth;
        radius = w / 2 / Math.tan(Math.PI / n);
        scene.style.perspective = `${w * 1.85}px`;
        Array.from(prism.children).forEach((face, i) => {
          (face as HTMLElement).style.transform =
            `rotateY(${i * seg}deg) translateZ(${radius}px)`;
        });
      };

      const setRotation = (deg: number) => {
        prism.style.transform = `translateZ(${-radius}px) rotateY(${deg}deg)`;
      };

      layout();
      setRotation(0);

      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: () => '+=' + window.innerHeight * n,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: 0.7,
        snap: n > 1
          ? {
              snapTo: 1 / (n - 1),
              duration: { min: 0.2, max: 0.6 },
              ease: 'power2.inOut',
            }
          : undefined,
        onUpdate: (self) => setRotation(-self.progress * (n - 1) * seg),
      });

      const onResize = () => {
        layout();
        setRotation(-st.progress * (n - 1) * seg);
      };
      window.addEventListener('resize', onResize);

      return () => {
        st.kill();
        window.removeEventListener('resize', onResize);
      };
    },
    { scope: wrapRef, dependencies: [n, seg, reduced] },
  );

  /* reduced motion — plain stacked sections, no globe */
  if (reduced) {
    return <>{faces.map((f, i) => <div key={i}>{f.node}</div>)}</>;
  }

  return (
    <RevealStaticContext.Provider value={true}>
      <div ref={wrapRef} data-globe>
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          <div ref={sceneRef} className="globe-scene absolute inset-0 overflow-hidden">
            <div ref={prismRef} className="globe-prism absolute inset-0">
              {faces.map((face, i) => (
                <div
                  key={i}
                  data-globe-face
                  data-dark={face.bg.includes('noir') || undefined}
                  className={`globe-face absolute inset-0 overflow-hidden ${face.bg}`}
                >
                  <FitToScreen>{face.node}</FitToScreen>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RevealStaticContext.Provider>
  );
}
