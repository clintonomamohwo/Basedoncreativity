import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Sun, Moon, Star } from 'lucide-react';
import { useNavigate } from 'react-router';

export function HeroSection() {
  const navigate = useNavigate();
  return (
    <section
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 md:px-6 py-24 md:py-32"
      style={{
        background: 'linear-gradient(135deg, #1A1F4B 0%, #2A2F5B 50%, #FFC857 100%)',
      }}
    >
      {/* Grain Texture Overlay */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Floating ambient orbs */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: '#FFC857' }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: '#FFC857' }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text content ── */}
          <div>

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
              style={{
                background: 'rgba(255, 200, 87, 0.15)',
                border: '1px solid rgba(255, 200, 87, 0.3)',
              }}
            >
              <Sparkles size={14} style={{ color: '#FFC857', flexShrink: 0 }} />
              <span
                style={{
                  color: '#FFC857',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                }}
              >
                Based on Creativity
              </span>
            </motion.div>

            {/* Main headline — responsive Space Mono bold */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 leading-[1.15]"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(1.875rem, 8vw, 3rem)',
                fontWeight: 700,
              }}
            >
              <span style={{ color: '#ffffff' }}>Built in the quiet.</span>
              <br />
              <span style={{ color: '#FFC857' }}>Born in the light.</span>
            </motion.h1>

            {/* Subtitle — Cormorant Garamond italic, responsive */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 max-w-xl"
              style={{
                color: '#D1D5DB',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                fontStyle: 'italic',
                lineHeight: 1.65,
              }}
            >
              A digital media company where imagination and intention belong together.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Primary — Gold background, Indigo Blue text, Space Mono bold */}
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group px-10 py-5 rounded-full flex items-center justify-center gap-3 w-full sm:w-auto"
                onClick={() => navigate('/about')}
                style={{
                  background: '#FFC857',
                  color: '#1A1F4B',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                  letterSpacing: '0.04em',
                  boxShadow: '0 8px 32px rgba(255, 200, 87, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Discover Our World
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </motion.button>

              {/* Secondary — transparent, 2px solid Gold border, Gold text, Space Mono bold */}
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="px-10 py-5 rounded-full backdrop-blur-sm w-full sm:w-auto"
                onClick={() => navigate('/contact')}
                style={{
                  background: 'transparent',
                  border: '2px solid #FFC857',
                  color: '#FFC857',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                }}
              >
                Get in Touch
              </motion.button>
            </motion.div>

            {/* Brand Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8"
            >
              {[
                { Icon: Sun,  label: 'Expression', description: 'Stories brought to life' },
                { Icon: Moon, label: 'Reflection',  description: 'Where ideas take shape' },
                { Icon: Star, label: 'Connection',  description: 'Bridging cultures through creativity' },
              ].map(({ Icon, label, description }) => (
                <div key={label} className="flex flex-col gap-2">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: '#FFC857', marginBottom: '4px' }}
                  />
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                      color: '#FFC857',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontWeight: 400,
                      fontSize: 'clamp(0.8rem, 2.5vw, 14px)',
                      color: '#FFFFFF',
                      lineHeight: 1.5,
                    }}
                  >
                    {description}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: abstract decorative visual (desktop only) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square">
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 200, 87, 0.2) 0%, transparent 100%)',
                  border: '2px solid rgba(255, 200, 87, 0.3)',
                }}
              />
              <motion.div
                aria-hidden="true"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-10 rounded-full"
                style={{
                  background: 'linear-gradient(225deg, rgba(255, 200, 87, 0.15) 0%, transparent 100%)',
                  border: '1px solid rgba(255, 200, 87, 0.2)',
                }}
              />
              <div
                className="absolute inset-20 rounded-full flex items-center justify-center backdrop-blur-md"
                style={{
                  background: 'rgba(255, 200, 87, 0.1)',
                  border: '1px solid rgba(255, 200, 87, 0.3)',
                }}
              >
                <Sparkles size={80} style={{ color: '#FFC857', opacity: 0.6 }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#FFC857' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}