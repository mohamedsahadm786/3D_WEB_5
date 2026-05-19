import { createContext, useContext, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { prefersReducedMotion } from '@/lib/motionPrefs';

/*
 * When true (provided by GlobeCarousel) reveals render statically. Their
 * sections sit on non-scrolling 3D globe faces, so a scroll-scrubbed reveal
 * would otherwise never play and the content would stay invisible.
 */
export const RevealStaticContext = createContext(false);

/*
 * Scroll-scrubbed reveals.
 *
 * Unlike a one-shot whileInView trigger, these scrub their opacity + drift to
 * the element's own scroll-through progress — they reveal AS you scroll into
 * them and reverse when you scroll back, matching the reference's scrubbed
 * motion. Reduced motion renders everything static and visible.
 */

interface RevealProps {
  children: ReactNode;
  /** small 0-1 nudge to stagger sibling reveals (shifts the scrub window) */
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li';
}

/* Fade + rise, scrubbed to scroll. */
export function Reveal({ children, delay = 0, y = 30, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const M = motion[as];
  const forceStatic = useContext(RevealStaticContext);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.96', 'start 0.62'],
  });

  /* delay nudges the active window later so staggered siblings resolve in order */
  const shift = Math.min(delay * 0.18, 0.4);
  const opacity = useTransform(scrollYProgress, [shift, 0.6 + shift], [0, 1]);
  const ty = useTransform(scrollYProgress, [shift, 0.6 + shift], [y, 0]);

  /* motion[as] is polymorphic — its ref union can't be expressed precisely */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setRef = ref as any;
  if (prefersReducedMotion() || forceStatic) {
    return (
      <M ref={setRef} className={className}>
        {children}
      </M>
    );
  }
  return (
    <M ref={setRef} className={className} style={{ opacity, y: ty }}>
      {children}
    </M>
  );
}

interface LineRevealProps {
  /** each string becomes one masked line */
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}

/* Masked line-by-line reveal for display headings — scrubbed to scroll. */
export function LineReveal({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.09,
}: LineRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const forceStatic = useContext(RevealStaticContext);
  const reduced = prefersReducedMotion() || forceStatic;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.96', 'start 0.62'],
  });

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          {reduced ? (
            <span className={`block ${lineClassName}`}>{line}</span>
          ) : (
            <Line
              line={line}
              className={lineClassName}
              progress={scrollYProgress}
              start={Math.min(delay * 0.18 + i * stagger, 0.55)}
            />
          )}
        </span>
      ))}
    </span>
  );
}

function Line({
  line,
  className,
  progress,
  start,
}: {
  line: string;
  className: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
}) {
  const y = useTransform(progress, [start, start + 0.42], ['108%', '0%']);
  return (
    <motion.span className={`block ${className}`} style={{ y }}>
      {line}
    </motion.span>
  );
}
