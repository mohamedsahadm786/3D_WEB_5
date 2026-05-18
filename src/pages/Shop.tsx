import { Link } from 'react-router-dom';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Reveal, LineReveal } from '@/components/Reveal';

export default function Shop() {
  return (
    <div className="min-h-screen bg-bg pb-28 pt-36 sm:pt-44">
      <div className="shell">
        {/* breadcrumb */}
        <Reveal>
          <nav className="eyebrow flex items-center gap-2 text-muted">
            <Link to="/" className="ln">Home</Link>
            <span>/</span>
            <span className="text-ink">Shop</span>
          </nav>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-10">
          <h1 className="display text-[clamp(2.8rem,7vw,5.8rem)]">
            <LineReveal lines={['All Products']} />
          </h1>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm text-ink-soft">
              {products.length} research formulations — sourced from verified
              suppliers and packed with precision.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
