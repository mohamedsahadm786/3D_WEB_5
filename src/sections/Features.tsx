import { Reveal, LineReveal } from '@/components/Reveal';
import Img from '@/components/Img';

const ICONS: Record<string, JSX.Element> = {
  purity: (
    <path d="M14 3s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z M10 16l3 3 5-6" />
  ),
  consistency: (
    <path d="M14 4a10 10 0 1 0 10 10 M14 9a5 5 0 1 0 5 5 M14 14h6" />
  ),
  packaging: (
    <path d="M5 9 14 4l9 5v10l-9 5-9-5V9Z M5 9l9 5 9-5 M14 14v10" />
  ),
};

const FEATURES = [
  {
    key: 'purity',
    title: 'Purity First',
    text: 'Each product is checked thoroughly to maintain clean, high-quality formulations you can rely on.',
  },
  {
    key: 'consistency',
    title: 'Reliable Consistency',
    text: 'Our controlled processes ensure every unit is produced with uniform standards for a dependable experience.',
  },
  {
    key: 'packaging',
    title: 'Secure Packaging',
    text: 'Every product is sealed and protected to preserve freshness, stability, and overall product integrity.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-bg py-24 sm:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        {/* image tile */}
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Img name="extra/E_1" alt="Inside the ALLUVI research process" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/35 to-transparent" />
            <span className="eyebrow absolute bottom-6 left-6 text-bg">
              The ALLUVI Standard
            </span>
          </div>
        </Reveal>

        {/* feature list */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <span className="eyebrow text-gold">What Sets Us Apart</span>
          </Reveal>
          <h2 className="display mt-5 text-[clamp(1.9rem,3.4vw,3rem)]">
            <LineReveal lines={['Precision built into', 'every formulation']} />
          </h2>

          <ul className="mt-10">
            {FEATURES.map((f, i) => (
              <Reveal as="li" key={f.key} delay={i * 0.08}>
                <div className="group flex gap-6 border-t border-hairline py-7 transition-colors duration-500 hover:border-gold">
                  <span className="display shrink-0 text-sm text-muted">
                    0{i + 1}
                    <span className="text-hairline"> / 03</span>
                  </span>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    className="shrink-0 stroke-gold transition-transform duration-500 ease-lux group-hover:-translate-y-1"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONS[f.key]}
                  </svg>
                  <div>
                    <h3 className="display text-xl">{f.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                      {f.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
