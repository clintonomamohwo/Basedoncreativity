import { motion, useScroll, useTransform } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

export function AboutPage() {
  // useScroll tracks global window scroll — no containerRef needed here
  const { scrollYProgress } = useScroll();

  // Parallax transforms for the decorative Sun and Moon icons
  const sunY       = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const moonY      = useTransform(scrollYProgress, [0, 1], [0,  200]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1,   0.6, 0.2]);
  const moonOpacity= useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 0.6, 1,   0.3]);

  return (
    <div className="relative min-h-screen bg-[#1A1F4B] overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F4B] via-[#2D2D2D] to-[#1A1F4B] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,200,87,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(246,230,180,0.1),transparent_50%)]" />
        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
          }} />
      </div>

      {/* Floating sun and moon icons with parallax */}
      <motion.div
        style={{ y: sunY, opacity: sunOpacity }}
        className="fixed top-20 right-20 pointer-events-none z-10"
      >
        <Sun className="w-24 h-24 text-[#FFC857] opacity-40" strokeWidth={1} />
      </motion.div>

      <motion.div
        style={{ y: moonY, opacity: moonOpacity }}
        className="fixed bottom-20 left-20 pointer-events-none z-10"
      >
        <Moon className="w-20 h-20 text-[#F6E6B4] opacity-40" strokeWidth={1} />
      </motion.div>

      {/* Main content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-32">
        
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <p className="tracking-[0.2em] uppercase text-[#FFC857]/60"
            style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(0.6875rem, 2.5vw, 0.875rem)' }}>
            About Based on Creativity
          </p>
          <div className="mt-3 h-px w-16 bg-[#FFC857]/30" />
        </motion.div>

        {/* Opening */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 md:mb-24"
        >
          <h1
            className="text-[#FFC857] mb-6"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(2rem, 8vw, 4.5rem)',
            }}
          >
            Every story begins somewhere.
          </h1>
        </motion.div>

        {/* Main narrative sections */}
        <div className="space-y-10 md:space-y-16">
          
          {/* Section 1: Childhood dreams */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 md:p-12 border border-white/10">
              <p className="text-[#F6E6B4] leading-relaxed mb-6"
                style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(0.9375rem, 3.5vw, 1.125rem)' }}>
                Most kids grow up dreaming of becoming astronauts or firefighters. For our founder, the dream was simpler but endlessly expansive: <span className="text-[#FFC857] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>to create</span>. Not for attention or perfection, but for connection, the quiet belief that stories could cross borders, dissolve barriers, and remind us that beneath our differences, we are remarkably alike.
              </p>
            </div>
          </motion.section>

          {/* Section 2: The evolution */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 md:p-12 border border-white/10">
              <p className="text-[#F6E6B4] leading-relaxed mb-6"
                style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(0.9375rem, 3.5vw, 1.125rem)' }}>
                What started as childhood sketches and endless imagination slowly grew into a dream: to build something that could bring stories to life in the way great storytellers once had. At one point, that dream even took on a playful form: an early online name, <span className="text-[#FFC857]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>"Ruona Risney,"</span> a lighthearted nod to the ambition of becoming the next Walt Disney. The name was a joke, but the dream behind it was sincere.
              </p>
            </div>
          </motion.section>

          {/* Section 3: Based on Creativity birth */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 md:p-12 border border-white/10">
              <h2
                className="text-white mb-6"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                }}
              >
                Over time, that dream evolved.
              </h2>
              <p className="text-[#F6E6B4] leading-relaxed"
                style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(0.9375rem, 3.5vw, 1.125rem)' }}>
                Based on Creativity was born from the idea that imagination and intention belong together, a space where artists, designers, and storytellers explore ideas and shape narratives that resonate beyond the surface.
              </p>
            </div>
          </motion.section>

          {/* Section 4: Philosophy - Sun & Moon */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="my-12 md:my-24"
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-[#FFC857]/10 to-[#F6E6B4]/5 rounded-3xl p-6 md:p-16 border border-[#FFC857]/20 shadow-2xl">
              <h2
                className="text-[#FFC857] mb-8 md:mb-10 text-center"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                }}
              >
                At the heart of the brand lives a quiet philosophy
              </h2>
              
              <p className="text-[#F6E6B4] mb-8 text-center italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.125rem, 4vw, 1.25rem)' }}>
                inspired by the balance of the sun and the moon.
              </p>

              {/* Sun & Moon duality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-8 md:mt-12">
                {/* Moon */}
                <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(216,215,219,0.25)] hover:border-[#D8D7DB]/30">
                  <div className="flex items-center gap-4 mb-5 md:mb-6">
                    <Moon className="w-8 h-8 md:w-10 md:h-10 text-[#F6E6B4]" strokeWidth={1.5} />
                    <h3
                      className="text-[#F6E6B4]"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
                      }}
                    >
                      The Moon
                    </h3>
                  </div>
                  <p className="text-[#D8D7DB] leading-relaxed italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 3.5vw, 1.125rem)' }}>
                    Represents reflection: the stillness where ideas gather, where listening begins, where stories quietly take shape.
                  </p>
                </div>

                {/* Sun */}
                <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,200,87,0.35)] hover:border-[#FFC857]/30">
                  <div className="flex items-center gap-4 mb-5 md:mb-6">
                    <Sun className="w-8 h-8 md:w-10 md:h-10 text-[#FFC857]" strokeWidth={1.5} />
                    <h3
                      className="text-[#FFC857]"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
                      }}
                    >
                      The Sun
                    </h3>
                  </div>
                  <p className="text-[#D8D7DB] leading-relaxed italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 3.5vw, 1.125rem)' }}>
                    Represents expression: the moment creativity emerges into the world, illuminating ideas and bringing them to life.
                  </p>
                </div>
              </div>

              {/* The space between */}
              <div className="mt-10 md:mt-12 text-center">
                <p className="text-white leading-relaxed"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>
                  Between reflection and expression lies the space where creativity truly lives.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 5: The mission */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 md:p-12 border border-white/10">
              <p className="text-[#F6E6B4] leading-relaxed"
                style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(0.9375rem, 3.5vw, 1.125rem)' }}>
                Based on Creativity exists in that space, where stories are imagined, shared, and discovered, and where creativity becomes a way to connect people to something deeper than themselves.
              </p>
            </div>
          </motion.section>

          {/* Closing quote */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="pb-12 md:pb-20"
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-[#FFC857]/20 to-transparent rounded-3xl p-6 md:p-16 border border-[#FFC857]/30">
              <blockquote
                className="text-[#FFC857] leading-relaxed text-center italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.25rem, 5vw, 2.5rem)' }}
              >
                "Because sometimes the most powerful stories are the ones that remind us we were never that different to begin with."
              </blockquote>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}