import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BRAND, NAV } from '@/lib/site';
import { scrollToId } from './SmoothScroll';

export default function Footer() {
  const [sent, setSent] = useState(false);
  const year = new Date().getFullYear();

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <footer className="relative overflow-hidden bg-noir text-bg">
      <div className="grain-layer absolute inset-0 opacity-[0.06]" />

      {/* giant faint watermark */}
      <div
        className="display pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[26vw] leading-none text-bg/[0.04]"
        aria-hidden
      >
        {BRAND.name}
      </div>

      <div className="shell relative z-10 pb-16 pt-24">
        <span className="eyebrow text-gold-light">Here to Help You Anytime</span>

        <div className="mt-8 grid gap-14 border-b border-bg/12 pb-16 lg:grid-cols-[1.4fr_0.8fr_1.2fr]">
          {/* contact + CTA */}
          <div>
            <p className="display max-w-md text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.1]">
              Let's get your research order moving.
            </p>
            <ul className="mt-8 space-y-1.5 text-sm text-bg/65">
              <li>{BRAND.address}</li>
              <li>{BRAND.phone}</li>
              <li>{BRAND.email}</li>
            </ul>
            <Link
              to="/shop"
              className="eyebrow mt-9 inline-flex items-center gap-3 border border-bg/30 px-7 py-3.5 transition-colors duration-400 hover:bg-bg hover:text-noir"
            >
              Start Your Order
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* quick links */}
          <nav>
            <span className="eyebrow text-bg/40">Quick Links</span>
            <ul className="mt-6 space-y-3">
              {NAV.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      const a = item.href.split('#')[1];
                      if (a) scrollToId(a);
                    }}
                    className="ln text-bg/75 transition-colors hover:text-gold-light"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* newsletter */}
          <div>
            <span className="eyebrow text-bg/40">Get Latest Offers</span>
            <h3 className="display mt-5 text-2xl">Don't miss the latest offers</h3>
            <p className="mt-3 text-sm text-bg/55">
              Be the first to know about new products, promotions, and store updates
              from {BRAND.name}.
            </p>
            {sent ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="eyebrow mt-7 text-gold-light"
              >
                Subscribed — thank you
              </motion.p>
            ) : (
              <form onSubmit={subscribe} className="mt-7 flex border-b border-bg/30">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-3 text-sm text-bg placeholder:text-bg/35 focus:outline-none"
                />
                <button type="submit" className="eyebrow pl-4 text-gold-light">
                  Join
                </button>
              </form>
            )}
            <div className="mt-9 flex gap-6">
              {BRAND.social.map((s) => (
                <a key={s.label} href={s.href} className="ln text-sm text-bg/65">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs text-bg/40 sm:flex-row sm:justify-between">
          <span>© {year} {BRAND.name}. All Rights Reserved.</span>
          <span>Recreation build — placeholder assets.</span>
        </div>
      </div>
    </footer>
  );
}
