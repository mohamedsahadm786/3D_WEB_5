import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useCart, formatAED, priceValue } from '@/lib/cart';
import { products } from '@/lib/products';
import { BRAND } from '@/lib/site';
import Img from './Img';

/*
 * Slide-in cart panel. Open state lives in the cart context so both the
 * header icon and the product page can summon it. Checkout hands the order
 * to WhatsApp — the brand's stated ordering channel (no checkout backend).
 */
export default function CartDrawer() {
  const { items, subtotal, count, setQty, remove, clear, drawerOpen, closeDrawer } =
    useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
    if (drawerOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  const checkout = () => {
    const lines = items.map((l) => {
      const p = products.find((x) => x.slug === l.slug);
      return `• ${p?.name ?? l.slug} ×${l.qty}`;
    });
    const msg =
      `Hello ALLUVI, I'd like to order:\n${lines.join('\n')}\n\n` +
      `Subtotal: ${formatAED(subtotal)}`;
    window.open(`${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[130] bg-noir/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeDrawer}
            aria-hidden
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[140] flex w-[min(26rem,100vw)] flex-col bg-bg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <span className="eyebrow text-ink">
                Your Cart{count > 0 ? ` — ${count}` : ''}
              </span>
              <button
                onClick={closeDrawer}
                aria-label="Close cart"
                className="text-2xl leading-none text-ink transition-colors duration-300 hover:text-gold"
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              /* empty state */
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="display text-2xl text-ink">Your cart is empty</p>
                <p className="text-sm text-muted">
                  Browse our research formulations to get started.
                </p>
                <Link
                  to="/shop"
                  onClick={closeDrawer}
                  className="eyebrow border border-ink/30 px-8 py-3.5 transition-colors duration-400 hover:bg-noir hover:text-bg"
                >
                  Shop Products
                </Link>
              </div>
            ) : (
              <>
                {/* line items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((line) => {
                    const p = products.find((x) => x.slug === line.slug);
                    if (!p) return null;
                    const each = priceValue(p.price);
                    return (
                      <div
                        key={line.slug}
                        className="flex gap-4 border-b border-hairline py-5 last:border-b-0"
                      >
                        <Link
                          to={`/product/${p.slug}`}
                          onClick={closeDrawer}
                          className="block aspect-[3/2] w-24 shrink-0 overflow-hidden bg-surface"
                        >
                          <Img
                            name={`products/${p.slug}`}
                            alt={p.name}
                            fit="contain"
                            tint={p.tint}
                          />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <Link
                              to={`/product/${p.slug}`}
                              onClick={closeDrawer}
                              className="display text-base leading-tight"
                            >
                              {p.name}
                            </Link>
                            <button
                              onClick={() => remove(line.slug)}
                              aria-label={`Remove ${p.name}`}
                              className="text-lg leading-none text-muted transition-colors duration-300 hover:text-gold"
                            >
                              ×
                            </button>
                          </div>
                          <span className="mt-1 eyebrow text-muted">
                            {formatAED(each)}
                          </span>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center border border-ink/25">
                              <button
                                onClick={() => setQty(line.slug, line.qty - 1)}
                                className="grid h-8 w-8 place-items-center text-base"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="display w-8 text-center text-sm">
                                {line.qty}
                              </span>
                              <button
                                onClick={() => setQty(line.slug, line.qty + 1)}
                                className="grid h-8 w-8 place-items-center text-base"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <span className="display text-sm text-gold">
                              {formatAED(each * line.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* footer */}
                <div className="border-t border-hairline px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow text-ink">Subtotal</span>
                    <span className="display text-xl text-gold">
                      {formatAED(subtotal)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Taxes and delivery confirmed over WhatsApp.
                  </p>
                  <button
                    onClick={checkout}
                    className="eyebrow mt-5 w-full bg-noir px-9 py-4 text-bg transition-transform duration-400 ease-lux hover:-translate-y-0.5"
                  >
                    Checkout on WhatsApp
                  </button>
                  <button
                    onClick={clear}
                    className="ln eyebrow mt-4 text-muted"
                  >
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
