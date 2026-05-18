import { Reveal, LineReveal } from '@/components/Reveal';
import Img from '@/components/Img';
import { BRAND } from '@/lib/site';

const DETAILS = [
  { label: 'Visit', value: BRAND.address },
  { label: 'Email', value: BRAND.email },
  { label: 'Call', value: BRAND.phone },
];

export default function Contact() {
  return (
    <section id="contact" className="relative bg-bg py-24 sm:py-32">
      <div className="shell">
        {/* full-width banner */}
        <Reveal>
          <div className="relative aspect-[21/9] overflow-hidden">
            <Img name="extra/E_3" alt="Get in touch with ALLUVI" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/55 to-transparent" />
            <span className="eyebrow absolute bottom-6 left-6 text-bg">
              We're here to support you
            </span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="eyebrow text-gold">Contact</span>
            </Reveal>
            <h2 className="display mt-5 text-[clamp(2.6rem,5.5vw,4.6rem)]">
              <LineReveal lines={['Get in Touch']} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
                Reach out anytime for product details, order help, or personalised
                assistance — we're here to support you smoothly.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="eyebrow mt-9 inline-flex items-center gap-3 bg-noir px-9 py-4 text-bg transition-transform duration-400 ease-lux hover:-translate-y-0.5"
              >
                Chat With Us
                <span aria-hidden>→</span>
              </a>
            </Reveal>
          </div>

          {/* detail rows */}
          <ul className="flex flex-col justify-center">
            {DETAILS.map((d, i) => (
              <Reveal as="li" key={d.label} delay={i * 0.08}>
                <div className="flex items-baseline justify-between gap-6 border-t border-hairline py-6 last:border-b">
                  <span className="eyebrow text-muted">{d.label}</span>
                  <span className="display text-right text-[clamp(1.1rem,2vw,1.6rem)]">
                    {d.value}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
