import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { fetchStories, portableTextToParagraphs, type SanityStory } from '@/lib/sanityContent';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SEO } from './SEO';

// ─── Book data ────────────────────────────────────────────────────────────────

interface LibraryBook {
  id: string;
  title: string;
  subtitle: string;
  coverColor: string;
  accentColor: string;
}

const FALLBACK_LIBRARY_BOOKS: LibraryBook[] = [
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

const CMS_BOOK_PALETTES = [
  { coverColor: '#1A1F4B', accentColor: '#FFC857' },
  { coverColor: '#14172e', accentColor: '#F6E6B4' },
  { coverColor: '#24163f', accentColor: '#FFC857' },
  { coverColor: '#10253f', accentColor: '#F6E6B4' },
];

function truncateSubtitle(text: string, maxLength = 56) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function mapSanityStoryToBook(story: SanityStory, index: number): LibraryBook {
  const palette = CMS_BOOK_PALETTES[index % CMS_BOOK_PALETTES.length];
  const firstParagraph = portableTextToParagraphs(story.body).at(0) || '';
  const subtitle = truncateSubtitle(story.excerpt || firstParagraph || 'A new story from Based on Creativity.');

  return {
    id: story.slug || story._id,
    title: story.title,
    subtitle,
    coverColor: palette.coverColor,
    accentColor: palette.accentColor,
  };
}

// ─── Press pillars ────────────────────────────────────────────────────────────

const PRESS_PILLARS = [
  {
    label: 'Illustrated Novellas',
    description: 'Long-form stories that live between image and text — where illustration carries as much narrative weight as the writing.',
  },
  {
    label: 'Editorial Anthologies',
    description: 'Curated collections built around a theme, a mood, or a moment. Each anthology is a world unto itself.',
  },
  {
    label: 'Original Fiction',
    description: 'Short stories, novelettes, and narrative prose developed and published directly through the press.',
  },
  {
    label: 'Visual Essays',
    description: "Non-fiction told through image and type — ideas that need room to breathe on the page, not just on screen.",
  },
];

// ─── Ambient components ───────────────────────────────────────────────────────

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

function StarField({ count = 60 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17.3 + 5) % 100}%`,
    top: `${(i * 23.7 + 8) % 100}%`,
    size: (i % 3) + 1,
    delay: (i % 5) * 0.7,
    duration: 2 + (i % 3),
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
          animate={{ opacity: [0.06, 0.45, 0.06], scale: [1, 1.15, 1] }}
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

// ─── Book Card (preserved) ────────────────────────────────────────────────────

interface BookCardProps {
  book: LibraryBook;
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
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(`/stories/${book.id}`)}
      className="cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{ y: hovered ? -12 : 0, rotateY: hovered ? 2 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative" style={{ width: '100%', aspectRatio: '3 / 4', position: 'relative' }}>
          {/* Spine */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '16px',
              background: `linear-gradient(180deg, ${book.accentColor} 0%, ${book.accentColor}99 100%)`,
              borderRadius: '4px 0 0 4px',
              boxShadow: `inset -2px 0 4px rgba(0,0,0,0.3), 2px 0 8px ${book.accentColor}40`,
              zIndex: 2,
            }}
          >
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

          {/* Cover */}
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
                ? `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1), 0 0 30px ${book.accentColor}25`
                : `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)`,
              transition: 'box-shadow 0.4s ease',
            }}
          >
            {/* Hover glow */}
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

            {/* Title */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <motion.div animate={{ y: hovered ? -2 : 0 }} transition={{ duration: 0.3 }}>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    marginBottom: '10px',
                    textShadow: hovered ? `0 0 20px ${book.accentColor}50` : 'none',
                    transition: 'text-shadow 0.3s ease',
                  }}
                >
                  {book.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.8125rem',
                    color: 'rgba(255,255,255,0.42)',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                  }}
                >
                  {book.subtitle}
                </p>
              </motion.div>
            </div>

            {/* Book icon */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <motion.div
                animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <BookOpen size={20} style={{ color: book.accentColor, opacity: 0.6 }} />
              </motion.div>
            </div>

            <GrainOverlay />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Pillar card ──────────────────────────────────────────────────────────────

function PillarCard({ pillar, delay }: { pillar: typeof PRESS_PILLARS[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: 'clamp(20px, 3vw, 28px)',
        border: '1px solid rgba(255,200,87,0.1)',
        borderRadius: '12px',
        background: 'rgba(255,200,87,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backdropFilter: 'blur(6px)',
        transition: 'border-color 0.3s ease, background 0.3s ease',
      }}
      whileHover={{
        borderColor: 'rgba(255,200,87,0.22)',
        background: 'rgba(255,200,87,0.055)',
      }}
    >
      <div style={{ width: '18px', height: '1px', background: 'rgba(255,200,87,0.5)' }} />
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#FFC857',
          margin: 0,
        }}
      >
        {pillar.label}
      </p>
      <p
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: '0.9375rem',
          color: 'rgba(250,243,224,0.6)',
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {pillar.description}
      </p>
    </motion.div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function StoriesPage() {
  const [cmsBooks, setCmsBooks] = useState<LibraryBook[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    let cancelled = false;

    fetchStories()
      .then((stories) => {
        if (cancelled || !stories?.length) return;
        setCmsBooks(stories.map(mapSanityStoryToBook));
      })
      .catch(() => {
        if (!cancelled) {
          setCmsBooks([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayBooks = useMemo(
    () => (cmsBooks.length ? cmsBooks : FALLBACK_LIBRARY_BOOKS),
    [cmsBooks],
  );

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <>
      <SEO title="Stories | Based on Creativity" description="Browse the Based on Creativity stories collection, featuring original short fiction, poetic narratives, and immersive visual storytelling." path="/stories" />
    <div ref={containerRef} className="relative overflow-hidden" style={{ background: '#0F1228' }}>

      {/* ── Fixed background ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1A1F4B 0%, #0f1228 50%, #0A1020 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% -5%, rgba(255,200,87,0.09), transparent)' }}
        />
        <StarField count={80} />
        <GrainOverlay />
      </div>

      {/* Floating orbs */}
      <motion.div
        style={{
          y: orb1Y,
          position: 'absolute',
          top: '18%',
          right: '-160px',
          width: '520px',
          height: '520px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(255,200,87,0.11) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          y: orb2Y,
          position: 'absolute',
          bottom: '8%',
          left: '-130px',
          width: '460px',
          height: '460px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(246,230,180,0.09) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        animate={{ opacity: [0.07, 0.14, 0.07] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="relative" style={{ zIndex: 2 }}>

        {/* ── INTRO SECTION — Creativity Base Press ─────────────────────────── */}
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'clamp(104px, 13vw, 152px) clamp(20px, 5vw, 48px) clamp(56px, 7vw, 80px)',
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: '32px' }}
          >
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,200,87,0.55)',
                margin: '0 0 14px',
              }}
            >
              Based on Creativity
            </p>
            <div style={{ width: '28px', height: '1px', background: 'rgba(255,200,87,0.5)' }} />
          </motion.div>

          {/* Press name + headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '32px' }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.6875rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#FFC857',
                margin: '0 0 14px',
              }}
            >
              Creativity Base Press
            </p>
            <h1
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(2.75rem, 9vw, 6.5rem)',
                letterSpacing: '-0.03em',
                color: '#FAF3E0',
                margin: 0,
                lineHeight: 1.0,
              }}
            >
              Stories Built
              <br />
              <span style={{ color: '#FFC857' }}>to Last.</span>
            </h1>
          </motion.div>

          {/* Two-column intro body */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: 'clamp(32px, 5vw, 64px)',
              alignItems: 'start',
              marginBottom: 'clamp(56px, 8vw, 80px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  color: 'rgba(250,243,224,0.75)',
                  lineHeight: 1.75,
                  margin: '0 0 20px',
                }}
              >
                Creativity Base Press is the publishing house of Based on Creativity — a place for stories, voices, and ideas that deserve more than a social media post. We publish illustrated novellas, original fiction, editorial anthologies, and visual essays: work built to be held, read slowly, and remembered.
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)',
                  color: 'rgba(255,200,87,0.6)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                We are selective. We are slow on purpose. The work is better for it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.36 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                  color: 'rgba(250,243,224,0.6)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Every title published through Creativity Base Press is treated as a complete creative object — not just a document with a cover. Typography, binding philosophy, illustration direction, and editorial voice are all considered from the first page to the last.
              </p>

              {/* Format tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Print', 'Digital', 'Illustrated', 'Original Fiction', 'Anthology'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '0.575rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#FFC857',
                      border: '1px solid rgba(255,200,87,0.18)',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      background: 'rgba(255,200,87,0.05)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* What we publish — pillars grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{ marginBottom: '12px' }}
          >
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,200,87,0.45)',
                margin: '0 0 24px',
              }}
            >
              What We Publish
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '2px',
            }}
          >
            {PRESS_PILLARS.map((pillar, i) => (
              <PillarCard key={pillar.label} pillar={pillar} delay={0.5 + i * 0.07} />
            ))}
          </div>
        </section>

        {/* ── Press image band ──────────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(180px, 28vw, 320px)',
            overflow: 'hidden',
            margin: '0',
          }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1569784247384-4cc9803180cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBwdWJsaXNoaW5nJTIwYm9va3MlMjBkYXJrJTIwbW9vZHklMjBsaWJyYXJ5fGVufDF8fHx8MTc3NDYyNDcwN3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Editorial publishing books dark library"
            className="w-full h-full object-cover"
            style={{ opacity: 0.22 }}
          />
          {/* Gradient fade top and bottom */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, #0F1228 0%, transparent 30%, transparent 70%, #0F1228 100%)',
            }}
          />
          {/* Centred ornament */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '1px', background: 'rgba(255,200,87,0.3)' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,200,87,0.4)' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,200,87,0.2)' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,200,87,0.4)' }} />
              <div style={{ width: '40px', height: '1px', background: 'rgba(255,200,87,0.3)' }} />
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.125rem, 3vw, 1.75rem)',
                color: 'rgba(255,200,87,0.5)',
                margin: 0,
                textAlign: 'center',
                letterSpacing: '0.02em',
              }}
            >
              "Built in the quiet. Born in the light."
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.55rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(255,200,87,0.3)',
                margin: 0,
              }}
            >
              Creativity Base Press
            </p>
          </div>
        </div>

        {/* ── THE QUIET PAGES — book catalogue ─────────────────────────────── */}
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'clamp(72px, 10vw, 112px) clamp(20px, 5vw, 48px) clamp(80px, 11vw, 128px)',
          }}
        >
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 80px)' }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                width: '60px',
                height: '1px',
                background: 'rgba(255,200,87,0.35)',
                margin: '0 auto 24px',
              }}
            />

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 7vw, 4.5rem)',
                fontWeight: 600,
                color: '#FAF3E0',
                lineHeight: 1.1,
                marginBottom: '16px',
                textShadow: '0 0 40px rgba(255,200,87,0.18)',
              }}
            >
              The Quiet Pages
            </h2>

            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 'clamp(0.9375rem, 2.5vw, 1.125rem)',
                color: 'rgba(255,200,87,0.6)',
                fontStyle: 'italic',
                maxWidth: '520px',
                margin: '0 auto 10px',
                lineHeight: 1.65,
              }}
            >
              The growing catalogue of stories, fragments, and reflections from Creativity Base Press.
            </p>

            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.8125rem',
                color: 'rgba(250,243,224,0.28)',
                margin: '0 auto',
                letterSpacing: '0.03em',
              }}
            >
              Select a title to read more.
            </p>
          </motion.div>

          {/* Book grid — preserved exactly */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
            {displayBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>

          {/* Bottom quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: 'clamp(72px, 10vw, 112px)', textAlign: 'center' }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                width: '40px',
                height: '1px',
                background: 'rgba(255,200,87,0.28)',
                margin: '0 auto 24px',
              }}
            />
            <blockquote
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.125rem, 3vw, 1.625rem)',
                color: 'rgba(255,255,255,0.3)',
                fontStyle: 'italic',
                lineHeight: 1.65,
                maxWidth: '640px',
                margin: '0 auto 24px',
              }}
            >
              "Every story is a small light in the dark — a moment of connection across time and space."
            </blockquote>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,200,87,0.35)',
                margin: '0 0 40px',
              }}
            >
              Creativity Base Press
            </p>

            {/* Submission note + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '0.875rem',
                  color: 'rgba(250,243,224,0.35)',
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: '440px',
                  textAlign: 'center',
                }}
              >
                Creativity Base Press accepts a small number of submissions and publishing partnerships each year.
              </p>
              <button
                onClick={() => navigate('/contact')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: '1.5px solid rgba(255,200,87,0.28)',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: '#FFC857',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.borderColor = 'rgba(255,200,87,0.55)';
                  btn.style.background = 'rgba(255,200,87,0.06)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.borderColor = 'rgba(255,200,87,0.28)';
                  btn.style.background = 'transparent';
                }}
              >
                Reach Out to the Press
                <ArrowRight size={13} />
              </button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
    </>
  );
}
