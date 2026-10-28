import { HeroSection } from './HeroSection';
import { ExploreLinksSection } from './ExploreLinksSection';
import { PortfolioSection } from './PortfolioSection';
import { ServicesSection } from './ServicesSection';
import { PhilosophySection } from './PhilosophySection';
import { ContactSection } from './ContactSection';
import { SEO } from './SEO';
import { StructuredData, createOrganizationSchema, createWebsiteSchema } from './StructuredData';

export function HomePage() {
  return (
    <>
      <SEO title="Based on Creativity (BOC) | Creative Studio" description="Based on Creativity is a creative studio bringing brands and stories to life through graphic design, web development, animation, and publishing." path="/" />
      <StructuredData data={createOrganizationSchema()} />
      <StructuredData data={createWebsiteSchema()} />
      <HeroSection />
      <ExploreLinksSection />
      <PortfolioSection />
      <ServicesSection />
      <PhilosophySection />
      <ContactSection />
    </>
  );
}
