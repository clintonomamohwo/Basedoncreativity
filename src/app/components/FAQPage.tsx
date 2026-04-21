import { HelpCircle } from 'lucide-react';
import { ComingSoonPage } from './ComingSoonPage';
import { SEO } from './SEO';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1722614171611-8b4bea5c7a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGNhcnRvb24lMjBjdXRlJTIwY2hhcmFjdGVyJTIwcXVlc3Rpb24lMjBtYXJrfGVufDF8fHx8MTc3NDA4MDAyNnww&ixlib=rb-4.1.0&q=80&w=1080';

export function FAQPage() {
  return (
    <>
      <SEO title="FAQ | Based on Creativity" description="The Based on Creativity FAQ page is currently in development and will soon share answers about the studio process and approach." path="/faq" robots="noindex, follow" />
      <ComingSoonPage
      title="FAQ"
      description="Your questions deserve thoughtful answers. We're compiling comprehensive responses to help you understand our process, philosophy, and approach to creative excellence."
      Icon={HelpCircle}
      image={IMAGE_URL}
      orbSide="right"
      />
    </>
  );
}
