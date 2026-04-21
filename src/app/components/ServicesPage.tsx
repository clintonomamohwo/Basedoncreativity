import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { SEO } from './SEO';

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const NAVY      = '#0A1628';
const NAVY_ALT  = '#0D1B30';
const GOLD      = '#D4A853';
const CREAM     = '#FAF3E0';

const CREAM_70  = 'rgba(250,243,224,0.70)';
const CREAM_40  = 'rgba(250,243,224,0.40)';
const CREAM_20  = 'rgba(250,243,224,0.20)';
const GOLD_06   = 'rgba(212,168,83,0.06)';
const GOLD_12   = 'rgba(212,168,83,0.12)';
const GOLD_20   = 'rgba(212,168,83,0.20)';
const GOLD_30   = 'rgba(212,168,83,0.30)';
const GOLD_50   = 'rgba(212,168,83,0.50)';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceDef {
  number: string;
  eyebrow: string;
  name: string;
  entity: string;
  description: string;
  deliverables: string[];
  outcome: string;
  relatedWork: string;
  relatedPath: string;
  bg: string;
}

interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES: ServiceDef[] = [
  {
    number: '01',
    eyebrow: 'Animation & Storytelling',
    name: 'Bringing Worlds to Life',
    entity: 'Creativity Base Studios',
    description:
      'Where narrative meets craft. Our animation studio develops characters, worlds, and stories through 2D and digital animation, motion design, and cinematic production. Every frame is intentional. Every story is deeply considered before production begins.',
    deliverables: [
      '2D Character Animation & Scene Production',
      'Short Film & Original Series Development',
      'Motion Graphics & Visual Effects',
      'Storyboarding & Concept Art',
      'Brand Animation & Animated Logos',
      'Animatics & Pre-Production Packages',
    ],
    outcome:
      'A finished animated work — or a production-ready development package — that carries genuine narrative weight and visual identity. Work built to travel across platforms, borders, and audiences.',
    relatedWork: 'First Animated Series',
    relatedPath: '/work',
    bg: NAVY,
  },
  {
    number: '02',
    eyebrow: 'Publishing & Editorial',
    name: 'Stories in Print & Digital',
    entity: 'Creativity Base Press',
    description:
      'A publishing house rooted in voices that deserve to be heard. From illustrated novellas to editorial magazines, we design and produce print and digital publications built to command attention on any shelf — or any screen.',
    deliverables: [
      'Book & Novella Publishing',
      'Editorial Magazine Design & Production',
      "Illustrated Children's Books",
      'Zine & Independent Press Runs',
      'Copywriting & Editorial Direction',
      'Print-Ready & Digital-First Formats',
    ],
    outcome:
      'A polished publication — print or digital — that reads as professionally as it looks. Stories given the design, production quality, and distribution strategy they deserve.',
    relatedWork: 'First Publication',
    relatedPath: '/work',
    bg: NAVY_ALT,
  },
  {
    number: '03',
    eyebrow: 'Digital Platform & Community',
    name: 'Spaces for Creative Minds',
    entity: 'Creativity Base Network',
    description:
      'We build and operate digital ecosystems where creative audiences gather, grow, and collaborate. Platforms, newsletters, and community spaces designed with the same editorial care as everything else BOC produces.',
    deliverables: [
      'Creative Community Platform Development',
      'Newsletter Strategy & Production',
      'Content Programming & Curation',
      'Digital Events & Live Programming',
      'Creator Ecosystem Architecture',
      'Audience Growth & Retention Strategy',
    ],
    outcome:
      'A living digital space — not just a product launch. A platform with a genuine community, a clear editorial voice, and the infrastructure to grow without losing its character.',
    relatedWork: 'bochq.com',
    relatedPath: '/work',
    bg: NAVY,
  },
  {
    number: '04',
    eyebrow: 'Visual Identity & Design',
    name: 'Identity as Declaration',
    entity: 'Graphic Design — BOC Direct',
    description:
      'Identity is not decoration — it is declaration. Our graphic design practice crafts brand systems and visual identities that speak before a single word is read. Precise, purposeful, and unmistakable.',
    deliverables: [
      'Brand Identity & Logo Systems',
      'Typography & Colour Architecture',
      'Print & Packaging Design',
      'Art Direction & Creative Strategy',
      'Illustration & Icon Systems',
      'Brand Guidelines & Usage Standards',
    ],
    outcome:
      'A complete brand system with the depth and flexibility to serve an organisation across every touchpoint — from business card to billboard, from website to social to product.',
    relatedWork: 'BOC Brand Identity',
    relatedPath: '/work',
    bg: NAVY_ALT,
  },
  {
    number: '05',
    eyebrow: 'Websites & Digital Experiences',
    name: 'Presence Built to Last',
    entity: 'Web Development — BOC Direct',
    description:
      'Digital presence designed and engineered with the same care as the brands it represents. Bespoke websites and interactive experiences that are fast, accessible, and beautiful — built for the long term.',
    deliverables: [
      'Bespoke Website Design & Development',
      'Interactive & Immersive Web Experiences',
      'E-Commerce & Digital Storefronts',
      'UX Research & Interface Design',
      'Performance Optimisation & Accessibility',
      'CMS Integration & Ongoing Support',
    ],
    outcome:
      'A high-performance website that earns its place — one that represents the brand faithfully, loads quickly, converts visitors, and holds up beautifully as the brand scales.',
    relatedWork: 'bochq.com',
    relatedPath: '/work',
    bg: NAVY,
  },
  {
    number: '06',
    eyebrow: 'Products & Apparel',
    name: 'Creativity You Can Hold',
    entity: 'Merchandise — BOC Direct',
    description:
      'When creativity becomes something tangible. We conceive, design, and produce limited-run merchandise and apparel collections that carry the full weight of the brand they represent — objects worth owning and worth giving.',
    deliverables: [
      'Apparel Design & Limited-Run Production',
      'Art Prints & Collectible Objects',
      'Branded Merchandise Strategy',
      'Packaging Design & Unboxing Experience',
      'Artist & Brand Collaborations',
      'Product Photography Direction',
    ],
    outcome:
      'A merchandise line that functions as marketing, community signal, and revenue stream simultaneously — products that fans seek out rather than accept as afterthoughts.',
    relatedWork: 'BOC Brand Identity',
    relatedPath: '/work',
    bg: NAVY_ALT,
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery',
    subtitle: 'We listen first.',
    description:
      'Deep research into your world, your audience, and the white space where your story belongs. No brief is too complex. No vision is too ambitious.',
  },
  {
    number: '02',
    title: 'Direction',
    subtitle: 'We find the angle.',
    description:
      'Concepts are forged with care. We explore boldly, then distil — arriving at a creative direction that feels inevitable in hindsight.',
  },
  {
    number: '03',
    title: 'Design',
    subtitle: 'We build the world.',
    description:
      'Great work lives in the details. We design, iterate, and sharpen until every element earns its place. Nothing is decorative. Everything serves the work.',
  },
  {
    number: '04',
    title: 'Production',
    subtitle: 'We make it real.',
    description:
      'Development, animation, print, or code — production is where the direction becomes something you can see, hold, or ship. We maintain craft standards at every stage.',
  },
  {
    number: '05',
    title: 'Delivery',
    subtitle: 'We send it out right.',
    description:
      'Delivery is not an ending — it is an opening. We ensure your work enters the world with the presence, preparation, and positioning it deserves.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function GoldRule({ gradient = false, className = '' }: { gradient?: boolean; className?: string }) {
  return (
    <div
      className={className}
      style={{
        height: '1px',
        background: gradient
          ? `linear-gradient(90deg, transparent, ${GOLD} 40%, ${GOLD} 60%, transparent)`
          : `linear-gradient(90deg, ${GOLD_50}, transparent)`,
      }}
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: GOLD_50,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

// ─── Celestial dot motif ──────────────────────────────────────────────────────

function CelestialDots({ side = 'right' }: { side?: 'left' | 'right' }) {
  const dots = [
    { top: '18%', size: 2, opacity: 0.25 },
    { top: '34%', size: 1.5, opacity: 0.18 },
    { top: '52%', size: 3, opacity: 0.15 },
    { top: '68%', size: 1, opacity: 0.22 },
    { top: '82%', size: 2, opacity: 0.12 },
  ];
  return (
    <div
      className="hidden lg:block absolute top-0 bottom-0 pointer-events-none"
      style={{ [side]: '32px', width: '24px', zIndex: 0 }}
    >
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: d.top,
            left: side === 'right' ? '50%' : '50%',
            transform: 'translate(-50%)',
            width: `${d.size}px`,
            height: `${d.size}px`,
            background: GOLD,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ svc, index }: { svc: ServiceDef; index: number }) {
  const navigate = useNavigate();
  const isAlt = index % 2 === 1;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      style={{ background: svc.bg, position: 'relative', overflow: 'hidden' }}
    >
      <CelestialDots side={isAlt ? 'left' : 'right'} />

      {/* Top gold rule */}
      <GoldRule />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(56px, 8vw, 96px) clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: GOLD_30,
              }}
            >
              {svc.number}
            </span>
            <Eyebrow>{svc.eyebrow}</Eyebrow>
          </div>
          <h2
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              letterSpacing: '-0.01em',
              color: CREAM,
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {svc.name}
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.9375rem',
              color: GOLD_50,
              margin: 0,
            }}
          >
            {svc.entity}
          </p>
        </motion.div>

        {/* Three-column content grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '2px',
          }}
        >
          {/* Column 1 — What we offer */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: 'clamp(24px, 4vw, 36px)',
              background: GOLD_06,
              border: `1px solid ${GOLD_12}`,
              borderRadius: '16px 0 0 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: GOLD,
                margin: 0,
              }}
            >
              What We Offer
            </p>
            <div
              style={{
                width: '24px',
                height: '1px',
                background: GOLD_50,
              }}
            />
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                color: CREAM_70,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {svc.description}
            </p>
          </motion.div>

          {/* Column 2 — Deliverables */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: 'clamp(24px, 4vw, 36px)',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${GOLD_12}`,
              borderLeft: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: GOLD,
                margin: 0,
              }}
            >
              Deliverables
            </p>
            <div style={{ width: '24px', height: '1px', background: GOLD_50 }} />
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0' }}>
              {svc.deliverables.map((d, i) => (
                <li
                  key={d}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '11px 0',
                    borderBottom: i < svc.deliverables.length - 1 ? `1px solid ${GOLD_12}` : 'none',
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.9375rem',
                    color: CREAM_70,
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '1px',
                      background: GOLD,
                      flexShrink: 0,
                      marginTop: '10px',
                      opacity: 0.6,
                    }}
                  />
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 — Outcome + related work */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.19, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: 'clamp(24px, 4vw, 36px)',
              background: GOLD_06,
              border: `1px solid ${GOLD_12}`,
              borderLeft: 'none',
              borderRadius: '0 16px 16px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: GOLD,
                margin: 0,
              }}
            >
              Expected Outcome
            </p>
            <div style={{ width: '24px', height: '1px', background: GOLD_50 }} />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
                color: CREAM,
                lineHeight: 1.6,
                margin: 0,
                flex: 1,
              }}
            >
              {svc.outcome}
            </p>

            {/* Related work link */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '20px',
                borderTop: `1px solid ${GOLD_12}`,
              }}
            >
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: CREAM_40,
                  marginBottom: '8px',
                }}
              >
                See Example
              </p>
              <button
                onClick={() => navigate(svc.relatedPath)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.04em',
                  color: GOLD,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#FAF3E0'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
              >
                {svc.relatedWork}
                <ArrowUpRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Mid-page CTA ─────────────────────────────────────────────────────────────

function MidCTA({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section
      style={{
        background: NAVY_ALT,
        borderTop: `1px solid ${GOLD_12}`,
        borderBottom: `1px solid ${GOLD_12}`,
        padding: 'clamp(48px, 7vw, 80px) clamp(20px, 5vw, 48px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '24px',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Eyebrow>Ready to talk?</Eyebrow>
        <h3
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 'clamp(1.375rem, 3.5vw, 2rem)',
            letterSpacing: '-0.01em',
            color: CREAM,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Something in here fits what you are building?
        </h3>
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            color: CREAM_70,
            lineHeight: 1.65,
            margin: 0,
            maxWidth: '520px',
          }}
        >
          Tell us what you are working on. We will tell you honestly whether it is the kind of project we take on — and if it is, how we would approach it.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
          <button
            onClick={() => navigate('/contact')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: GOLD,
              border: 'none',
              borderRadius: '8px',
              padding: '14px 32px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '0.8125rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: NAVY,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#C9972E'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
          >
            Discuss Your Project
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('/work')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: `1.5px solid ${GOLD_30}`,
              borderRadius: '8px',
              padding: '14px 32px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '0.8125rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: GOLD,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = GOLD_50;
              btn.style.background = GOLD_06;
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = GOLD_30;
              btn.style.background = 'transparent';
            }}
          >
            View Selected Work
          </button>
        </div>

        {/* Qualification note */}
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.8125rem',
            color: CREAM_40,
            margin: 0,
            marginTop: '4px',
          }}
        >
          BOC works with selective commissions, original properties, and ambitious brand builders.
        </p>
      </motion.div>
    </section>
  );
}

// ─── Process Section ──────────────────────────────────────────────────────────

function ProcessSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section
      style={{
        background: NAVY,
        padding: 'clamp(72px, 10vw, 120px) clamp(20px, 5vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Faint radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,168,83,0.04), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 'clamp(48px, 7vw, 80px)' }}
        >
          <Eyebrow>How We Work</Eyebrow>
          <div
            style={{
              width: '28px',
              height: '1px',
              background: GOLD,
              margin: '14px 0 20px',
              opacity: 0.6,
            }}
          />
          <h2
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
              letterSpacing: '-0.01em',
              color: CREAM,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            The Process
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)',
              color: GOLD_50,
              marginTop: '12px',
              maxWidth: '440px',
            }}
          >
            Five stages. One standard. Every project, every time.
          </p>
        </motion.div>

        {/* Steps — vertical on mobile, horizontal columns on desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '2px',
          }}
        >
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: GOLD_06,
                border: `1px solid ${GOLD_12}`,
                borderRadius: i === 0 ? '16px 0 0 16px' : i === PROCESS_STEPS.length - 1 ? '0 16px 16px 0' : '0',
                padding: 'clamp(24px, 4vw, 32px) clamp(20px, 3vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
              whileHover={{
                background: 'rgba(212,168,83,0.09)',
              }}
            >
              {/* Step number circle */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: `1px solid ${GOLD_30}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '0.6rem',
                    letterSpacing: '0.12em',
                    color: GOLD,
                  }}
                >
                  {step.number}
                </span>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: GOLD,
                    margin: '0 0 4px',
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: '0.9375rem',
                    color: CREAM_40,
                    margin: '0 0 12px',
                  }}
                >
                  {step.subtitle}
                </p>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.9375rem',
                    color: CREAM_70,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Post-process CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            marginTop: 'clamp(48px, 7vw, 72px)',
            padding: 'clamp(28px, 4vw, 40px) clamp(24px, 4vw, 40px)',
            border: `1px solid ${GOLD_20}`,
            borderRadius: '16px',
            background: GOLD_06,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '540px' }}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(1.0625rem, 2.5vw, 1.375rem)',
                color: CREAM,
                margin: '0 0 8px',
                letterSpacing: '-0.01em',
              }}
            >
              Ready to walk through it together?
            </p>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.9375rem',
                color: CREAM_70,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Every engagement starts with a discovery conversation — no obligation, no pitch deck. Just a real discussion about whether this is a good fit.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => navigate('/contact')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: GOLD,
                border: 'none',
                borderRadius: '8px',
                padding: '13px 28px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: NAVY,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#C9972E'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
            >
              Discuss Your Project
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => navigate('/work')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: `1.5px solid ${GOLD_30}`,
                borderRadius: '8px',
                padding: '13px 28px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: GOLD,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'border-color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.borderColor = GOLD_50;
                btn.style.background = GOLD_06;
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.borderColor = GOLD_30;
                btn.style.background = 'transparent';
              }}
            >
              View Selected Work
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section
      style={{
        background: NAVY_ALT,
        padding: 'clamp(80px, 10vw, 128px) clamp(20px, 5vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Decorative top gold rule */}
      <GoldRule gradient className="absolute top-0 left-0 right-0" />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(212,168,83,0.06), transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {/* Celestial ornament */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ width: '32px', height: '1px', background: GOLD_30 }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD, opacity: 0.5 }} />
          <div style={{ width: '32px', height: '1px', background: GOLD_30 }} />
        </div>

        <Eyebrow>Let&apos;s Build Something</Eyebrow>

        <h2
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
            letterSpacing: '-0.02em',
            color: CREAM,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          This is where it starts.
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
            color: GOLD_50,
            margin: '0',
            lineHeight: 1.55,
          }}
        >
          Not with a contract — with a conversation.
        </p>

        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            color: CREAM_70,
            lineHeight: 1.65,
            margin: 0,
            maxWidth: '500px',
          }}
        >
          Every project in our portfolio began with someone deciding the work they needed deserved more than a template or a transactional agency. If that is where you are, we want to hear from you.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '8px',
          }}
        >
          <button
            onClick={() => navigate('/contact')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: GOLD,
              border: 'none',
              borderRadius: '8px',
              padding: '15px 36px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '0.8125rem',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: NAVY,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#C9972E'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
          >
            Discuss Your Project
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => navigate('/work')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: `1.5px solid ${GOLD_30}`,
              borderRadius: '8px',
              padding: '15px 36px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '0.8125rem',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: GOLD,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = GOLD_50;
              btn.style.background = GOLD_06;
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = GOLD_30;
              btn.style.background = 'transparent';
            }}
          >
            View Selected Work
          </button>
        </div>

        {/* Qualification note */}
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.8125rem',
            color: CREAM_20,
            margin: '8px 0 0',
            letterSpacing: '0.02em',
          }}
        >
          BOC works with selective commissions, original properties, and ambitious brand builders.
        </p>
      </motion.div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ServicesPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Services | Based on Creativity" description="Discover Based on Creativity services across brand identity, digital experiences, creative direction, and strategy for ambitious brands and founders." path="/services" />
    <div style={{ background: NAVY, minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: NAVY,
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 'clamp(140px, 18vw, 200px)',
          paddingBottom: 'clamp(64px, 10vw, 112px)',
          paddingLeft: 'clamp(20px, 5vw, 48px)',
          paddingRight: 'clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Ambient radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,168,83,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        {/* Celestial dots right side */}
        <CelestialDots side="right" />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow + rule */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: '32px' }}
          >
            <Eyebrow>Based on Creativity</Eyebrow>
            <div style={{ width: '32px', height: '1px', background: GOLD, marginTop: '14px', opacity: 0.7 }} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              letterSpacing: '-0.03em',
              color: CREAM,
              margin: '0 0 20px',
              lineHeight: 1.0,
            }}
          >
            What We
            <br />
            <span style={{ color: GOLD }}>Create.</span>
          </motion.h1>

          {/* Value proposition */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
              color: CREAM_70,
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 0 32px',
            }}
          >
            BOC operates across six creative disciplines — from animation and publishing to web, design, platform, and merchandise. Every discipline is held to the same standard: craft that outlasts the moment it was made for.
          </motion.p>

          {/* Italic accent */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)',
              color: GOLD_50,
              margin: '0 0 48px',
            }}
          >
            Imagination and intention, all under one roof.
          </motion.p>

          {/* Division chips */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
          >
            {['Animation', 'Publishing', 'Digital Platform', 'Graphic Design', 'Web Development', 'Merchandise'].map((chip) => (
              <span
                key={chip}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: GOLD,
                  border: `1px solid ${GOLD_20}`,
                  padding: '7px 14px',
                  borderRadius: '999px',
                  background: GOLD_06,
                }}
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────────── */}
      {SERVICES.map((svc, i) => (
        <ServiceCard key={svc.number} svc={svc} index={i} />
      ))}

      {/* ── Mid CTA — after all service sections ─────────────────────────────── */}
      <MidCTA navigate={navigate} />

      {/* ── Process ──────────────────────────────────────────────────────────── */}
      <ProcessSection navigate={navigate} />

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <FinalCTA navigate={navigate} />

    </div>
    </>
  );
}
