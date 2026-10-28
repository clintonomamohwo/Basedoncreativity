import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { SEO } from './SEO';
import { COLORS, FONTS } from '../../lib/constants';
import { FinalCTA, MidCTA, ProcessSection } from './ServicesPageSections';

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const INDIGO_BLUE = '#1A1F4B';  // Primary background (per Guidelines.md)
const NAVY_950    = '#0F1530';  // Deep sections/alternating (per Guidelines.md)
const GOLD        = COLORS.gold;
const CREAM       = '#FAF3E0';

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
  relatedLabel?: string;
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
      'An animated work or production-ready development package with story, character, and visual direction clearly defined.',
    relatedWork: 'First Animated Series · In development',
    relatedPath: '/work/first-animated-series',
    bg: INDIGO_BLUE,
  },
  {
    number: '02',
    eyebrow: 'Publishing & Editorial',
    name: 'Stories in Print & Digital',
    entity: 'Creativity Base Press',
    description:
      'A publishing house rooted in voices that deserve to be heard. From illustrated novellas to editorial magazines, we design and produce print and digital publications built to command attention on any shelf - or any screen.',
    deliverables: [
      'Book & Novella Publishing',
      'Editorial Magazine Design & Production',
      "Illustrated Children's Books",
      'Zine & Independent Press Runs',
      'Copywriting & Editorial Direction',
      'Print-Ready & Digital-First Formats',
    ],
    outcome:
      'A designed, edited, print-ready or digital-first publication, with its text and visual system prepared for release.',
    relatedWork: 'First Publication · In development',
    relatedPath: '/work/first-publication',
    bg: NAVY_950,
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
      'A digital platform or community program with defined structure, editorial voice, content programming, and a clear operating model.',
    relatedWork: 'Creativity Base Web Platform · BOC-owned',
    relatedPath: '/work/creativity-base-web-platform',
    bg: INDIGO_BLUE,
  },
  {
    number: '04',
    eyebrow: 'Visual Identity & Design',
    name: 'Identity as Declaration',
    entity: 'Graphic Design - BOC Direct',
    description:
      'Identity is not decoration - it is declaration. Our graphic design practice crafts brand systems and visual identities that speak before a single word is read. Precise, purposeful, and unmistakable.',
    deliverables: [
      'Brand Identity & Logo Systems',
      'Typography & Colour Architecture',
      'Print & Packaging Design',
      'Art Direction & Creative Strategy',
      'Illustration & Icon Systems',
      'Brand Guidelines & Usage Standards',
    ],
    outcome:
      'A flexible identity system with logo, typography, colour, art direction, and usage guidance for the brand’s key touchpoints.',
    relatedWork: 'BOC Brand System Refresh · BOC-owned',
    relatedPath: '/work/boc-brand-system-refresh',
    bg: NAVY_950,
  },
  {
    number: '05',
    eyebrow: 'Websites & Digital Experiences',
    name: 'Presence Built to Last',
    entity: 'Web Development - BOC Direct',
    description:
      'Digital presence designed and engineered with the same care as the brands it represents. Bespoke websites and interactive experiences that are fast, accessible, and beautiful - built for the long term.',
    deliverables: [
      'Bespoke Website Design & Development',
      'Interactive & Immersive Web Experiences',
      'E-Commerce & Digital Storefronts',
      'UX Research & Interface Design',
      'Performance Optimisation & Accessibility',
      'CMS Integration & Ongoing Support',
    ],
    outcome:
      'A designed and developed website with responsive interfaces, CMS integration, and accessibility and performance checks appropriate to the project.',
    relatedWork: 'Modern Cosmos · Client project',
    relatedPath: '/work/modern-cosmos',
    bg: INDIGO_BLUE,
  },
  {
    number: '06',
    eyebrow: 'Products & Apparel',
    name: 'Creativity You Can Hold',
    entity: 'Merchandise - BOC Direct',
    description:
      'When creativity becomes something tangible. We conceive, design, and produce limited-run merchandise and apparel collections that carry the full weight of the brand they represent - objects worth owning and worth giving.',
    deliverables: [
      'Apparel Design & Limited-Run Production',
      'Art Prints & Collectible Objects',
      'Branded Merchandise Strategy',
      'Packaging Design & Unboxing Experience',
      'Artist & Brand Collaborations',
      'Product Photography Direction',
    ],
    outcome:
      'A cohesive product concept and rollout package covering design, packaging direction, and campaign assets ready for production planning.',
    relatedWork: 'Motion Merch Capsule · Concept',
    relatedPath: '/work/motion-merch-capsule',
    bg: NAVY_950,
  },
  {
    number: '07',
    eyebrow: 'Documentation & Enablement',
    name: 'Technical Writing',
    entity: 'Technical Writing - BOC Direct',
    description:
      'We turn complex products, processes, and ideas into clear documentation people can use. Work can include user guides, standard operating procedures, knowledge-base content, and technical explainers.',
    deliverables: [
      'User & Product Documentation',
      'Standard Operating Procedures',
      'Knowledge-Base & Help-Centre Content',
      'Technical Explainers & Reference Guides',
      'Documentation Review & Restructuring',
      'Style, Terminology & Editorial Consistency',
    ],
    outcome:
      'A clear, structured set of technical documents tailored to the readers, tools, and workflow they support.',
    relatedWork: 'Discuss this service',
    relatedPath: '/contact',
    relatedLabel: 'Next step',
    bg: INDIGO_BLUE,
  },
  {
    number: '08',
    eyebrow: 'AI-Enabled Operations',
    name: 'AI Automation Services',
    entity: 'AI Automation - BOC Direct',
    description:
      'We help teams identify repetitive tasks where AI can assist, then scope and build fit-for-purpose automations around existing tools. Workflows include clear human review and handoffs where appropriate.',
    deliverables: [
      'AI Opportunity & Workflow Mapping',
      'AI-Assisted Task Automation',
      'Tool Integration & Process Design',
      'Human Review & Escalation Steps',
      'Testing & Quality Checks',
      'Handoff & Usage Documentation',
    ],
    outcome:
      'A scoped AI-assisted workflow with defined inputs, review points, and handoffs, documented for the team that will use it.',
    relatedWork: 'Discuss this service',
    relatedPath: '/contact',
    relatedLabel: 'Next step',
    bg: NAVY_950,
  },
  {
    number: '09',
    eyebrow: 'Connected Workflows',
    name: 'Workflow Automation',
    entity: 'Workflow Automation - BOC Direct',
    description:
      'We map repeatable business processes and connect steps across the tools a team already uses. Automations are scoped around clear triggers, handoffs, exception handling, and maintainable documentation.',
    deliverables: [
      'Process Mapping & Automation Scoping',
      'Cross-Tool Workflow Connections',
      'Notifications, Routing & Approvals',
      'Exception Handling & Escalation Paths',
      'Testing & Reliability Checks',
      'Handoff & Maintenance Documentation',
    ],
    outcome:
      'A documented automated process with defined triggers, system handoffs, and a clear path for exceptions.',
    relatedWork: 'Discuss this service',
    relatedPath: '/contact',
    relatedLabel: 'Next step',
    bg: INDIGO_BLUE,
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
      'Concepts are forged with care. We explore boldly, then distil - arriving at a creative direction that feels inevitable in hindsight.',
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
      'Development, animation, print, or code - production is where the direction becomes something you can see, hold, or ship. We maintain craft standards at every stage.',
  },
  {
    number: '05',
    title: 'Delivery',
    subtitle: 'We send it out right.',
    description:
      'Delivery is not an ending - it is an opening. We ensure your work enters the world with the presence, preparation, and positioning it deserves.',
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
        fontFamily: FONTS.body,
        fontSize: '0.8125rem',
        fontWeight: 600,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: GOLD,
        opacity: 0.65,
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
          maxWidth: '1380px',
          margin: '0 auto',
          padding: 'clamp(56px, 8vw, 96px) clamp(20px, 3vw, 40px)',
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
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: GOLD,
                opacity: 0.5,
              }}
            >
              {svc.number}
            </span>
            <Eyebrow>{svc.eyebrow}</Eyebrow>
          </div>
          <h2
            style={{
              fontFamily: FONTS.heading,
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
              fontFamily: FONTS.accent,
              fontStyle: 'italic',
              fontSize: '1.125rem',
              color: GOLD,
              opacity: 0.7,
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
          {/* Column 1 - What we offer */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(255,200,87,0.15), 0 0 0 1px rgba(255,200,87,0.2)' }}
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
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <p
              style={{
                fontFamily: FONTS.heading,
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
                fontFamily: FONTS.body,
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                color: CREAM_70,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {svc.description}
            </p>
          </motion.div>

          {/* Column 2 - Deliverables */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(255,200,87,0.12), 0 0 0 1px rgba(255,200,87,0.15)' }}
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
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <p
              style={{
                fontFamily: FONTS.heading,
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
                    fontFamily: FONTS.body,
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

          {/* Column 3 - Outcome + related work */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(255,200,87,0.15), 0 0 0 1px rgba(255,200,87,0.2)' }}
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
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <p
              style={{
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: GOLD,
                margin: 0,
              }}
            >
              Typical Deliverable
            </p>
            <div style={{ width: '24px', height: '1px', background: GOLD_50 }} />
            <p
              style={{
                fontFamily: FONTS.accent,
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
                  fontFamily: FONTS.body,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: CREAM_40,
                  marginBottom: '8px',
                }}
              >
                {svc.relatedLabel ?? 'Related BOC-owned work'}
              </p>
              <Link
                to={svc.relatedPath}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.04em',
                  color: GOLD,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FAF3E0'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = GOLD; }}
              >
                {svc.relatedWork}
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Mid-page CTA ─────────────────────────────────────────────────────────────

export function ServicesPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Services | Based on Creativity" description="Explore BOC services including brand identity, digital experiences, technical writing, AI automation services, and workflow automation." path="/services" />
    <div style={{ background: INDIGO_BLUE, minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: INDIGO_BLUE,
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 'clamp(140px, 18vw, 200px)',
          paddingBottom: 'clamp(64px, 10vw, 112px)',
          paddingLeft: 'clamp(20px, 3vw, 40px)',
          paddingRight: 'clamp(20px, 3vw, 40px)',
        }}
      >
        {/* Ambient radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,200,87,0.07) 0%, transparent 65%), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='rgba(255,200,87,0.03)' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5'/%3E%3Cpath d='M9 18h6'/%3E%3Cpath d='M10 22h4'/%3E%3C/svg%3E\")",
            backgroundPosition: 'center, 85% 45%',
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundSize: 'auto, 280px',
            pointerEvents: 'none',
          }}
        />
        {/* Celestial dots right side */}
        <CelestialDots side="right" />

        <div style={{ maxWidth: '1380px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
              fontFamily: FONTS.heading,
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
              fontFamily: FONTS.body,
              fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
              color: CREAM_70,
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 0 32px',
            }}
          >
            BOC brings creative craft and practical expertise together - from animation, publishing, web, design, and merchandise to technical writing and automation. Every service is shaped around the work it needs to do.
          </motion.p>

          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: '0.875rem',
              color: 'rgba(250,243,224,0.55)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 0 28px',
            }}
          >
            The examples linked below include BOC-owned work and client work. Service descriptions are typical deliverables, not claims of measured client results.
          </p>

          {/* Italic accent */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            style={{
              fontFamily: FONTS.accent,
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
            {['Animation', 'Publishing', 'Digital Platform', 'Graphic Design', 'Web Development', 'Merchandise', 'Technical Writing', 'AI Automation Services', 'Workflow Automation'].map((chip) => (
              <span
                key={chip}
                style={{
                  fontFamily: FONTS.heading,
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

      {/* ── Mid CTA - after all service sections ─────────────────────────────── */}
      <MidCTA navigate={navigate} />

      {/* ── Process ──────────────────────────────────────────────────────────── */}
      <ProcessSection navigate={navigate} />

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <FinalCTA navigate={navigate} />

    </div>
    </>
  );
}
