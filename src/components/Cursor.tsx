import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/*
 * Custom cursor — a precise dot plus a soft lagging ring.
 * Fine-pointer devices only; hidden for reduced-motion.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const [down, setDown] = useState(false);
  /* golden cursor while hovering a dark / brown section */
  const [onDark, setOnDark] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setHot(!!t.closest('a, button, [data-hot]'));
      setOnDark(!!t.closest('[data-dark]'));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', dn);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', dn);
      window.removeEventListener('pointerup', up);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <motion.div
        className={`cursor-dot absolute h-1.5 w-1.5 rounded-full ${
          onDark ? 'bg-gold-light' : 'bg-noir'
        }`}
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className={`cursor-ring absolute rounded-full border ${
          onDark ? 'border-gold-light/55' : 'border-noir/40'
        }`}
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hot ? 56 : 34,
          height: hot ? 56 : 34,
          opacity: hot ? 0.9 : 0.5,
          scale: down ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      />
    </div>
  );
}
