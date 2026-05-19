import Hero from '@/sections/Hero';
import Features from '@/sections/Features';
import About from '@/sections/About';
import Products from '@/sections/Products';
import WhyUs from '@/sections/WhyUs';
import HelpCTA from '@/sections/HelpCTA';
import Testimonials from '@/sections/Testimonials';
import Contact from '@/sections/Contact';
import ChapterNav from '@/components/ChapterNav';
import GlobeCarousel from '@/components/GlobeCarousel';

/*
 * Home journey. The Hero is a normal pinned chapter. Every page from the
 * second (Features) to the second-last (Testimonials) is a face on the
 * rotating globe carousel — scrolling turns the globe instead of moving the
 * page down. The final Contact section + footer scroll normally afterwards.
 */
export default function Home() {
  return (
    <>
      <ChapterNav />
      <Hero />
      <GlobeCarousel
        faces={[
          { bg: 'bg-bg', node: <Features /> },
          { bg: 'bg-bg-deep', node: <About /> },
          { bg: 'bg-bg', node: <Products /> },
          { bg: 'bg-noir', node: <WhyUs /> },
          { bg: 'bg-noir', node: <HelpCTA /> },
          { bg: 'bg-bg-deep', node: <Testimonials /> },
        ]}
      />
      <Contact />
    </>
  );
}
