import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const NAVY = '#0A1628';
export const NAVY_ALT = '#0D1B30';
export const GOLD = '#D4A853';
export const CREAM = '#FAF3E0';
export const CREAM_70 = 'rgba(250,243,224,0.70)';
export const CREAM_20 = 'rgba(250,243,224,0.20)';
export const GOLD_06 = 'rgba(212,168,83,0.06)';
export const GOLD_12 = 'rgba(212,168,83,0.12)';
export const GOLD_30 = 'rgba(212,168,83,0.30)';
export const GOLD_50 = 'rgba(212,168,83,0.50)';
export const CREAM_40 = 'rgba(250,243,224,0.40)';
export const GOLD_20 = 'rgba(212,168,83,0.20)';

interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
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
export function GoldRule({ gradient = false, className = '' }: { gradient?: boolean; className?: string }) {
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

export function Eyebrow({ children }: { children: React.ReactNode }) {
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

export function CelestialDots({ side = 'right' }: { side?: 'left' | 'right' }) {
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

export function MidCTA({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
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

export function ProcessSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
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

export function FinalCTA({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
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

