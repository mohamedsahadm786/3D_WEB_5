import { useState } from 'react';
import { Reveal, LineReveal } from '@/components/Reveal';

const CARDS = [
  {
    title: 'Consistent Results',
    text: 'Designed to keep your routine structured and support goal-focused progress.',
  },
  {
    title: 'Verified Purity',
    text: 'Sourced from manufacturers that follow strict testing, handling, and documentation standards.',
  },
  {
    title: 'Reliable Service',
    text: 'Every step is designed to provide a smooth, dependable customer experience.',
  },
  {
    title: 'Quick Support',
    text: 'Fast WhatsApp assistance for queries, updates, and product guidance.',
  },
];

function FlipCircle({ title, text, index }: { title: string; text: string; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <Reveal delay={index * 0.09} className="flex justify-center">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="group aspect-square w-full max-w-[260px] [perspective:1200px]"
        aria-label={title}
      >
        <div
          className="relative h-full w-full transition-transform duration-700 ease-lux [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
          style={flipped ? { transform: 'rotateY(180deg)' } : undefined}
        >
          {/* front */}
          <div className="absolute inset-0 grid place-items-center rounded-full border border-bg/20 bg-noir-soft p-8 text-center [backface-visibility:hidden]">
            <div>
              <span className="eyebrow text-gold-light">0{index + 1}</span>
              <h3 className="display mt-3 text-xl text-bg">{title}</h3>
            </div>
          </div>
          {/* back */}
          <div className="absolute inset-0 grid place-items-center rounded-full border border-gold/40 bg-gold p-9 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-sm leading-relaxed text-noir">{text}</p>
          </div>
        </div>
      </button>
    </Reveal>
  );
}

export default function WhyUs() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-noir py-24 text-bg sm:py-32">
      <div className="grain-layer absolute inset-0 opacity-[0.05]" />
      <div className="shell relative">
        <div className="max-w-4xl">
          <Reveal>
            <span className="eyebrow text-gold-light">Why Choose ALLUVI</span>
          </Reveal>
          <h2 className="display mt-6 text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[1.12]">
            <LineReveal
              lines={[
                'We deliver dependable, quality',
                'formulations with careful handling',
                'and supportive customer service.',
              ]}
            />
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <FlipCircle key={c.title} title={c.title} text={c.text} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
