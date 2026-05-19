import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { products } from '@/lib/products';
import { BRAND } from '@/lib/site';
import Img from './Img';

/*
 * Full-screen product search. Opens from the header search icon, live-filters
 * the catalogue by name, and links each result to its product page.
 */
export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* reset + focus on open */
  useEffect(() => {
    if (!open) return;
    setQ('');
    const t = setTimeout(() => inputRef.current?.focus(), 380);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const term = q.trim().toLowerCase();
  const results = useMemo(
    () =>
      term
        ? products.filter((p) => p.name.toLowerCase().includes(term))
        : products,
    [term],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[145] flex flex-col bg-bg"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Search products"
        >
          {/* top bar — logo + close */}
          <div className="shell flex items-center justify-between py-6">
            <span className="display text-[1.4rem] tracking-[0.2em]">
              {BRAND.name}
            </span>
            <button
              onClick={onClose}
              aria-label="Close search"
              className="eyebrow flex items-center gap-2 text-ink transition-colors duration-300 hover:text-gold"
            >
              Close
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          {/* search input */}
          <div className="shell mt-6">
            <label className="eyebrow text-muted">Search Formulations</label>
            <div className="mt-3 flex items-center gap-4 border-b border-ink/25 pb-4">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 stroke-muted"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="1.2" />
                <path d="m20 20-3.8-3.8" strokeWidth="1.2" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by product name…"
                className="display w-full bg-transparent text-[clamp(1.6rem,4vw,2.6rem)] leading-tight text-ink outline-none placeholder:text-hairline"
              />
            </div>
          </div>

          {/* results */}
          <div className="shell mt-8 flex-1 overflow-y-auto pb-16">
            <p className="eyebrow text-muted">
              {term
                ? `${results.length} result${results.length === 1 ? '' : 's'}`
                : 'All Formulations'}
            </p>

            {results.length === 0 ? (
              <p className="display mt-10 text-2xl text-ink">
                No formulations match “{q.trim()}”.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {results.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/product/${p.slug}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="aspect-[3/2] overflow-hidden bg-surface">
                      <Img
                        name={`products/${p.slug}`}
                        alt={p.name}
                        fit="contain"
                        tint={p.tint}
                        className="transition-transform duration-700 ease-lux group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <h3 className="display text-base leading-tight">
                        {p.name}
                      </h3>
                      <span className="eyebrow shrink-0 text-muted">
                        {p.price ?? 'On enquiry'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
