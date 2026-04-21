import { Users } from 'lucide-react';
import { ComingSoonPage } from './ComingSoonPage';
import { SEO } from './SEO';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1562123126-97d4be34679d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGNhcnRvb24lMjBjaGFyYWN0ZXJzJTIwY29tbXVuaXR5JTIwZ3JvdXB8ZW58MXx8fHwxNzc0MDgwMDI2fDA&ixlib=rb-4.1.0&q=80&w=1080';

export function CommunityPage() {
  return (
    <>
      <SEO title="Community | Based on Creativity" description="The Based on Creativity community page is in development and will introduce future opportunities to connect, collaborate, and learn together." path="/community" robots="noindex, follow" />
      <ComingSoonPage
      title="Community"
      description="Great creativity thrives in connection. We're building a vibrant community space where creators, visionaries, and innovators can collaborate, inspire, and grow together."
      Icon={Users}
      image={IMAGE_URL}
      orbSide="left"
      />
    </>
  );
}
