import { HeroSection } from './HeroSection';
import { PortfolioSection } from './PortfolioSection';
import { ServicesSection } from './ServicesSection';
import { PhilosophySection } from './PhilosophySection';
import { ContactSection } from './ContactSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <PortfolioSection />
      <ServicesSection />
      <PhilosophySection />
      <ContactSection />
    </>
  );
}
