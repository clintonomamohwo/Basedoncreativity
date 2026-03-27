import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';

// Story data representing books in the library
const libraryBooks = [
  {
    id: 'the-moon-listener',
    title: 'The Moon Listener',
    subtitle: 'A tale of silence and connection',
    coverColor: '#1A1F4B',
    accentColor: '#FFC857',
  },
  {
    id: 'the-compass-dream',
    title: 'The Compass Dream',
    subtitle: 'Finding true north within',
    coverColor: '#14172e',
    accentColor: '#F6E6B4',
  },
  {
    id: 'a-quiet-spark',
    title: 'A Quiet Spark',
    subtitle: 'Small beginnings, infinite potential',
    coverColor: '#1A1F4B',
    accentColor: '#FFC857',
  },
  {
    id: 'fragments-of-light',
    title: 'Fragments of Light',
    subtitle: 'Stories from the in-between',
    coverColor: '#14172e',
    accentColor: '#F6E6B4',
  },
  {
    id: 'the-clockmakers-tale',
    title: "The Clockmaker's Tale",
    subtitle: 'Time, craft, and patience',
    coverColor: '#1A1F4B',
    accentColor: '#FFC857',
  },
  {
    id: 'the-last-voyage',
    title: 'The Last Voyage',
    subtitle: 'An ending is just a beginning',
    coverColor: '#14172e',
    accentColor: '#F6E6B4',
  },
];

// Grain overlay for texture
function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Star particles for atmosphere
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Book card component
interface BookCardProps {
  book: typeof libraryBooks[0];
  index: number;
}

function BookCard({ book, index }: BookCardProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(`/stories/${book.id}`)}
      className="cursor-pointer perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{
          y: hovered ? -12 : 0,
          rotateY: hovered ? 2 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Book container */}
        <div
          className="relative"
          style={{
            width: '100%',
            aspectRatio: '3 / 4',
            position: 'relative',
          }}
        >
          {/* Book spine (gold) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '16px',
              background: `linear-gradient(180deg, ${book.accentColor} 0%, ${book.accentColor}99 100%)`,
              borderRadius: '4px 0 0 4px',
              boxShadow: `
                inset -2px 0 4px rgba(0,0,0,0.3),
                2px 0 8px ${book.accentColor}40
              `,
              zIndex: 2,
            }}
          >
            {/* Spine detail lines */}
            <div
              style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '80%',
                background: 'rgba(0,0,0,0.15)',
              }}
            />
          </div>

          {/* Book cover */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: 0,
              right: 0,
              bottom: 0,
              background: book.coverColor,
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0 6px 6px 0',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              boxShadow: hovered
                ? `
                  0 20px 50px rgba(0,0,0,0.5),
                  0 0 0 1px rgba(255,255,255,0.1),
                  0 0 30px ${book.accentColor}25
                `
                : `
                  0 8px 24px rgba(0,0,0,0.3),
                  0 0 0 1px rgba(255,255,255,0.05)
                `,
              transition: 'box-shadow 0.4s ease',
            }}
          >
            {/* Soft glow on hover */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: `radial-gradient(ellipse at 50% 0%, ${book.accentColor}18 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Book title */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                animate={{ y: hovered ? -2 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    marginBottom: '12px',
                    textShadow: hovered ? `0 0 20px ${book.accentColor}50` : 'none',
                    transition: 'text-shadow 0.3s ease',
                  }}
                >
                  {book.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.45)',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                  }}
                >
                  {book.subtitle}
                </p>
              </motion.div>
            </div>

            {/* Book icon at bottom */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <motion.div
                animate={{
                  scale: hovered ? 1.1 : 1,
                  rotate: hovered ? 5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <BookOpen
                  size={20}
                  style={{
                    color: book.accentColor,
                    opacity: 0.6,
                  }}
                />
              </motion.div>
            </div>

            {/* Grain overlay on cover */}
            <GrainOverlay />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function StoriesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#1A1F4B] overflow-hidden">
      {/* Fixed background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F4B] via-[#0f1228] to-[#1A1F4B]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,200,87,0.08),transparent)]" />
        <StarField />
        <GrainOverlay />
      </div>

      {/* Floating ambient orbs */}
      <motion.div
        style={{
          y: orb1Y,
          position: 'fixed',
          top: '20%',
          right: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(255,200,87,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          y: orb2Y,
          position: 'fixed',
          bottom: '10%',
          left: '-120px',
          width: '450px',
          height: '450px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(246,230,180,0.1) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
        animate={{ opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* Main content */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-4 md:px-6 pt-24 pb-24 md:pt-40 md:pb-40">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-20"
        >
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '60px',
              height: '1px',
              background: 'rgba(255,200,87,0.4)',
              margin: '0 auto 24px',
            }}
          />

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 8vw, 5rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '20px',
              textShadow: '0 0 40px rgba(255,200,87,0.2)',
            }}
          >
            The Quiet Pages
          </h1>

          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 'clamp(0.9375rem, 3vw, 1.25rem)',
              color: 'rgba(255,200,87,0.7)',
              fontStyle: 'italic',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Stories, fragments, and reflections.
          </p>
        </motion.div>

        {/* Book grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {libraryBooks.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-28 text-center"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '40px',
              height: '1px',
              background: 'rgba(255,200,87,0.3)',
              margin: '0 auto 24px',
            }}
          />
          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              color: 'rgba(255,255,255,0.35)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            "Every story is a small light in the dark,<br />a moment of connection across time and space."
          </blockquote>
          <p
            className="mt-5"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: 'rgba(255,200,87,0.4)',
            }}
          >
            THE QUIET PAGES
          </p>
        </motion.div>
      </div>
    </div>
  );
}