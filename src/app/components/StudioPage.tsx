import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SEO } from './SEO';
import { AbstractFrame, BottomCTA, CreationCard, Eyebrow, GoldRule, InDevelopmentBand, PipelineSection, SectionLabel } from './StudioPageSections';

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const NAVY     = '#0A1628';
const NAVY_D   = '#070F1E';
const NAVY_ALT = '#0D1B30';
const GOLD     = '#D4A853';
const CREAM    = '#FAF3E0';

const CREAM_80 = 'rgba(250,243,224,0.80)';
const CREAM_55 = 'rgba(250,243,224,0.55)';
const CREAM_30 = 'rgba(250,243,224,0.30)';
const CREAM_15 = 'rgba(250,243,224,0.15)';
const GOLD_06  = 'rgba(212,168,83,0.06)';
const GOLD_10  = 'rgba(212,168,83,0.10)';
const GOLD_18  = 'rgba(212,168,83,0.18)';
const GOLD_30  = 'rgba(212,168,83,0.30)';
const GOLD_50  = 'rgba(212,168,83,0.50)';

// ─── Images ───────────────────────────────────────────────────────────────────

const IMG_HERO     = 'https://images.unsplash.com/photo-1761845064537-929979725425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYXRpb24lMjBjb25jZXB0JTIwYXJ0JTIwZGFyayUyMGNpbmVtYXRpYyUyMGF0bW9zcGhlcmljfGVufDF8fHx8MTc3NDYyNDIwOHww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_SERIES   = 'https://images.unsplash.com/photo-1619850015546-84a1c7b7aed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBmaWxtJTIwcHJvZHVjdGlvbiUyMGRhcmslMjBhdG1vc3BoZXJpYyUyMGxpZ2h0fGVufDF8fHx8MTc3NDYyNDIxNHww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_CHARS    = 'https://images.unsplash.com/photo-1600697395543-ef3ee6e9af7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyYWN0ZXIlMjBkZXNpZ24lMjBpbGx1c3RyYXRpb24lMjB3b3JsZCUyMGJ1aWxkaW5nJTIwZmFudGFzeXxlbnwxfHx8fDE3NzQ2MjQyMDl8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_STORY    = 'https://images.unsplash.com/photo-1743177189973-1a7238266e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yeWJvYXJkJTIwbmFycmF0aXZlJTIwZmlsbSUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzQ2MjQyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_MOTION   = 'https://images.unsplash.com/photo-1742094509989-f8f948fc518d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3Rpb24lMjBkZXNpZ24lMjB2aXN1YWwlMjBkZXZlbG9wbWVudCUyMGFic3RyYWN0JTIwY2luZW1hdGljfGVufDF8fHx8MTc3NDYyNDIxMXww&ixlib=rb-4.1.0&q=80&w=1080';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreationCard {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  detail: string;
  image: string;
  imageAlt: string;
}

interface PipelineStage {
  number: string;
  title: string;
  description: string;
  outputs: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CREATIONS: CreationCard[] = [
  {
    id: 'animated-series',
    index: '01',
    title: 'Original Animated Series',
    category: 'Long-Form Narrative',
    description:
      'Multi-episode worlds built from the ground up — original characters, complete mythologies, and visual languages designed to carry a story across an entire season or more. Series that are made to travel.',
    detail: 'Episodic storytelling · Series bible · Full production pipeline',
    image: IMG_SERIES,
    imageAlt: 'Cinematic dark atmospheric film production',
  },
  {
    id: 'narrative-shorts',
    index: '02',
    title: 'Narrative Shorts',
    category: 'Short-Form Film',
    description:
      'Compact, precise stories told in motion. Narrative shorts demand economy — every second must earn its place. We build short-form animation with the same depth of world and character as anything longer.',
    detail: 'Short film · Festival format · Motion poetry',
    image: IMG_STORY,
    imageAlt: 'Storyboard narrative film dark moody',
  },
  {
    id: 'character-worlds',
    index: '03',
    title: 'Character Worlds',
    category: 'Visual Development',
    description:
      'Before a story can be told, its world must exist. We develop character systems, creature language, cultural detail, and environment logic — the foundation that makes everything else feel inhabited and real.',
    detail: 'Character design · World logic · Species & culture systems',
    image: IMG_CHARS,
    imageAlt: 'Character design illustration world building',
  },
  {
    id: 'visual-story-systems',
    index: '04',
    title: 'Visual Story Systems',
    category: 'Motion Language',
    description:
      'The way a story moves is as expressive as what it says. We develop motion languages, visual grammars, and animation principles that give each project a distinct way of existing on screen.',
    detail: 'Animation direction · Motion principles · Colour & light language',
    image: IMG_MOTION,
    imageAlt: 'Motion design visual development abstract cinematic',
  },
];

const PIPELINE_STAGES: PipelineStage[] = [
  {
    number: '01',
    title: 'Concept',
    description: 'Every project begins with a question, not an answer. We explore the core idea — what the story is actually about beneath its surface.',
    outputs: ['Story kernel', 'Thematic framework', 'Initial premise document'],
  },
  {
    number: '02',
    title: 'World-Building',
    description: 'The world comes before the plot. We establish geography, history, rules, and logic so the story has somewhere real to live.',
    outputs: ['World bible (draft)', 'Environment concepts', 'Cultural groundwork'],
  },
  {
    number: '03',
    title: 'Character Direction',
    description: 'Characters are built from the inside out — psychology first, design second. The look must be earned by what is underneath.',
    outputs: ['Character sheets', 'Personality matrices', 'Relationship maps'],
  },
  {
    number: '04',
    title: 'Story Development',
    description: 'Narrative structure, episode architecture, and scene-level writing. The story becomes a document before it becomes anything else.',
    outputs: ['Story outlines', 'Scene breakdowns', 'Series or short bible'],
  },
  {
    number: '05',
    title: 'Visual Development',
    description: 'Colour, light, texture, and composition. We establish how the world looks — not just what is in it, but how it feels to be inside it.',
    outputs: ['Style frames', 'Colour palette', 'Lighting direction'],
  },
  {
    number: '06',
    title: 'Motion Language',
    description: 'Animation principles, timing philosophy, and performance direction — the decisions that make movement feel alive rather than executed.',
    outputs: ['Animation reference', 'Performance notes', 'Motion tests'],
  },
  {
    number: '07',
    title: 'Production Planning',
    description: 'The creative decisions are made before production begins, not during it. Careful pre-production is what allows good production to exist.',
    outputs: ['Production schedule', 'Asset pipeline', 'Delivery format specs'],
  },
];

// ─── Shared components ────────────────────────────────────────────────────────

export function StudioPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Studio | Based on Creativity" description="Step inside the Based on Creativity studio to see how narrative, design craft, motion, and world-building shape every creative collaboration." path="/studio" />
    <div style={{ background: NAVY }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: NAVY_D,
          minHeight: 'clamp(460px, 72vh, 720px)',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Full-bleed hero image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <ImageWithFallback
            src={IMG_HERO}
            alt="Animation concept art cinematic atmospheric"
            className="w-full h-full object-cover"
            style={{ opacity: 0.35 }}
          />
          {/* Gradient overlay — ensure text is always legible */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                180deg,
                rgba(7,15,30,0.55) 0%,
                rgba(7,15,30,0.3) 35%,
                rgba(7,15,30,0.7) 70%,
                ${NAVY_D} 100%
              )`,
            }}
          />
          {/* Left vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, ${NAVY_D} 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Celestial decoration */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: 'min(280px, 40vw)',
            height: 'min(280px, 40vw)',
            borderRadius: '50%',
            border: `1px solid ${GOLD_10}`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: 'min(160px, 24vw)',
            height: 'min(160px, 24vw)',
            borderRadius: '50%',
            border: `1px solid ${GOLD_18}`,
            zIndex: 1,
            pointerEvents: 'none',
            transform: `translate(calc((min(280px,40vw) - min(160px,24vw)) / 2), calc((min(280px,40vw) - min(160px,24vw)) / 2))`,
          }}
        />

        {/* Hero content */}
        <div
          style={{
            maxWidth: '1100px',
            width: '100%',
            margin: '0 auto',
            padding: 'clamp(120px, 15vw, 168px) clamp(20px, 5vw, 48px) clamp(56px, 8vw, 88px)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}
          >
            <Eyebrow muted>Based on Creativity</Eyebrow>
            <div style={{ width: '28px', height: '1px', background: GOLD, opacity: 0.6 }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '24px' }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.6875rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: GOLD,
                margin: '0 0 12px',
              }}
            >
              Creativity Base Studios
            </p>
            <h1
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(2.75rem, 9vw, 6.5rem)',
                letterSpacing: '-0.03em',
                color: CREAM,
                margin: 0,
                lineHeight: 1.0,
              }}
            >
              Where Stories
              <br />
              <span style={{ color: GOLD }}>Take Form.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
              color: CREAM_80,
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 0 20px',
            }}
          >
            Creativity Base Studios is the animation and visual storytelling division of Based on Creativity. We develop original animation, build worlds from the ground up, direct characters, and design motion-led stories built to last.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)',
              color: GOLD_50,
              margin: '0 0 44px',
            }}
          >
            Original animation. World-building. Visual development. Motion-led storytelling.
          </motion.p>

          {/* Discipline tags */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
          >
            {['Animation', 'World-Building', 'Character Direction', 'Motion Language', 'Visual Development'].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '0.575rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: GOLD,
                  border: `1px solid ${GOLD_18}`,
                  padding: '6px 13px',
                  borderRadius: '999px',
                  background: 'rgba(212,168,83,0.05)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── What We Are Creating ─────────────────────────────────────────────── */}
      <section
        style={{
          background: NAVY,
          padding: 'clamp(56px, 7vw, 88px) clamp(20px, 5vw, 48px)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '32px',
              alignItems: 'end',
              marginBottom: 'clamp(40px, 6vw, 64px)',
            }}
          >
            <div>
              <SectionLabel>The Work</SectionLabel>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 }}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                  letterSpacing: '-0.02em',
                  color: CREAM,
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                What We Are
                <br />Creating
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12 }}
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                color: CREAM_55,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              The studio works across four creative modes — each one a different form of the same commitment to original storytelling and visual craftsmanship.
            </motion.p>
          </div>

          {/* Cards — 2×2 on desktop, 1-col on mobile */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
              gap: '16px',
            }}
          >
            {CREATIONS.map((card, i) => (
              <CreationCard key={card.id} card={card} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pipeline ─────────────────────────────────────────────────────────── */}
      <PipelineSection />

      {/* ── In Development ───────────────────────────────────────────────────── */}
      <InDevelopmentBand navigate={navigate} />

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <BottomCTA navigate={navigate} />

    </div>
    </>
  );
}
