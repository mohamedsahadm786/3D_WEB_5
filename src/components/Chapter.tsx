import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motionPrefs';

/*
 * Chapter — the scroll-scrubbed "room" primitive.
 *
 * Pins itself to the viewport and exposes a 0→1 progress MotionValue while the
 * reader scrolls through `distance` extra viewport-heights. Children read that
 * progress (via <Scrub> or useChapterProgress) to scrub their own motion —
 * mirroring the reference's pinned, timeline-scrubbed sections.
 *
 * Reduced motion: no pin, no ScrollTrigger — just a normal stacked section.
 */

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
