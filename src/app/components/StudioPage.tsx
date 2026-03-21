import { Building2 } from 'lucide-react';
import { ComingSoonPage } from './ComingSoonPage';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1739276649360-db75d484a502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGNhcnRvb24lMjBjaGFyYWN0ZXIlMjBjdXRlJTIwd2FpdGluZ3xlbnwxfHx8fDE3NzQwNzg2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080';

export function StudioPage() {
  return (
    <ComingSoonPage
      title="The Studio"
      description="Step inside our creative sanctuary. We're preparing an immersive journey through our studio's culture, process, and the passionate team behind the craft."
      Icon={Building2}
      image={IMAGE_URL}
      orbSide="left"
    />
  );
}
