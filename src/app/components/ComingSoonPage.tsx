/**
 * ComingSoonPage
 *
 * Reusable placeholder page for routes that are not yet live.
 * Accepts a title, description, icon, and hero image via props so each
 * page retains its unique identity without duplicating layout code.
 *
 * Used by: WorkPage, ServicesPage, StudioPage, FAQPage, CommunityPage, PartnersPage
 */

import { motion } from 'motion/react';
import { ArrowLeft, type LucideProps } from 'lucide-react';
import { useNavigate } from 'react-router';
import { COLORS, FONTS, EASE_STANDARD, NOISE_SVG_BG } from '../../lib/constants';

// Number of background orbs to render.
const ORB_COUNT = 5;

interface ComingSoonPageProps {
  /** Page heading displayed below the hero image. */
  title: string;
  /** Short italic description rendered in Cormorant Garamond. */
  description: string;
  /** Lucide icon component shown between the image and the title. */
  Icon: React.ComponentType<LucideProps>;
  /** Hero image URL. */
  image: string;
  /**
   * Which horizontal side the background orbs drift toward.
   * Defaults to 'left'.
   */
  orbSide?: 'left' | 'right';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Grain noise overlay shared across dark page backgrounds. */
function GrainTexture() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: NOISE_SVG_BG,
        opacity: 0.03,
        pointerEvents: 'none',
      }}
    />
  );
}

/** Animated pulsing dot — used in the loading-style indicator strip. */
function PulsingDot({ delay }: { delay: number }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, delay }}
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: COLORS.gold,
        boxShadow: '0 0 10px rgba(255, 200, 87, 0.5)',
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ComingSoonPage({ title, description, Icon, image, orbSide = 'left' }: ComingSoonPageProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.indigoBlue} 0%, ${COLORS.charcoal} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grain texture */}
      <GrainTexture />

      {/* Floating gold orbs — decorative background depth effect */}
      {Array.from({ length: ORB_COUNT }, (_, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
          style={{
            position: 'absolute',
            top: `${20 + i * 15}%`,
            [orbSide]: `${10 + i * 18}%`,
            width: `${40 + i * 10}px`,
            height: `${40 + i * 10}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.gold} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Page content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          paddingTop: '6rem',
        }}
      >
        {/* Back to home button */}
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go back to home"
          style={{
            position: 'absolute',
            top: '6rem',
            left: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 200, 87, 0.1)',
            border: '1px solid rgba(255, 200, 87, 0.3)',
            borderRadius: '999px',
            padding: '0.75rem 1.5rem',
            fontFamily: FONTS.heading,
            fontSize: '0.875rem',
            fontWeight: 700,
            color: COLORS.gold,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            letterSpacing: '0.05em',
          }}
        >
          <ArrowLeft size={16} />
          HOME
        </motion.button>

        {/* Central content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ textAlign: 'center', maxWidth: '600px' }}
        >
          {/* Hero image with float animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_STANDARD }}
            style={{ marginBottom: '3rem', position: 'relative' }}
          >
            <motion.img
              src={image}
              alt={`${title}: Coming Soon illustration`}
              animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '100%',
                maxWidth: 'min(400px, 80vw)',
                height: 'auto',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(255, 200, 87, 0.2), 0 0 0 1px rgba(255, 200, 87, 0.1)',
                position: 'relative',
                zIndex: 0,
              }}
            />

            {/* Gold glow halo behind the image */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-20px',
                background: 'radial-gradient(circle, rgba(255, 200, 87, 0.15) 0%, transparent 70%)',
                filter: 'blur(30px)',
                zIndex: -1,
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          {/* Page icon — pulsing scale animation */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-block', marginBottom: '1.5rem' }}
          >
            <Icon size={48} color={COLORS.gold} strokeWidth={2} />
          </motion.div>

          {/* Page title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: COLORS.gold,
              marginBottom: '1rem',
              letterSpacing: '0.02em',
              textShadow: '0 0 30px rgba(255, 200, 87, 0.3)',
            }}
          >
            {title}
          </motion.h1>

          {/* "Coming Soon" badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(255, 200, 87, 0.15) 0%, rgba(246, 230, 180, 0.1) 100%)',
              border: `2px solid ${COLORS.gold}`,
              borderRadius: '999px',
              padding: '0.75rem 2rem',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                fontFamily: FONTS.body,
                fontSize: '1rem',
                fontWeight: 600,
                color: COLORS.creamAccent,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Coming Soon
            </span>
          </motion.div>

          {/* Page description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              fontFamily: FONTS.accent,
              fontSize: '1.25rem',
              lineHeight: 1.8,
              color: COLORS.textMuted,
              fontStyle: 'italic',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            {description}
          </motion.p>

          {/* Animated loading dots */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              marginTop: '2.5rem',
            }}
          >
            <PulsingDot delay={0} />
            <PulsingDot delay={0.2} />
            <PulsingDot delay={0.4} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}