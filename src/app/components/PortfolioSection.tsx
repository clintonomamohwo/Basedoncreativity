import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  size: 'large' | 'medium' | 'small';
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Creativity Base Studios',
    category: 'ANIMATION',
    image: 'https://images.unsplash.com/photo-1732353216401-fe1d1e6cb826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYXRpb24lMjBzdHVkaW8lMjBzdG9yeWJvYXJkJTIwd2FybSUyMGNpbmVtYXRpY3xlbnwxfHx8fDE3NzQwODQ2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    size: 'large',
  },
  {
    id: 2,
    title: 'Creativity Base Press',
    category: 'PUBLISHING',
    image: 'https://images.unsplash.com/photo-1630852722172-a1943ca8a55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwYm9va3MlMjBlZGl0b3JpYWwlMjBkZXNpZ24lMjBwdWJsaXNoaW5nfGVufDF8fHx8MTc3NDA4NDY0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    size: 'medium',
  },
  {
    id: 3,
    title: 'Creativity Base Network',
    category: 'WEB PLATFORM',
    image: 'https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGVlayUyMGRpZ2l0YWwlMjBpbnRlcmZhY2UlMjBkYXNoYm9hcmQlMjBVSSUyMGRlc2lnbnxlbnwxfHx8fDE3NzQwODQ2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    size: 'medium',
  },
  {
    id: 4,
    title: 'Brand & Identity Design',
    category: 'GRAPHIC DESIGN',
    image: 'https://images.unsplash.com/photo-1616205255812-c07c8102cc02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGlkZW50aXR5JTIwZ3JhcGhpYyUyMGRlc2lnbiUyMGxvZ28lMjBtb2NrdXB8ZW58MXx8fHwxNzc0MDg0NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    size: 'small',
  },
  {
    id: 5,
    title: 'Digital Experiences',
    category: 'WEB DEVELOPMENT',
    image: 'https://images.unsplash.com/photo-1759215524484-89c8d7ae28f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGRpZ2l0YWwlMjBleHBlcmllbmNlJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzc0MDg0NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    size: 'small',
  },
  {
    id: 6,
    title: 'Merchandise Collection',
    category: 'MERCHANDISE',
    image: 'https://images.unsplash.com/photo-1758706552384-500fb98ba029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjaGFuZGlzZSUyMGNvbGxlY3Rpb24lMjBhcHBhcmVsJTIwcHJvZHVjdCUyMGRpc3BsYXl8ZW58MXx8fHwxNzc0MDg0NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    size: 'large',
  },
];

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const isLarge = item.size === 'large';
  const isMedium = item.size === 'medium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden cursor-pointer ${
        isLarge
          ? 'col-span-1 md:col-span-2 row-span-1 md:row-span-2'
          : isMedium
          ? 'col-span-1 md:col-span-1 row-span-1 md:row-span-2'
          : 'col-span-1 md:col-span-1 row-span-1 md:row-span-2'
      }`}
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
        background: '#0F1115',
      }}
    >
      {/* Image with subtle zoom on hover */}
      <div className="relative h-full overflow-hidden" style={{ borderRadius: '12px' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
        >
          <ImageWithFallback
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{
              minHeight: isLarge
                ? 'clamp(280px, 40vw, 500px)'
                : isMedium
                ? 'clamp(220px, 30vw, 400px)'
                : 'clamp(280px, 40vw, 500px)',
            }}
          />
        </motion.div>

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.85) 100%)',
            borderRadius: '12px',
          }}
        />

        {/* Arrow — appears on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-6 right-6"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
            style={{
              background: 'rgba(255, 200, 87, 0.2)',
              border: '1.5px solid #FFC857',
            }}
          >
            <ArrowUpRight size={20} style={{ color: '#FFC857' }} />
          </div>
        </motion.div>

        {/* Text content pinned to bottom */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end gap-2">
          {/* Category label */}
          <div
            style={{
              color: '#FFC857',
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.14em',
              fontVariant: 'small-caps',
              textTransform: 'uppercase',
            }}
          >
            {item.category}
          </div>

          {/* Project title */}
          <h3
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: isLarge ? 'clamp(1.25rem, 4vw, 2rem)' : isMedium ? 'clamp(1.125rem, 3.5vw, 1.625rem)' : 'clamp(1rem, 3vw, 1.375rem)',
              color: '#FFFFFF',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

export function PortfolioSection() {
  const navigate = useNavigate();
  return (
    <section
      className="py-16 md:py-32 px-4 md:px-6"
      style={{ background: '#1A1F4B' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(1.75rem, 7vw, 4.5rem)',
              color: '#ffffff',
              fontWeight: 700,
            }}
          >
            Selected{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #FFC857 0%, #FFD88A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Works
            </span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            Explore our creative divisions and the work that defines us.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 md:gap-6">
          {portfolioItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="px-12 py-5 rounded-full"
            onClick={() => navigate('/work')}
            style={{
              background: '#FFC857',
              color: '#1A1F4B',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.04em',
              boxShadow: '0 8px 32px rgba(255, 200, 87, 0.3)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}