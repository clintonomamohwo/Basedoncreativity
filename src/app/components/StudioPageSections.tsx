import type React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

const NAVY = '#0A1628';
const NAVY_D = '#070F1E';
const NAVY_ALT = '#0D1B30';
const GOLD = '#D4A853';
const CREAM = '#FAF3E0';
const CREAM_80 = 'rgba(250,243,224,0.80)';
const CREAM_55 = 'rgba(250,243,224,0.55)';
const CREAM_30 = 'rgba(250,243,224,0.30)';
const CREAM_15 = 'rgba(250,243,224,0.15)';
const GOLD_06 = 'rgba(212,168,83,0.06)';
const GOLD_10 = 'rgba(212,168,83,0.10)';
const GOLD_18 = 'rgba(212,168,83,0.18)';
const GOLD_30 = 'rgba(212,168,83,0.30)';
const GOLD_50 = 'rgba(212,168,83,0.50)';

const IMG_HERO     = 'https://images.unsplash.com/photo-1761845064537-929979725425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYXRpb24lMjBjb25jZXB0JTIwYXJ0JTIwZGFyayUyMGNpbmVtYXRpYyUyMGF0bW9zcGhlcmljfGVufDF8fHx8MTc3NDYyNDIwOHww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_SERIES   = 'https://images.unsplash.com/photo-1619850015546-84a1c7b7aed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBmaWxtJTIwcHJvZHVjdGlvbiUyMGRhcmslMjBhdG1vc3BoZXJpYyUyMGxpZ2h0fGVufDF8fHx8MTc3NDYyNDIxNHww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_CHARS    = 'https://images.unsplash.com/photo-1600697395543-ef3ee6e9af7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyYWN0ZXIlMjBkZXNpZ24lMjBpbGx1c3RyYXRpb24lMjB3b3JsZCUyMGJ1aWxkaW5nJTIwZmFudGFzeXxlbnwxfHx8fDE3NzQ2MjQyMDl8MA&ixlib=rb-4.1.0&q=80&w=1080';

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

export function GoldRule({ gradient = true }: { gradient?: boolean }) {
  return (
    <div
      style={{
        height: '1px',
        background: gradient
          ? `linear-gradient(90deg, transparent, ${GOLD} 40%, ${GOLD} 60%, transparent)`
          : `linear-gradient(90deg, ${GOLD_50}, transparent 80%)`,
      }}
    />
  );
}

export function Eyebrow({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <p
      style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: muted ? GOLD_50 : GOLD,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}
    >
      <Eyebrow muted>{children}</Eyebrow>
      <div style={{ width: '24px', height: '1px', background: GOLD, opacity: 0.5 }} />
    </motion.div>
  );
}

// ─── Abstract placeholder frame ───────────────────────────────────────────────
// Used as decorative fill panels within composition cells

export function AbstractFrame({ accent = GOLD, style = {} }: { accent?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: NAVY_D,
        ...style,
      }}
    >
      {/* Grid of faint lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${(i + 1) * (100 / 7)}%`,
            height: '1px',
            background: `rgba(212,168,83,${0.04 + i * 0.01})`,
          }}
        />
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${(i + 1) * 20}%`,
            width: '1px',
            background: `rgba(212,168,83,${0.04 + i * 0.01})`,
          }}
        />
      ))}
      {/* Centre orb */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: `1px solid ${accent}`,
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: accent,
          opacity: 0.07,
        }}
      />
    </div>
  );
}

// ─── Creation Card ────────────────────────────────────────────────────────────

export function CreationCard({ card, delay }: { card: CreationCard; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${GOLD_10}`,
        borderRadius: '16px',
        overflow: 'hidden',
        background: GOLD_06,
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = GOLD_30;
        el.style.boxShadow = `0 0 48px rgba(212,168,83,0.07), 0 20px 56px rgba(0,0,0,0.4)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = GOLD_10;
        el.style.boxShadow = 'none';
      }}
    >
      {/* Image panel */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <ImageWithFallback
          src={card.image}
          alt={card.imageAlt}
          className="w-full h-full object-cover"
          style={{ transition: 'transform 0.6s ease', transform: 'scale(1.04)' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,22,40,0.15) 0%, rgba(10,22,40,0.70) 100%)',
          }}
        />
        {/* Index */}
        <span
          style={{
            position: 'absolute',
            top: '16px',
            left: '18px',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: '0.625rem',
            letterSpacing: '0.14em',
            color: GOLD_50,
          }}
        >
          {card.index}
        </span>
        {/* Category chip */}
        <span
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: GOLD,
            background: 'rgba(10,22,40,0.7)',
            border: `1px solid ${GOLD_18}`,
            padding: '5px 10px',
            borderRadius: '999px',
            backdropFilter: 'blur(8px)',
          }}
        >
          {card.category}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: 'clamp(22px, 4vw, 30px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)',
            letterSpacing: '-0.01em',
            color: CREAM,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {card.title}
        </h3>

        <div style={{ height: '1px', background: `linear-gradient(90deg, ${GOLD_30}, transparent)` }} />

        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.9375rem',
            color: CREAM_80,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {card.description}
        </p>

        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: GOLD_50,
            margin: 0,
            marginTop: '4px',
          }}
        >
          {card.detail}
        </p>
      </div>
    </motion.article>
  );
}

// ─── Pipeline Section ─────────────────────────────────────────────────────────

export function PipelineSection() {
  return (
    <section
      style={{
        background: NAVY_D,
        padding: 'clamp(56px, 8vw, 88px) clamp(20px, 5vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top rule */}
      <GoldRule gradient={false} />
      <div style={{ height: 'clamp(24px, 4vw, 40px)' }} />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(212,168,83,0.04), transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: '40px',
            marginBottom: 'clamp(48px, 7vw, 80px)',
            alignItems: 'end',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionLabel>Studio Pipeline</SectionLabel>
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: CREAM,
                margin: '0 0 12px',
                lineHeight: 1.1,
              }}
            >
              How We Build
            </h2>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: GOLD_50,
                margin: 0,
              }}
            >
              Seven stages. One non-negotiable standard.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
              color: CREAM_55,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Every Creativity Base Studios project — whether a feature-length series or a three-minute short — moves through the same deliberate pipeline. Pre-production is where the work is won or lost. We believe in spending the time here so production can breathe.
          </motion.p>
        </div>

        {/* Stages — vertical stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {PIPELINE_STAGES.map((stage, i) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                alignItems: 'stretch',
                gap: '0',
                border: `1px solid ${GOLD_10}`,
                borderRadius:
                  i === 0 ? '12px 12px 0 0'
                  : i === PIPELINE_STAGES.length - 1 ? '0 0 12px 12px'
                  : '0',
                borderTop: i > 0 ? 'none' : `1px solid ${GOLD_10}`,
                overflow: 'hidden',
                background: 'rgba(7,15,30,0.6)',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.3s ease',
              }}
              whileHover={{ background: 'rgba(212,168,83,0.04)' }}
            >
              {/* Number column */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(20px, 3vw, 28px) clamp(20px, 3vw, 32px)',
                  borderRight: `1px solid ${GOLD_10}`,
                  minWidth: '80px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '0.625rem',
                    letterSpacing: '0.14em',
                    color: GOLD_30,
                  }}
                >
                  {stage.number}
                </span>
              </div>

              {/* Content */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                  gap: 'clamp(16px, 3vw, 32px)',
                  padding: 'clamp(20px, 3vw, 28px) clamp(20px, 4vw, 36px)',
                  alignItems: 'start',
                }}
              >
                {/* Title + description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: GOLD,
                      margin: 0,
                    }}
                  >
                    {stage.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: '0.9375rem',
                      color: CREAM_55,
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {stage.description}
                  </p>
                </div>

                {/* Outputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: CREAM_30,
                      margin: '0 0 6px',
                    }}
                  >
                    Outputs
                  </p>
                  {stage.outputs.map((o) => (
                    <div key={o} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '14px',
                          height: '1px',
                          background: GOLD,
                          flexShrink: 0,
                          opacity: 0.45,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: '0.875rem',
                          color: CREAM_55,
                        }}
                      >
                        {o}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step accent bar right edge */}
              <div
                style={{
                  width: '3px',
                  background: `linear-gradient(180deg, transparent, ${GOLD} 50%, transparent)`,
                  opacity: 0.15,
                  flexShrink: 0,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ height: 'clamp(24px, 4vw, 40px)' }} />
      <GoldRule gradient={false} />
    </section>
  );
}

// ─── In Development Band ──────────────────────────────────────────────────────

export function InDevelopmentBand({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section
      style={{
        background: NAVY_ALT,
        padding: 'clamp(56px, 7vw, 88px) clamp(20px, 5vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image — heavily overlaid */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ImageWithFallback
          src={IMG_SERIES}
          alt="First animated series in development"
          className="w-full h-full object-cover"
          style={{ opacity: 0.06 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${NAVY_ALT} 40%, rgba(13,27,48,0.94) 100%)`,
          }}
        />
      </div>

      {/* Celestial grid overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            transform: 'translateY(-50%)',
            width: 'min(320px, 45vw)',
            height: 'min(320px, 45vw)',
            borderRadius: '50%',
            border: `1px solid ${GOLD_10}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            transform: 'translateY(-50%)',
            width: 'min(200px, 30vw)',
            height: 'min(200px, 30vw)',
            borderRadius: '50%',
            border: `1px solid ${GOLD_18}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            transform: 'translateY(-50%)',
            width: 'min(80px, 14vw)',
            height: 'min(80px, 14vw)',
            borderRadius: '50%',
            background: GOLD_06,
            border: `1px solid ${GOLD_30}`,
          }}
        />
      </div>

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
        }}
      >
        {/* Left — content */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* Status pill */}
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: GOLD,
                border: `1px solid ${GOLD_30}`,
                background: GOLD_06,
                padding: '6px 14px',
                borderRadius: '999px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: GOLD,
                  animation: 'pulse 2s ease infinite',
                }}
              />
              Currently In Development
            </span>
          </div>

          <Eyebrow muted>Creativity Base Studios · First Original</Eyebrow>

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
            First Animated
            <br />
            <span style={{ color: GOLD }}>Series</span>
          </h2>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)',
              color: GOLD_50,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            An original world, built quietly.
          </p>

          <div style={{ height: '1px', background: `linear-gradient(90deg, ${GOLD_30}, transparent)`, maxWidth: '200px' }} />

          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
              color: CREAM_80,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '480px',
            }}
          >
            The debut animated series from Creativity Base Studios is currently in development. Original characters. A world built from the ground up with cultural depth and a visual language designed to travel across borders. No release date has been set. The work will be finished when it is right.
          </p>

          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '0.875rem',
              color: CREAM_30,
              lineHeight: 1.6,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            Details will be released through The Quiet Pages and the official BOC channels when the time is right.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => navigate('/work')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: `1.5px solid ${GOLD_30}`,
                borderRadius: '8px',
                padding: '12px 24px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.75rem',
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
              View in Work
              <ArrowUpRight size={13} />
            </button>
          </div>
        </motion.div>

        {/* Right — decorative card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            gap: '2px',
            aspectRatio: '4/3',
            borderRadius: '16px',
            overflow: 'hidden',
            border: `1px solid ${GOLD_10}`,
          }}
        >
          {/* Top cell — wide image */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <ImageWithFallback
              src={IMG_HERO}
              alt="Animation concept art dark cinematic"
              className="w-full h-full object-cover"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.45)' }} />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: GOLD_50,
              }}
            >
              Visual Development
            </div>
          </div>

          {/* Bottom row — two cells */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <ImageWithFallback
                src={IMG_CHARS}
                alt="Character worlds development"
                className="w-full h-full object-cover"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.5)' }} />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '0.5rem',
                  letterSpacing: '0.16em',
                  color: GOLD_50,
                }}
              >
                Characters
              </div>
            </div>
            <div
              style={{
                background: GOLD_06,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '8px',
                border: `1px solid ${GOLD_10}`,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: `1px solid ${GOLD_30}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={14} color={GOLD} style={{ marginLeft: '2px' }} />
              </div>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '0.5rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: GOLD_50,
                }}
              >
                In Production
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

export function BottomCTA({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section
      style={{
        background: NAVY,
        padding: 'clamp(64px, 8vw, 96px) clamp(20px, 5vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Top rule */}
      <GoldRule />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(212,168,83,0.07), transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
        {/* Ornament */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{ width: '24px', height: '1px', background: GOLD_30 }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: GOLD, opacity: 0.4 }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: GOLD, opacity: 0.2 }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: GOLD, opacity: 0.4 }} />
          <div style={{ width: '24px', height: '1px', background: GOLD_30 }} />
        </div>

        <Eyebrow muted>Creativity Base Studios</Eyebrow>

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
          Work with the Studio
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.0625rem, 2.5vw, 1.375rem)',
            color: GOLD_50,
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          The studio is open to collaborators, commissioners, and creative partners who believe in the work.
        </p>

        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            color: CREAM_55,
            lineHeight: 1.7,
            margin: 0,
            maxWidth: '500px',
          }}
        >
          If you are building an original IP, commissioning animation for a serious project, or looking for a creative partner with the depth to see something through — start with a conversation. We are selective. That is by design.
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
            Contact the Studio
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => navigate('/services')}
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
            View Animation Services
          </button>
        </div>

        {/* Fine print */}
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.8125rem',
            color: CREAM_15,
            margin: '8px 0 0',
            letterSpacing: '0.02em',
          }}
        >
          Creativity Base Studios accepts selective commissions and original IP development partnerships.
        </p>
      </motion.div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

