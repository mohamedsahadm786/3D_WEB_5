import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Product } from '@/lib/products';
import Img from './Img';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [wished, setWished] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden bg-surface">
          <div className="h-full w-full transition-transform duration-700 ease-lux group-hover:scale-[1.06]">
            <Img name={`products/${product.slug}`} alt={product.name} fit="contain" tint={product.tint} />
          </div>

          {/* hover actions */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center gap-2 p-3 transition-transform duration-500 ease-lux group-hover:translate-y-0">
            <span className="eyebrow flex-1 bg-noir py-3 text-center text-bg">Enquire</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setWished((w) => !w);
              }}
              aria-label="Add to wishlist"
              className="grid h-[42px] w-[42px] place-items-center bg-surface"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                className={wished ? 'fill-gold stroke-gold' : 'fill-none stroke-ink'}
                strokeWidth="1.4"
              >
                <path d="M10 17S3 12.5 3 7.5A3.5 3.5 0 0 1 10 6a3.5 3.5 0 0 1 7 1.5C17 12.5 10 17 10 17Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="display text-lg leading-tight">{product.name}</h3>
          <span className="eyebrow shrink-0 text-muted">
            {product.price ?? 'On enquiry'}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
