import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';

const pillars = [
  {
    Icon: Moon,
    iconColor: '#1A1F4B',
    title: 'Reflection',
    body: 'The stillness where ideas gather, where listening begins, where stories quietly take shape.',
  },
  {
    Icon: Sun,
    iconColor: '#C9972E',
    title: 'Expression',
    body: 'The moment creativity emerges into the world, illuminating ideas and bringing them to life.',
  },
];

export function PhilosophySection() {
  return (
    <section
      className="py-16 md:py-32 px-4 md:px-6"
      style={{ background: '#D8D7DB' }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h2
            className="mb-0"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(1.75rem, 7vw, 4.5rem)',
              color: '#1A1F4B',
              fontWeight: 700,
            }}
          >
            Our{' '}
            <span style={{ color: '#C9972E' }}>Philosophy</span>
          </h2>
        </motion.div>

        {/* Two philosophy cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {pillars.map(({ Icon, iconColor, title, body }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 2px 16px rgba(26, 31, 75, 0.08)',
                border: '1px solid rgba(26, 31, 75, 0.08)',
              }}
            >
              {/* Icon */}
              <div className="mb-6">
                <Icon
                  size={32}
                  strokeWidth={1.5}
                  style={{ color: iconColor }}
                />
              </div>

              {/* Title — Space Mono bold, Indigo */}
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '1.375rem',
                  color: '#1A1F4B',
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h3>

              {/* Body — Cormorant Garamond italic 20px, Indigo */}
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: '20px',
                  color: '#1A1F4B',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Centered closing line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 400,
            fontSize: '18px',
            color: '#1A1F4B',
            lineHeight: 1.6,
            maxWidth: '640px',
            margin: '48px auto 0',
          }}
        >
          Between reflection and expression lies the space where creativity truly lives.
        </motion.p>

      </div>
    </section>
  );
}