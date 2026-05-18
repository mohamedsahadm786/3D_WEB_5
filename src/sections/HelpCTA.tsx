import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Img from '@/components/Img';
import { Reveal, LineReveal } from '@/components/Reveal';
import { BRAND } from '@/lib/site';

export default function HelpCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <section ref={ref} className="relative flex min-h-[70vh] items-center overflow-hidden">
      {/* full-bleed parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        <Img name="extra/E_2" alt="" />
      </motion.div>
      <div className="absolute inset-0 bg-noir/65" />
      <div className="grain-layer absolute inset-0 opacity-[0.07]" />

      <div className="shell relative z-10 text-bg">
        <Reveal>
          <span className="eyebrow text-gold-light">Here to Guide You</span>
        </Reveal>
        <h2 className="display mt-6 text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.04]">
          <LineReveal lines={["Let's Talk To"]} />
          <LineReveal lines={['Get Instant Help']} lineClassName="text-bg/35" delay={0.12} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-7 max-w-md text-bg/65">
            Transparent communication, every step of the way.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="eyebrow mt-9 inline-flex items-center gap-3 bg-gold px-9 py-4 text-noir transition-transform duration-400 ease-lux hover:-translate-y-0.5"
          >
            Chat on WhatsApp
            <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
