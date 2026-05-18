import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { getProduct, relatedProducts } from '@/lib/products';
import Img from '@/components/Img';
import ProductCard from '@/components/ProductCard';
import { Reveal, LineReveal } from '@/components/Reveal';
import { BRAND } from '@/lib/site';

const DETAILS = [
  { row: 'Form', value: 'Lyophilised powder' },
  { row: 'Purity', value: 'Verified — third-party tested' },
  { row: 'Storage', value: 'Cool, dry, away from light' },
  { row: 'Handling', value: 'Sealed & protected packaging' },
];

export default function Product() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);

  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(1);
  const [openRow, setOpenRow] = useState<number | null>(0);

  if (!product) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-center">
        <div>
          <h1 className="display text-4xl">Product not found</h1>
          <Link
            to="/shop"
            className="eyebrow mt-8 inline-block border border-ink/30 px-8 py-3.5 transition-colors hover:bg-noir hover:text-bg"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const related = relatedProducts(product.slug, 4);

  return (
    <div className="min-h-screen bg-bg pb-28 pt-36 sm:pt-44">
      <div className="shell">
        {/* breadcrumb */}
        <nav className="eyebrow flex flex-wrap items-center gap-2 text-muted">
          <Link to="/" className="ln">Home</Link>
          <span>/</span>
          <Link to="/shop" className="ln">Shop</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* gallery */}
          <div>
            <div className="relative aspect-[3/2] overflow-hidden bg-surface">
              <AnimatePresence mode="wait">
                <motion.div
                  key={shot}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Img
                    name={`product-gallery/${product.slug}_${shot}`}
                    alt={product.name}
                    fit="contain"
                    tint={product.tint}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setShot(n)}
                  className={`aspect-[3/2] overflow-hidden bg-surface ring-1 transition-all duration-300 ${
                    shot === n ? 'ring-gold' : 'ring-hairline hover:ring-ink/40'
                  }`}
                  aria-label={`View image ${n}`}
                >
                  <Img
                    name={`product-gallery/${product.slug}_${n}`}
                    alt=""
                    fit="contain"
                    tint={product.tint}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div className="flex flex-col">
            <span className="eyebrow text-gold">Research Formulation</span>
            <h1 className="display mt-4 text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.08]">
              <LineReveal lines={[product.name]} />
            </h1>

            <div className="mt-5 flex items-center gap-4">
              <span className="display text-2xl text-gold">
                {product.price ?? 'Price on enquiry'}
              </span>
              <span className="flex gap-0.5 text-sm text-gold" aria-hidden>
                {'★★★★★'}
              </span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ink-soft">{product.blurb}</p>

            {/* quantity + action */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-ink/25">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-12 w-12 place-items-center text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="display w-10 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-12 w-12 place-items-center text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {product.price ? (
                <button className="eyebrow flex-1 bg-noir px-9 py-4 text-bg transition-transform duration-400 ease-lux hover:-translate-y-0.5">
                  Add to Cart
                </button>
              ) : (
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="eyebrow flex-1 bg-gold px-9 py-4 text-center text-noir transition-transform duration-400 ease-lux hover:-translate-y-0.5"
                >
                  Enquire on WhatsApp
                </a>
              )}
            </div>

            {/* details accordion */}
            <div className="mt-10 border-t border-hairline">
              {DETAILS.map((d, i) => (
                <div key={d.row} className="border-b border-hairline">
                  <button
                    onClick={() => setOpenRow(openRow === i ? null : i)}
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="eyebrow text-ink">{d.row}</span>
                    <span
                      className={`text-lg text-gold transition-transform duration-400 ${
                        openRow === i ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openRow === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-sm text-ink-soft">{d.value}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* related */}
        <div className="mt-28">
          <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)]">
            <LineReveal lines={['You May Also Like']} />
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
