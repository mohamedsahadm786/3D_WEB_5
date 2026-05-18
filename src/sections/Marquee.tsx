const PHRASES = [
  'Premium Research Formulations',
  'Fast WhatsApp Support',
  'Trusted by Thousands',
  'Customer-Focused Service',
  'Easy WhatsApp Ordering',
  'Precision in Every Product',
];

export default function Marquee() {
  /* doubled track → seamless -50% loop */
  const track = [...PHRASES, ...PHRASES];
  return (
    <section className="relative overflow-hidden border-y border-hairline-dark bg-noir py-7 text-bg">
      <div className="flex w-max animate-marquee will-change-transform">
        {track.map((phrase, i) => (
          <span key={i} className="flex items-center">
            <span className="display whitespace-nowrap px-8 text-[clamp(1.4rem,2.6vw,2.4rem)] text-bg/90">
              {phrase}
            </span>
            <span className="text-gold-light" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-noir to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-noir to-transparent" />
    </section>
  );
}
