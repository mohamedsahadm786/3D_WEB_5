import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'motion/react';
import Img from '@/components/Img';
import Chapter, { useChapterProgress } from '@/components/Chapter';
import { useTypewriter } from '@/hooks/useTypewriter';
import { scrollToId } from '@/components/SmoothScroll';

const PHRASES = [
  'Your Weight-Loss Journey Reinvented by Science',
  'Lab-Engineered Formulations for Your Biology',
];
const EASE = [0.22, 1, 0.36, 1] as const;

/* Three.js scene is split into its own chunk — loads after first paint */
const HeroCanvas = lazy(() => import('@/components/HeroCanvas'));

/* The hero is a pinned chapter: scroll scrubs the 3D camera dolly while the
 * content drifts up and dissolves — the reader's first "room". */
export default function Hero() {
  return (
    <Chapter id="home" distance={1.3} scrub={1}>
      <HeroInner />
    </Chapter>
  );
}

function HeroInner() {
  const { text } = useTypewriter(PHRASES);

  /* scrubbed to the chapter's pinned scroll progress */
  const fallback = useMotionValue(0);
  const progress = useChapterProgress() ?? fallback;
  const bgY = useTransform(progress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(progress, [0, 0.6], [0, -96]);
  const contentFade = useTransform(progress, [0, 0.55], [1, 0]);
  const cueFade = useTransform(progress, [0, 0.18], [1, 0]);

  return (
    <div className="relative flex flex-1 items-center justify-center">
      {/* faint photographic base */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Img name="hero/home-hero-background-image" alt="" className="opacity-[0.2]" />
      </motion.div>
      {/* warm wash for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/30 to-bg" />

      {/* live WebGL motes + form — camera scrubs to chapter progress */}
      <Suspense fallback={null}>
        <HeroCanvas />
      </Suspense>

      {/* content */}
      <motion.div
        style={{ y: contentY, opacity: contentFade }}
        className="shell relative z-10 flex flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="eyebrow rounded-full border border-ink/25 bg-surface/40 px-5 py-2 backdrop-blur-sm"
        >
          High-Purity Research Peptides
        </motion.span>

        <h1 className="display mt-7 flex min-h-[2.9em] max-w-[16ch] items-center justify-center text-[clamp(2.6rem,7vw,6rem)] text-balance">
          <span aria-live="polite">{text}</span>
          <span className="ml-1 inline-block w-[3px] animate-blink bg-gold align-[-0.05em] text-transparent">
            |
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="mt-7 max-w-xl text-[0.97rem] leading-relaxed text-ink-soft"
        >
          Our products are sourced from verified suppliers and carefully packed to
          ensure consistency, purity, and reliability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/shop"
            className="eyebrow bg-noir px-9 py-4 text-bg transition-transform duration-400 ease-lux hover:-translate-y-0.5"
          >
            Shop Products
          </Link>
          <button
            onClick={() => scrollToId('about')}
            className="eyebrow border border-ink/30 px-9 py-4 transition-colors duration-400 hover:bg-noir hover:text-bg"
          >
            Discover ALLUVI
          </button>
        </motion.div>
      </motion.div>

      {/* scroll cue — fades out as the chapter scrubs */}
      <motion.button
        onClick={() => scrollToId('features')}
        style={{ opacity: cueFade }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-label="Scroll down"
      >
        <span className="eyebrow text-muted">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-ink/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[bob_2.4s_ease-in-out_infinite] bg-gold" />
        </span>
      </motion.button>
    </div>
  );
}
