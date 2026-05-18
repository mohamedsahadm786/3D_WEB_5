import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Img from '@/components/Img';
import { Reveal } from '@/components/Reveal';

const REVIEWS = [
  {
    name: 'Michael Reed',
    role: 'Research Assistant',
    avatar: 'testimonials/home-testimonial-michael-reed',
    quote:
      'Consistent products, clear guidance, and quick replies made the whole process simple and genuinely reassuring from start to finish.',
  },
  {
    name: 'Emily Carter',
    role: 'Wellness Consultant',
    avatar: 'testimonials/home-testimonial-emily-carter',
    quote:
      'Fast support and reliable formulations every time — ordering with ALLUVI has been smooth, dependable, and refreshingly straightforward.',
  },
  {
    name: 'Sofia Bennett',
    role: 'Fitness Coordinator',
    avatar: 'testimonials/home-testimonial-sofia-bennett',
    quote:
      'Everything arrived securely sealed, communication was excellent, and the overall service felt exactly like a premium brand should.',
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  const move = (d: number) => {
    setDir(d);
    setI((v) => (v + d + REVIEWS.length) % REVIEWS.length);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      setDir(1);
      setI((v) => (v + 1) % REVIEWS.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  const r = REVIEWS[i];

  return (
    <section id="testimonials" className="relative overflow-hidden bg-bg-deep py-24 sm:py-32">
      <span
        className="display pointer-events-none absolute -top-2 left-0 select-none text-[17vw] leading-none text-ink/[0.04]"
        aria-hidden
      >
        Testimonials
      </span>

      <div className="shell relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow text-gold">Trusted by Thousands</span>
          </Reveal>
          <h2 className="display mt-5 text-[clamp(2rem,3.8vw,3.3rem)]">
            What Our Customers Say
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-4 text-sm text-ink-soft">
              Trusted feedback from people who choose ALLUVI for purity and precision
              every time.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.blockquote
                key={i}
                custom={dir}
                initial={{ opacity: 0, x: dir * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -50 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex gap-1 text-gold" aria-hidden>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s}>★</span>
                  ))}
                </div>
                <p className="display mt-6 max-w-2xl text-[clamp(1.4rem,2.6vw,2.3rem)] leading-[1.3]">
                  “{r.quote}”
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <span className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-hairline">
                    <Img name={r.avatar} alt={r.name} rounded />
                  </span>
                  <span>
                    <span className="display block text-lg">{r.name}</span>
                    <span className="eyebrow text-muted">{r.role}</span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="flex gap-3 lg:flex-col">
            <button
              onClick={() => move(-1)}
              aria-label="Previous"
              className="grid h-14 w-14 place-items-center border border-ink/25 transition-colors duration-400 hover:bg-noir hover:text-bg"
            >
              ←
            </button>
            <button
              onClick={() => move(1)}
              aria-label="Next"
              className="grid h-14 w-14 place-items-center border border-ink/25 transition-colors duration-400 hover:bg-noir hover:text-bg"
            >
              →
            </button>
          </div>
        </div>

        {/* progress dots */}
        <div className="mt-10 flex gap-2">
          {REVIEWS.map((_, d) => (
            <button
              key={d}
              onClick={() => {
                setDir(d > i ? 1 : -1);
                setI(d);
              }}
              aria-label={`Review ${d + 1}`}
              className={`h-1 transition-all duration-500 ${
                d === i ? 'w-10 bg-gold' : 'w-5 bg-ink/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
