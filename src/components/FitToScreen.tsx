import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/*
 * FitToScreen — compacts a section so it fits one viewport (a globe face).
 *
 * It measures the child's natural (un-scaled) height and, if it overflows the
 * face, applies a uniform downscale so the whole "page" is visible at once
 * with no internal scrolling. Shorter content is left at scale 1 and centred.
 */
export default function FitToScreen({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const o = outer.current;
    const n = inner.current;
    if (!o || !n) return;

    /* offsetHeight is the un-transformed layout height, so reading it after a
       scale change is stable — no measure/apply feedback loop. */
    const measure = () => {
      const avail = o.clientHeight;
      const natural = n.offsetHeight;
      if (avail > 0 && natural > 0) {
        setScale(Math.min(1, avail / natural));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(n);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div ref={outer} className="grid h-full w-full place-items-center overflow-hidden">
      <div
        ref={inner}
        className="w-full"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {children}
      </div>
    </div>
  );
}
