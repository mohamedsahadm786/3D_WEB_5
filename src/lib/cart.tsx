/* ALLUVI cart — context, persistence, and the cart-drawer open state. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { products } from './products';

export interface CartLine {
  slug: string;
  qty: number;
}

interface CartCtx {
  items: CartLine[];
  /** total units across all lines */
  count: number;
  /** numeric AED subtotal */
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** cart-drawer visibility (shared so the product page can open it) */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = 'alluvi-cart';

/**
 * Pull the numeric value out of a price string like "د.إ 1,199.00".
 * Note: the "د.إ" currency mark itself contains a period, so we match the
 * digit-led number token rather than stripping non-digits.
 */
export const priceValue = (price: string | null) => {
  if (!price) return 0;
  const match = price.match(/[\d,]+(?:\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, '')) || 0 : 0;
};

/** Format a number back into the catalogue's AED style. */
export const formatAED = (n: number) =>
  `د.إ ${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
      /* drop any lines whose product no longer exists */
      return parsed.filter((l) => products.some((p) => p.slug === l.slug));
    } catch {
      return [];
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart simply won't persist */
    }
  }, [items]);

  const add = useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [...prev, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((n, l) => n + l.qty, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, l) => {
        const p = products.find((x) => x.slug === l.slug);
        return sum + priceValue(p?.price ?? null) * l.qty;
      }, 0),
    [items],
  );

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count,
      subtotal,
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [items, count, subtotal, add, setQty, remove, clear, drawerOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
