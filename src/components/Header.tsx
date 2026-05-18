import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { NAV, BRAND } from '@/lib/site';
import { scrollToId } from './SmoothScroll';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  /* nav links may point to /#anchor — resolve to smooth-scroll on home */
  const go = (href: string) => {
    setOpen(false);
    const anchor = href.includes('#') ? href.split('#')[1] : '';
    if (anchor) {
      if (loc.pathname !== '/') {
        nav('/');
        setTimeout(() => scrollToId(anchor), 460);
      } else {
        scrollToId(anchor);
      }
    } else {
      nav(href);
    }
  };

  const dark = open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] transition-all duration-500 ease-lux ${
          scrolled && !open
            ? 'bg-bg/85 py-3 backdrop-blur-md'
            : 'bg-transparent py-5'
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-hairline transition-opacity duration-500 ${
            scrolled && !open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="shell flex items-center justify-between">
          {/* left — menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="group flex items-center gap-3"
            aria-label="Toggle menu"
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-all duration-400 ease-lux ${
                  dark ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px bg-current transition-all duration-300 ${
                  dark ? 'w-0 opacity-0' : 'w-6 opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-all duration-400 ease-lux ${
                  dark ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
            <span className="eyebrow hidden text-current sm:block">
              {open ? 'Close' : 'Menu'}
            </span>
          </button>

          {/* center — wordmark */}
          <button
            onClick={() => go('/#home')}
            className="display absolute left-1/2 -translate-x-1/2 text-[1.6rem] tracking-[0.2em] sm:text-[1.9rem]"
          >
            {BRAND.name}
          </button>

          {/* right — actions */}
          <div className="flex items-center gap-5">
            <Link
              to="/shop"
              className="eyebrow hidden border border-current/40 px-5 py-2.5 transition-colors duration-400 hover:bg-noir hover:text-bg sm:block"
            >
              Buy Now
            </Link>
            <Link to="/shop" aria-label="Cart" className="relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="stroke-current">
                <path d="M6 8h12l-1 12H7L6 8Z" strokeWidth="1.2" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeWidth="1.2" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* full-screen overlay nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 z-[110] bg-noir text-bg"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grain-layer absolute inset-0 opacity-[0.07]" />
            <div className="shell flex h-full flex-col justify-center pt-20">
              <span className="eyebrow mb-10 text-gold-light">Navigation</span>
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <li key={item.label} className="line-mask">
                    <motion.button
                      onClick={() => go(item.href)}
                      className="display block py-1 text-[clamp(2.6rem,9vw,6.2rem)] leading-[1.04] text-bg/90 transition-colors duration-300 hover:text-gold-light"
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%' }}
                      transition={{
                        duration: 0.7,
                        delay: 0.12 + i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <span className="text-gold-light/50 mr-5 align-super text-[0.9rem] font-label tracking-normal">
                        0{i + 1}
                      </span>
                      {item.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
              <motion.div
                className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-2 text-bg/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="eyebrow">{BRAND.email}</span>
                <span className="eyebrow">{BRAND.phone}</span>
                <span className="eyebrow text-gold-light">{BRAND.address}</span>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
