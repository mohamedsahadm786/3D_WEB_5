import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

/* route-split the secondary pages — keeps the landing bundle lean */
const Shop = lazy(() => import('./pages/Shop'));
const Product = lazy(() => import('./pages/Product'));

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const loc = useLocation();

  /* reset scroll on route change (ignore in-page hash nav) */
  useEffect(() => {
    if (!loc.hash) window.scrollTo(0, 0);
  }, [loc.pathname, loc.hash]);

  return (
    <SmoothScroll>
      <Cursor />
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-bg" />}>
        <AnimatePresence mode="wait">
          <Routes location={loc} key={loc.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/shop" element={<Page><Shop /></Page>} />
            <Route path="/product/:slug" element={<Page><Product /></Page>} />
            <Route path="*" element={<Page><Home /></Page>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </SmoothScroll>
  );
}
