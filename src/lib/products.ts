/* ALLUVI product catalogue — source of truth for URLs and image file names. */

export interface Product {
  slug: string;
  name: string;
  /** AED price string, or null = "Price on enquiry". */
  price: string | null;
  /** placeholder gradient tint pair (warm). */
  tint: [string, string];
  blurb: string;
}

export const products: Product[] = [
  {
    slug: 'bpc-157-tb-500-40mg',
    name: 'BPC-157 & TB-500 40mg',
    price: 'د.إ 999.00',
    tint: ['#C6A36A', '#8B7B62'],
    blurb:
      'A dual research blend prepared under controlled conditions for consistent, reliable handling. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability.',
  },
  {
    slug: 'nad-1000mg',
    name: 'NAD+ 1,000mg',
    price: null,
    tint: ['#D4C7AC', '#A6824C'],
    blurb:
      'NAD+ (Nicotinamide Adenine Dinucleotide) research formulation for laboratory analysis and in vitro studies only. Provided exclusively for controlled laboratory R&D applications.',
  },
  {
    slug: 'glow-70mg',
    name: 'Glow 70mg',
    price: 'د.إ 1,199.00',
    tint: ['#E5DBC6', '#C6A36A'],
    blurb:
      'A higher-capacity formulation packed securely to preserve freshness and stability. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability.',
  },
  {
    slug: 'retatrutide-20mg',
    name: 'Retatrutide 20mg',
    price: null,
    tint: ['#A6824C', '#4A3D2C'],
    blurb:
      'Developed with a strong focus on purity, consistency, and safe handling practices. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability.',
  },
  {
    slug: 'retatrutide-40mg',
    name: 'Retatrutide 40mg',
    price: 'د.إ 1,990.00',
    tint: ['#C6A36A', '#241B10'],
    blurb:
      'A research formulation produced with uniform standards for a dependable experience. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability.',
  },
  {
    slug: 'tirzepatide-20mg',
    name: 'Tirzepatide 20mg',
    price: null,
    tint: ['#D4C7AC', '#8B7B62'],
    blurb:
      'Checked thoroughly to maintain clean, high-quality formulations you can rely on. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability.',
  },
  {
    slug: 'tirzepatide-40mg',
    name: 'Tirzepatide 40mg',
    price: null,
    tint: ['#8B7B62', '#241B10'],
    blurb:
      'Sealed and protected to preserve overall product integrity through delivery. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability.',
  },
  {
    slug: 'tirzepatide-5mg',
    name: 'Tirzepatide 5mg',
    price: null,
    tint: ['#E5DBC6', '#A6824C'],
    blurb:
      'A starter-scale formulation sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability.',
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const relatedProducts = (slug: string, n = 4) =>
  products.filter((p) => p.slug !== slug).slice(0, n);
