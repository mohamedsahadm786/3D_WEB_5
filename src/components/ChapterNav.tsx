import { useEffect, useState } from 'react';
import { scrollToId } from './SmoothScroll';

/*
 * Persistent side-nav — a column of dots on the right edge tracking the home
 * chapters, mirroring the reference's scene indicator. The active dot grows /
 * brightens; hovering reveals the label; clicking smooth-scrolls there.
 */

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'The Standard' },
  { id: 'about', label: 'About' },
  { id: 'products', label: 'Products' },
  { id: 'testimonials', label: 'Voices' },
  { id: 'contact', label: 'Contact' },
];

export default function ChapterNav() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollToId(s.id)}
            aria-label={s.label}
            aria-current={on ? 'true' : undefined}
            className="group relative flex h-3 items-center"
          >
            <span className="eyebrow pointer-events-none absolute right-6 whitespace-nowrap text-[0.58rem] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-500 ease-lux ${
                on
                  ? 'h-2 w-2 bg-gold'
                  : 'h-1.5 w-1.5 bg-ink/25 group-hover:bg-ink/55'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
