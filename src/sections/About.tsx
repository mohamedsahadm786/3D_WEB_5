import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Img from '@/components/Img';
import { Reveal, LineReveal } from '@/components/Reveal';
import { useCounter } from '@/hooks/useCounter';

const MEDIA = [
  'about/video',
  'about/home-about-stat-image',
  'about/home-about-small-image',
];

const CHECKS = ['Verified Suppliers', 'Sealed & Protected', 'Uniform Standards'];

/* one media tile that crossfades whenever its assigned media changes */
function Tile({ name, className }: { name: string; className: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={name}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Img name={name} alt="" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function About() {
  const [step, setStep] = useState(0);
  const { ref, value } = useCounter(25);

  /* media cycles clockwise through the three tiles */
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => s + 1), 3400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="about" className="relative overflow-hidden bg-bg-deep py-24 sm:py-32">
      {/* oversized section label */}
      <span
        className="display pointer-events-none absolute -top-2 left-0 select-none text-[19vw] leading-none text-ink/[0.04]"
        aria-hidden
      >
        About Us
      </span>

      <div className="shell relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* cycling media cluster */}
        <div className="relative h-[460px] sm:h-[560px]">
          <Tile
            name={MEDIA[step % 3]}
            className="absolute left-0 top-0 h-[78%] w-[66%]"
          />
          <Tile
            name={MEDIA[(step + 1) % 3]}
            className="absolute right-0 top-[14%] h-[42%] w-[40%] ring-8 ring-bg-deep"
          />
          <Tile
            name={MEDIA[(step + 2) % 3]}
            className="absolute bottom-0 right-[12%] h-[34%] w-[46%] ring-8 ring-bg-deep"
          />
        </div>

        {/* copy */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <span className="eyebrow text-gold">Who We Are</span>
          </Reveal>
          <h2 className="display mt-5 text-[clamp(2rem,3.6vw,3.3rem)]">
            <LineReveal
              lines={['Advancing Modern Research', 'with Smarter Formulations']}
            />
          </h2>

          {/* stat counter */}
          <Reveal delay={0.1}>
            <div
              ref={ref as React.RefObject<HTMLDivElement>}
              className="mt-9 flex items-center gap-5 border-y border-hairline py-6"
            >
              <span className="display text-[clamp(3rem,6vw,4.6rem)] leading-none text-gold">
                {value}+
              </span>
              <span className="eyebrow max-w-[14ch] text-ink-soft">
                High-Purity Research Peptides
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-7 text-sm leading-relaxed text-ink-soft">
              ALLUVI is committed to advancing high-quality peptide and supplement
              research through clean, reliable, and precisely developed formulations.
              Our goal is simple — to provide controlled, consistent, and easy-to-use
              products designed for structured research applications.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Every formulation is created with a strong focus on purity, consistency,
              and safe handling practices, giving you the confidence to work with
              products that meet strict quality standards.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {CHECKS.map((c) => (
                <li key={c} className="flex items-center gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" className="stroke-gold" fill="none">
                    <path d="M3 8.5 6.5 12 13 4" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="eyebrow text-ink">{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
