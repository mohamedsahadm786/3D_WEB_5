import { Link } from 'react-router-dom';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Reveal, LineReveal } from '@/components/Reveal';

export default function Products() {
  return (
    <section id="products" className="relative overflow-hidden bg-bg py-24 sm:py-32">
      <span
        className="display pointer-events-none absolute -top-2 right-0 select-none text-[16vw] leading-none text-ink/[0.04]"
        aria-hidden
      >
        Our Products
      </span>

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <span className="eyebrow text-gold">Our Products</span>
            </Reveal>
            <h2 className="display mt-5 max-w-[18ch] text-[clamp(2rem,3.8vw,3.4rem)]">
              <LineReveal lines={['Research formulations packed', 'with precision and care']} />
            </h2>
          </div>
          <Reveal>
            <Link to="/shop" className="ln eyebrow text-ink">
              View All Products →
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
