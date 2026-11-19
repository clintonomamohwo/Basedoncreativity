import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Moon, Sparkles, Star, Sun } from 'lucide-react';
import { Link } from 'react-router';
import './CreativeHero.css';

const easeOut = [0.22, 1, 0.36, 1] as const;

const pillars = [
  { Icon: Sun, label: 'Expression', description: 'Stories brought to life' },
  { Icon: Moon, label: 'Reflection', description: 'Where ideas take shape' },
  { Icon: Star, label: 'Connection', description: 'Bridging cultures through creativity' },
];

const ambientStars = [
  { className: 'boc-creative-hero__star--one', duration: 9, delay: 0 },
  { className: 'boc-creative-hero__star--two', duration: 12, delay: 1.4 },
  { className: 'boc-creative-hero__star--three', duration: 10, delay: 2.3 },
  { className: 'boc-creative-hero__star--four', duration: 14, delay: 0.8 },
];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  const titleLineMotion = (delay: number, glow = false) => ({
    initial: reduceMotion ? false : {
      opacity: 0,
      y: 16,
      ...(glow ? { filter: 'drop-shadow(0 0 0 rgba(255, 200, 87, 0))' } : {}),
    },
    animate: {
      opacity: 1,
      y: 0,
      ...(glow ? { filter: 'drop-shadow(0 0 15px rgba(255, 200, 87, 0.34))' } : {}),
    },
    transition: {
      duration: reduceMotion ? 0 : 0.88,
      delay: reduceMotion ? 0 : delay,
      ease: easeOut,
    },
  });

  const orbitTransition = (duration: number) =>
    reduceMotion
      ? { duration: 0 }
      : { duration, repeat: Infinity, ease: 'linear' as const };

  return (
    <section className="boc-creative-hero" aria-labelledby="home-hero-title">
      <div className="boc-creative-hero__texture" aria-hidden="true" />

      {ambientStars.map(({ className, duration, delay }) => (
        <motion.i
          className={`boc-creative-hero__star ${className}`}
          key={className}
          aria-hidden="true"
          animate={
            reduceMotion
              ? { opacity: 0.3, y: 0 }
              : { opacity: [0.18, 0.58, 0.18], y: [0, -5, 0], x: [0, 3, 0] }
          }
          transition={{ duration, repeat: reduceMotion ? 0 : Infinity, delay, ease: 'easeInOut' }}
        />
      ))}

      <div className="boc-creative-hero__inner">
        <div className="boc-creative-hero__copy">
          <div className="boc-creative-hero__badge">
            <Sparkles size={15} aria-hidden="true" />
            <span>Based on Creativity</span>
          </div>

          <h1 id="home-hero-title" className="boc-creative-hero__title">
            <motion.span {...titleLineMotion(0.18)}>Built in the quiet.</motion.span>
            <motion.span className="boc-creative-hero__title-accent" {...titleLineMotion(1.12, true)}>
              Born in the light.
            </motion.span>
          </h1>

          <p className="boc-creative-hero__subtitle">
            A digital media company where imagination and intention belong together.
          </p>

          <div className="boc-creative-hero__actions">
            <Link to="/about" className="boc-creative-hero__button boc-creative-hero__button--primary">
              <span>Discover Our World</span>
              <span className="boc-creative-hero__button-arrow" aria-hidden="true">
                <ArrowRight size={18} />
              </span>
            </Link>
            <Link to="/contact" className="boc-creative-hero__button boc-creative-hero__button--secondary">
              Get in Touch
            </Link>
          </div>

          <div
            className="boc-creative-hero__pillars"
            role="group"
            aria-label="Expression, reflection, and connection"
          >
            {pillars.map(({ Icon, label, description }) => (
              <div className="boc-creative-hero__pillar" key={label}>
                <Icon className="boc-creative-hero__pillar-icon" size={23} strokeWidth={1.5} aria-hidden="true" />
                <span className="boc-creative-hero__pillar-label">{label}</span>
                <span className="boc-creative-hero__pillar-description">{description}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="boc-creative-hero__orbit"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : 0.4, ease: easeOut }}
        >
          <div className="boc-creative-hero__orbit-square">
            <motion.div
              className="boc-creative-hero__orbit-ring boc-creative-hero__orbit-ring--outer"
              animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
              transition={orbitTransition(62)}
            />
            <motion.div
              className="boc-creative-hero__orbit-ring boc-creative-hero__orbit-ring--middle"
              animate={reduceMotion ? { rotate: 0 } : { rotate: -360 }}
              transition={orbitTransition(76)}
            />
            <div className="boc-creative-hero__orbit-core">
              <Sparkles size={78} strokeWidth={1.65} />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#selected-work"
        className="boc-creative-hero__scroll"
        aria-label="Scroll to Selected Work"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 1 }}
      >
        <span className="boc-creative-hero__scroll-track">
          <motion.i
            animate={reduceMotion ? { y: 0 } : { y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  );
}
