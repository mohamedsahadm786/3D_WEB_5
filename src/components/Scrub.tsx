import { type ReactNode } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { useChapterProgress } from './Chapter';
import { prefersReducedMotion } from '@/lib/motionPrefs';

/*
 * Scrub — a reveal whose opacity + drift are scrubbed to the parent <Chapter>'s
 * scroll progress, so it reveals AS you scroll through it and reverses when you
 * scroll back. Replaces one-shot whileInView reveals inside chapters.
 *
 * `range`:
 *   [in0, in1]              fade/drift in across that progress span
 *   [in0, in1, out0, out1]  fade in, hold, then fade out (like the reference's
 *                           section titles entering and leaving a room)
 */

type Range2 = [number, number];
type Range4 = [number, number, number, number];

interface ScrubProps {
  children: ReactNode;
  range?: Range2 | Range4;
  /** vertical drift distance in px (default 48) */
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'p' | 'h1' | 'h2' | 'h3';
}

export function Scrub({ children, range = [0, 0.4], y = 48, className, as = 'div' }: ScrubProps) {
  const progress = useChapterProgress();
  const reduced = prefersReducedMotion();
  const M = motion[as];

  const isInOut = range.length === 4;
  const inputs = range as number[];
  const opacityKeys = isInOut ? [0, 1, 1, 0] : [0, 1];
  const yKeys = isInOut ? [y, 0, 0, -y * 0.5] : [y, 0];

  /* fallback keeps Scrub visible if ever rendered outside a Chapter */
  const fallback = useMotionValue(range[1]);
  const src = progress ?? fallback;
  const opacity = useTransform(src, inputs, opacityKeys, { clamp: true });
  const ty = useTransform(src, inputs, yKeys, { clamp: true });

  if (reduced || !progress) {
    return <M className={className}>{children}</M>;
  }
  return (
    <M className={className} style={{ opacity, y: ty }}>
      {children}
    </M>
  );
}
