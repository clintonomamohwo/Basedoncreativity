/**
 * ServicesPage
 *
 * Full-page showcase of Based on Creativity's six service divisions.
 * Sections alternate between NAVY and NAVY_ALT backgrounds for visual rhythm.
 *
 * Structure:
 *   1. Hero        — parallax fade, headline, division chips
 *   2. Divisions   — one full-width section per division (DivisionSection)
 *   3. Process     — 4-step horizontal workflow bar
 *   4. CTA         — gold background call-to-action
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
// Kept local so this file is self-contained; mirrors Guidelines.md values.
const NAVY     = '#0A1628';
const NAVY_ALT = '#0F1D32';
const GOLD     = '#D4A853';
const CREAM    = '#FAF3E0';

// Opacity variants — avoids repeating rgba() strings throughout JSX
const CREAM_80 = 'rgba(250,243,224,0.80)';
const CREAM_40 = 'rgba(250,243,224,0.40)';
const GOLD_10  = 'rgba(212,168,83,0.10)';
const GOLD_20  = 'rgba(212,168,83,0.20)';
const GOLD_30  = 'rgba(212,168,83,0.30)';

// ─── Types ────────────────────────────────────────────────────────────────────

type Division = {
  number: string;
  label: string;
  name: string;
  description: string;
  services: string[];
  bg: string;
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

// ─── Static data ──────────────────────────────────────────────────────────────

const DIVISIONS: Division[] = [
  {
    number: '01',
    label: 'Animation & Storytelling',
    name: 'Creativity Base Studios',
    description:
      'Where narrative meets craft. Our animation studio brings characters, worlds, and ideas to life through traditional and digital animation, cinematic storytelling, and motion design. Every frame is intentional, every story deeply considered.',
    services: [
      '2D & 3D Character Animation',
      'Short Film & Series Production',
      'Motion Graphics & Visual Effects',
      'Storyboarding & Concept Development',
      'Brand Animation & Animated Logos',
    ],
    bg: NAVY,
  },
  {
    number: '02',
    label: 'Publishing & Editorial',
    name: 'Creativity Base Press',
    description:
      "A publishing house rooted in voices that deserve to be heard. From illustrated novellas to editorial magazines, we design and produce print and digital publications that command attention on any shelf.",
    services: [
      'Book & Novella Publishing',
      'Editorial Magazine Design',
      "Illustrated Children's Books",
      'Zine & Independent Press Production',
      'Copywriting & Editorial Direction',
    ],
    bg: NAVY_ALT,
  },
  {
    number: '03',
    label: 'Digital Platform & Community',
    name: 'Creativity Base Network',
    description:
      'A living digital ecosystem for creative minds to gather, grow, and collaborate. We build and curate platforms, newsletters, and community spaces where ideas flow freely and connections are meaningful.',
    services: [
      'Creative Community Platform Development',
      'Newsletter Strategy & Production',
      'Content Programming & Curation',
      'Digital Events & Live Programming',
      'Creator Ecosystem Architecture',
    ],
    bg: NAVY,
  },
  {
    number: '04',
    label: 'Visual Identity & Design',
    name: 'Graphic Design',
    description:
      'Identity is not decoration: it is declaration. Our graphic design practice crafts brand systems, visual identities, and print collateral that speak before a single word is read. Precise, purposeful, unmistakable.',
    services: [
      'Brand Identity & Logo Systems',
      'Print & Packaging Design',
      'Art Direction & Creative Strategy',
      'Illustration & Icon Systems',
      'Environmental & Exhibition Design',
    ],
    bg: NAVY_ALT,
  },
  {
    number: '05',
    label: 'Websites & Digital Experiences',
    name: 'Web Development',
    description:
      'Digital presence built to last. We design and develop bespoke websites and interactive experiences that are fast, accessible, and beautiful, engineered with the same care as the brands they represent.',
    services: [
      'Bespoke Website Design & Development',
      'Interactive & Immersive Web Experiences',
      'E-Commerce & Digital Storefronts',
      'UX Research & Interface Design',
      'Performance Optimisation & Accessibility',
    ],
    bg: NAVY,
  },
  {
    number: '06',
    label: 'Products & Apparel',
    name: 'Merchandise',
    description:
      'When creativity becomes something you can hold. We conceive, design, and produce limited-run merchandise and apparel collections that carry the weight of the brand they belong to — objects worth owning.',
    services: [
      'Apparel Design & Limited Runs',
      'Art Prints & Collectible Objects',
      'Branded Merchandise Strategy',
      'Packaging Design & Unboxing Experience',
      'Artist & Brand Collaborations',
    ],
    bg: NAVY_ALT,
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We listen before we speak. Deep research into your world, your audience, and the white space where your story belongs.',
  },
  {
    number: '02',
    title: 'Create',
    description:
      'Concepts are forged with care. We explore boldly, then distil, arriving at ideas that feel inevitable in hindsight.',
  },
  {
    number: '03',
    title: 'Refine',
    description:
      'Great work lives in the details. We iterate with discipline, sharpening until every element earns its place.',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'Delivery is not an ending — it is an opening. We ensure your work enters the world with the presence it deserves.',
  },
];

// ─── Shared media-query styles ────────────────────────────────────────────────
// Rendered once at the page root so they are not duplicated per division.

function ResponsiveStyles() {
  return (
    <style>{`
      /* Division two-column grid collapses to single column on tablet/mobile */
      @media (max-width: 768px) {
        .services-grid {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
          padding: 60px 20px !important;
        }
      }
      @media (max-width: 480px) {
        .services-grid {
          padding: 48px 16px !important;
        }
      }

      /* Process grid: 4-col → 2-col → 1-col */
      @media (max-width: 768px) {
        .process-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 40px !important;
        }
        /* Hide the absolute horizontal connector line on non-desktop viewports */
        .process-connector {
          display: none !important;
        }
      }
      @media (max-width: 480px) {
        .process-grid {
          grid-template-columns: 1fr !important;
          gap: 36px !important;
        }
      }

      /* Hero section: reduce padding on mobile */
      @media (max-width: 768px) {
        .hero-section {
          padding-top: 120px !important;
          padding-bottom: 60px !important;
        }
      }
      @media (max-width: 480px) {
        .hero-section {
          padding-top: 100px !important;
          padding-bottom: 48px !important;
        }
        /* Process & CTA section padding */
        .process-section {
          padding: 60px 16px !important;
        }
        .cta-section {
          padding: 60px 16px !important;
        }
        /* CTA button full-width on mobile */
        .cta-button {
          width: 100% !important;
        }
      }
    `}</style>
  );
}

// ─── GoldLine ─────────────────────────────────────────────────────────────────
// Decorative horizontal rule used in division headers and section titles.

function GoldLine({ width = '80px' }: { width?: string }) {
  return (
    <div
      style={{
        width,
        height: '1px',
        background: `linear-gradient(to right, ${GOLD}, transparent)`,
      }}
    />
  );
}

// ─── DivisionSection ──────────────────────────────────────────────────────────
// Renders one service division. Left/right slide direction alternates per row
// so adjacent sections feel balanced rather than all moving from the same side.

function DivisionSection({ division, index }: { division: Division; index: number }) {
  // Even-indexed rows: left column slides in from the left, right from the right.
  // Odd-indexed rows: directions invert.
  const isEven = index % 2 === 0;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      style={{ background: division.bg }}
    >
      <div
        className="services-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '96px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'start',
        }}
      >
        {/* Left column — identity (number, label, name, description) */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -32 : 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Faint step number — purely decorative */}
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              color: GOLD_30,
              letterSpacing: '4px',
              fontWeight: 700,
            }}
          >
            {division.number}
          </span>

          {/* Category label */}
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(0.6875rem, 1.5vw, 0.8125rem)',
              color: GOLD,
              letterSpacing: 'clamp(2px, 0.5vw, 3px)',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            {division.label}
          </span>

          {/* Division name — Cormorant Garamond per brand guidelines */}
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              fontStyle: 'italic',
              color: CREAM,
              lineHeight: 1.15,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {division.name}
          </h2>

          <GoldLine />

          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
              color: CREAM_80,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '520px',
            }}
          >
            {division.description}
          </p>
        </motion.div>

        {/* Right column — services list */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 32 : -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ paddingTop: '8px' }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(0.6875rem, 1.5vw, 0.75rem)',
              color: CREAM_40,
              letterSpacing: 'clamp(2px, 0.5vw, 3px)',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            Services Offered
          </p>

          {/* Each item staggers in with a small delay based on its index */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {division.services.map((service, i) => (
              <motion.li
                key={service}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.07, // stagger: 70ms per item
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 0',
                  borderBottom: `1px solid ${GOLD_10}`,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
                  color: CREAM_80,
                }}
              >
                {/* Gold dash bullet */}
                <span
                  style={{
                    display: 'block',
                    width: '20px',
                    height: '1px',
                    background: GOLD,
                    flexShrink: 0,
                    opacity: 0.7,
                  }}
                />
                {service}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─── ServicesPage ─────────────────────────────────────────────────────────────

export function ServicesPage() {
  const navigate = useNavigate();

  /**
   * Hero parallax effect using window scroll progress.
   * useScroll() without a target reads from the document root,
   * which avoids the "non-static container" warning that target-based
   * scroll tracking can produce.
   *
   * scrollYProgress [0 → 0.25] maps to:
   *   - heroY:      0% → 12%  (subtle upward drift as user scrolls)
   *   - heroOpacity: 1 → 0    (hero fades out before divisions appear)
   */
  const { scrollYProgress } = useScroll();
  const heroY       = useTransform(scrollYProgress, [0, 0.25], ['0%', '12%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <div style={{ background: NAVY, minHeight: '100vh' }}>

      {/* All responsive media queries — rendered once to avoid duplication */}
      <ResponsiveStyles />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="hero-section"
        style={{
          background: NAVY,
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '180px',
          paddingBottom: '120px',
        }}
      >
        {/* Subtle radial gold glow — purely decorative, non-interactive */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(212,168,83,0.06) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Parallax wrapper — y and opacity driven by scroll position */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '0 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            {/* Eyebrow label */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: GOLD,
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              Based on Creativity
            </motion.span>

            {/* Page headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(1.75rem, 7vw, 5rem)',
                fontWeight: 700,
                color: CREAM,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              What We Create
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: CREAM_80,
                lineHeight: 1.65,
                maxWidth: '620px',
                margin: 0,
              }}
            >
              From animation to merchandise: imagination and intention, all under one roof.
            </motion.p>

            {/* Animated divider line — scales in from the centre */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '120px',
                height: '1px',
                background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
                transformOrigin: 'center',
              }}
            />

            {/* Division name chips — quick visual index of all six divisions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center',
                marginTop: '8px',
              }}
            >
              {DIVISIONS.map((d) => (
                <span
                  key={d.name}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.6rem',
                    color: GOLD,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    border: `1px solid ${GOLD_20}`,
                    padding: '7px 16px',
                    borderRadius: '999px',
                    background: GOLD_10,
                  }}
                >
                  {d.name}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── 2. Division sections ─────────────────────────────────────────────── */}
      {DIVISIONS.map((division, index) => (
        <DivisionSection key={division.name} division={division} index={index} />
      ))}

      {/* ── 3. Process ──────────────────────────────────────────────────────── */}
      <section className="process-section" style={{ background: NAVY, padding: '120px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(0.6875rem, 1.5vw, 0.8125rem)',
                color: GOLD,
                letterSpacing: 'clamp(2px, 0.5vw, 3px)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              How We Work
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                fontStyle: 'italic',
                color: CREAM,
                fontWeight: 400,
                margin: '0 0 20px',
              }}
            >
              The Process
            </h2>
            <div
              style={{
                width: '60px',
                height: '1px',
                background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
                margin: '0 auto',
              }}
            />
          </motion.div>

          {/* 4-column steps grid with a connecting gold thread behind the circles.
              The thread is absolutely positioned so it sits at circle centre-height
              (top: 28px = half of the 56px circle). Hidden on mobile via CSS. */}
          <div
            className="process-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              position: 'relative',
            }}
          >
            {/* Horizontal connector line — desktop only */}
            <div
              className="process-connector"
              style={{
                position: 'absolute',
                top: '28px',
                left: 'calc(12.5% + 16px)',
                right: 'calc(12.5% + 16px)',
                height: '1px',
                background: GOLD_30,
                zIndex: 0,
              }}
            />

            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.12, // stagger: 120ms per step
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: 'relative',
                  zIndex: 1, // above the connector line
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 32px',
                  gap: '24px',
                }}
              >
                {/* Numbered circle — sits on top of the connector line */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: `1px solid ${GOLD_30}`,
                    background: NAVY,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.7rem',
                      color: GOLD,
                      letterSpacing: '2px',
                      fontWeight: 700,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 'clamp(1rem, 2vw, 1.375rem)',
                    color: GOLD,
                    letterSpacing: 'clamp(2px, 0.5vw, 3px)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {step.title}
                </span>

                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.9375rem',
                    color: CREAM_80,
                    lineHeight: 1.65,
                    margin: 0,
                    maxWidth: '220px',
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CTA ──────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="cta-section"
        style={{
          background: GOLD,
          padding: '120px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft light overlay — breaks up the flat gold surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '700px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              color: 'rgba(10,22,40,0.6)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Let's collaborate
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: NAVY,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Have a project in mind?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 'clamp(0.9375rem, 2.5vw, 1.125rem)',
              color: 'rgba(10,22,40,0.75)',
              lineHeight: 1.65,
              margin: 0,
              maxWidth: '520px',
            }}
          >
            Every great project begins with a single conversation. Tell us what you are
            building and we will tell you how we can bring it to life.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(10,22,40,0.25)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/contact')}
            className="cta-button"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
              fontWeight: 700,
              color: CREAM,
              background: NAVY,
              border: 'none',
              borderRadius: '8px',
              padding: '16px 40px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            Get in Touch
          </motion.button>
        </div>
      </motion.section>

    </div>
  );
}