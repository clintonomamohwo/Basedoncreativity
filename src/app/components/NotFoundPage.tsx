import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { COLORS, FONTS, EASE_STANDARD } from '../../lib/constants';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.indigoBlue} 0%, #0d1235 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {/* Ambient orb */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${COLORS.gold} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_STANDARD }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '560px' }}
      >
        {/* 404 numeral */}
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_STANDARD }}
          style={{
            fontFamily: FONTS.accent,
            fontSize: 'clamp(6rem, 18vw, 10rem)',
            fontWeight: 300,
            color: COLORS.gold,
            lineHeight: 1,
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
            textShadow: `0 0 60px rgba(255,200,87,0.3)`,
          }}
        >
          404
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE_STANDARD }}
          style={{
            width: '60px',
            height: '1px',
            background: `rgba(255,200,87,0.4)`,
            margin: '0 auto 1.75rem',
          }}
        />

        <h1
          style={{
            fontFamily: FONTS.heading,
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '-0.01em',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: '1.0625rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.65,
            marginBottom: '2.5rem',
          }}
        >
          The page you're looking for doesn't exist, or may have moved.
          Let's get you back to familiar ground.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Primary: go home */}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '12px 28px',
              borderRadius: '8px',
              background: COLORS.gold,
              border: 'none',
              cursor: 'pointer',
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: '0.8125rem',
              letterSpacing: '0.1em',
              color: COLORS.indigoBlue,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = COLORS.goldDark)}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = COLORS.gold)}
          >
            GO HOME
          </motion.button>

          {/* Secondary: go back */}
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '12px 28px',
              borderRadius: '8px',
              background: 'transparent',
              border: `2px solid ${COLORS.gold}`,
              cursor: 'pointer',
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: '0.8125rem',
              letterSpacing: '0.1em',
              color: COLORS.gold,
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = COLORS.gold;
              (e.currentTarget as HTMLButtonElement).style.color = COLORS.indigoBlue;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = COLORS.gold;
            }}
          >
            GO BACK
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
