import Hero from '@/sections/Hero';
import Features from '@/sections/Features';
import About from '@/sections/About';
import Marquee from '@/sections/Marquee';
import Products from '@/sections/Products';
import WhyUs from '@/sections/WhyUs';
import HelpCTA from '@/sections/HelpCTA';
import Testimonials from '@/sections/Testimonials';
import Contact from '@/sections/Contact';
import ChapterNav from '@/components/ChapterNav';

export default function Home() {
  return (
    <>
      <ChapterNav />
      <Hero />
      <Features />
      <About />
      <Marquee />
      <Products />
      <WhyUs />
      <HelpCTA />
      <Testimonials />
      <Contact />
    </>
  );
}
