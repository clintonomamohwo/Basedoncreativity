import { Handshake } from 'lucide-react';
import { ComingSoonPage } from './ComingSoonPage';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1686741762594-a6a3a8b77341?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGNhcnRvb24lMjBoYW5kc2hha2UlMjBwYXJ0bmVyc2hpcHxlbnwxfHx8fDE3NzQwODAwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080';

export function PartnersPage() {
  return (
    <ComingSoonPage
      title="Partners"
      description="Excellence is built on collaboration. We're honored to work alongside remarkable brands and visionaries. Discover the partnerships that fuel our creative journey."
      Icon={Handshake}
      image={IMAGE_URL}
      orbSide="right"
    />
  );
}
