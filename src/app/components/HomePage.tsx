import { HeroSection } from './HeroSection';
import { PortfolioSection } from './PortfolioSection';
import { ServicesSection } from './ServicesSection';
import { PhilosophySection } from './PhilosophySection';
import { ContactSection } from './ContactSection';
import { SEO } from './SEO';

export function HomePage() {
  return (
    <>
      <SEO title="Based on Creativity | Creative Studio" description="Based on Creativity is a creative studio crafting distinctive brand worlds, digital experiences, visual storytelling, and strategic design." path="/" />
    <>
      <HeroSection />
      <PortfolioSection />
      <ServicesSection />
      <PhilosophySection />
      <ContactSection />
    </>
    </>
  );
}
