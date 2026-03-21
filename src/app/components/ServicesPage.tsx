import { Palette } from 'lucide-react';
import { ComingSoonPage } from './ComingSoonPage';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1739276649360-db75d484a502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGNhcnRvb24lMjBjaGFyYWN0ZXIlMjBjdXRlJTIwd2FpdGluZ3xlbnwxfHx8fDE3NzQwNzg2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080';

export function ServicesPage() {
  return (
    <ComingSoonPage
      title="Services"
      description="Our comprehensive service offerings are being refined to perfection. Discover how we transform creative vision into extraordinary results."
      Icon={Palette}
      image={IMAGE_URL}
      orbSide="right"
    />
  );
}
