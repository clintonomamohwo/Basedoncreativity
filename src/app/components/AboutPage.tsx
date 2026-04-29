import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import {
  Sun,
  Moon,
  MapPin,
  Building2,
  Layers,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SEO } from "./SEO";
import { COLORS, FONTS } from "../../lib/constants";

// ─── Helpers ────────────────────────────────────────────────────────────────

function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{
        background:
          `linear-gradient(90deg, transparent, ${COLORS.gold} 40%, ${COLORS.gold} 60%, transparent)`,
      }}
    />
  );
}

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="tracking-[0.3em] uppercase mb-3"
      style={{
        fontFamily: FONTS.body,
        fontSize: "0.75rem",
        color: COLORS.gold,
      }}
    >
      {children}
    </p>
  );
}

// ─── Section: Hero ───────────────────────────────────────────────────────────

function HeroBlock({
  sunY,
  sunOpacity,
  moonY,
  moonOpacity,
}: {
  sunY: MotionValue<number>;
  sunOpacity: MotionValue<number>;
  moonY: MotionValue<number>;
  moonOpacity: MotionValue<number>;
}) {
  return (
    <section className="relative min-h-[72vh] flex flex-col justify-center px-4 md:px-12 lg:px-20 pt-28 pb-16 md:pt-32 md:pb-20">
      {/* Decorative parallax icons */}
      <motion.div
        style={{ y: sunY, opacity: sunOpacity }}
        className="absolute top-28 right-8 md:right-20 pointer-events-none z-10"
      >
        <Sun
          className="w-20 h-20 md:w-32 md:h-32 opacity-30"
          strokeWidth={1}
          style={{ color: COLORS.gold }}
        />
      </motion.div>
      <motion.div
        style={{ y: moonY, opacity: moonOpacity }}
        className="absolute bottom-12 left-6 md:left-16 pointer-events-none z-10"
      >
        <Moon
          className="w-16 h-16 md:w-24 md:h-24 text-[#F6E6B4] opacity-25"
          strokeWidth={1}
        />
      </motion.div>

      <div className="relative z-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <EyebrowLabel>About Based on Creativity</EyebrowLabel>
          <div className="h-px w-12 mb-10" style={{ background: COLORS.gold }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
            delay: 0.1,
          }}
          className="text-white mb-8"
          style={{
            fontFamily: FONTS.heading,
            fontSize: "clamp(3rem, 10vw, 6.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 700,
          }}
        >
          The Studio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: 0.2,
          }}
          className="italic mb-8"
          style={{
            fontFamily: FONTS.accent,
            fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)",
            color: COLORS.gold,
          }}
        >
          Built in the quiet. Born in the light.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: 0.3,
          }}
          className="text-[#D8D7DB] leading-relaxed max-w-2xl"
          style={{
            fontFamily: FONTS.body,
            fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
            lineHeight: 1.65,
          }}
        >
          Based on Creativity is an independent creative company rooted in
          Ontario, Canada. We live in the quiet space between reflection and
          expression - where ideas are gathered in stillness, shaped with
          intention, and released into the world as stories, images, platforms,
          and experiences that resonate.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Section: At a Glance ────────────────────────────────────────────────────

const GLANCE_ITEMS = [
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Ontario, Canada",
    note: "Serving clients globally",
  },
  {
    icon: Building2,
    label: "Company Type",
    value: "Independent Creative Co.",
    note: "Parent to three subsidiaries",
  },
  {
    icon: Layers,
    label: "Focus Areas",
    value: "Animation · Publishing · Design",
    note: "Web dev · Merch · Digital platforms",
  },
  {
    icon: Globe,
    label: "Operating Model",
    value: "Remote-first",
    note: "Collaborative & studio-led",
  },
];

function AtAGlance() {
  return (
    <section className="px-4 md:px-12 lg:px-20 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <GoldRule className="mb-16" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <EyebrowLabel>Company Profile</EyebrowLabel>
          <h2
            className="text-white"
            style={{
              fontFamily: FONTS.heading,
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            At a Glance
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GLANCE_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-2xl p-6 border border-white/10"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(255,200,87,0.12)",
                    border: "1px solid rgba(255,200,87,0.25)",
                  }}
                >
                  <Icon size={18} style={{ color: COLORS.gold }} />
                </div>
                <p
                  className="uppercase tracking-[0.2em] mb-2"
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: "0.65rem",
                    color: COLORS.gold,
                    opacity: 0.6,
                  }}
                >
                  {item.label}
                </p>
                <p
                  className="text-white mb-1"
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    lineHeight: 1.4,
                  }}
                >
                  {item.value}
                </p>
                <p
                  className="text-[#D8D7DB]/60"
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: "0.8125rem",
                  }}
                >
                  {item.note}
                </p>
              </motion.div>
            );
          })}
        </div>

        <GoldRule className="mt-16" />
      </div>
    </section>
  );
}

// ─── Section: Sun & Moon Philosophy ─────────────────────────────────────────

function Philosophy() {
  return (
    <section className="px-4 md:px-12 lg:px-20 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <EyebrowLabel>Brand Philosophy</EyebrowLabel>
          <h2
            className="text-white mb-6"
            style={{
              fontFamily: FONTS.heading,
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Reflection &amp; Expression
          </h2>
          <p
            className="text-[#F6E6B4] italic max-w-xl"
            style={{
              fontFamily: FONTS.accent,
              fontSize: "clamp(1.125rem, 3vw, 1.375rem)",
            }}
          >
            At the heart of everything we do lives a quiet duality - inspired by
            the balance of the sun and the moon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Moon card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl p-8 border border-white/10 transition-all duration-500 hover:border-[#D8D7DB]/30 hover:shadow-[0_0_40px_rgba(216,215,219,0.12)]"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-4 mb-5">
              <Moon className="w-8 h-8 text-[#F6E6B4]" strokeWidth={1.5} />
              <h3
                className="text-[#F6E6B4]"
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: "1.25rem",
                  fontWeight: 700,
                }}
              >
                The Moon - Reflection
              </h3>
            </div>
            <p
              className="text-[#D8D7DB] italic leading-relaxed"
              style={{
                fontFamily: FONTS.accent,
                fontSize: "1.125rem",
              }}
            >
              Indigo Blue (#1A1F4B) - depth, stillness, and the space where
              listening begins. Ideas gather in silence before they are ready to
              emerge. Reflection is not inaction; it is the foundation of
              everything intentional.
            </p>
          </motion.div>

          {/* Sun card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl p-8 border transition-all duration-500"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center gap-4 mb-5">
              <Sun className="w-8 h-8" strokeWidth={1.5} style={{ color: COLORS.gold }} />
              <h3
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: COLORS.gold,
                }}
              >
                The Sun - Expression
              </h3>
            </div>
            <p
              className="text-[#D8D7DB] italic leading-relaxed"
              style={{
                fontFamily: FONTS.accent,
                fontSize: "1.125rem",
              }}
            >
              Gold (${COLORS.gold}) - warmth, creativity, and the courage to release.
              Expression is the moment an idea stops being private and becomes a
              shared experience - illuminating what reflection quietly prepared.
            </p>
          </motion.div>
        </div>

        {/* Centre statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-10 px-6 rounded-2xl border"
          style={{
            background: "rgba(255,200,87,0.04)",
            borderColor: `${COLORS.gold}26`,
          }}
        >
          <p
            className="italic"
            style={{
              fontFamily: FONTS.accent,
              fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
              lineHeight: 1.55,
              color: COLORS.gold,
            }}
          >
            "Between reflection and expression lies the space where creativity
            truly lives and that space is where Based on Creativity was built."
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section: The Family of Brands ──────────────────────────────────────────

const BRANDS = [
  {
    name: "Creativity Base Studios",
    slug: "CBS",
    domain: "Animation",
    description:
      "The animation arm of BOC. From short-form storytelling to full-length animated features, CBS develops original characters, worlds, and narratives rooted in cultural depth and visual craft.",
    accent: COLORS.gold,
    cardBg: "rgba(255,200,87,0.06)",
    border: "rgba(255,200,87,0.2)",
  },
  {
    name: "Creativity Base Press",
    slug: "CBP",
    domain: "Publishing",
    description:
      "The publishing house of BOC. CBP brings written stories, illustrated books, and editorial projects to life - bridging the space between the page and the imagination with the same reverence as the studio's visual work.",
    accent: "#F6E6B4",
    cardBg: "rgba(246,230,180,0.05)",
    border: "rgba(246,230,180,0.18)",
  },
  {
    name: "Creativity Base Network",
    slug: "CBN",
    domain: "Digital Platform",
    description:
      "The digital infrastructure of BOC. CBN develops and operates the web platforms, communities, and content channels that connect the studio's audiences - from streaming experiences to creative networks and digital-first publishing.",
    accent: "#D8D7DB",
    cardBg: "rgba(216,215,219,0.05)",
    border: "rgba(216,215,219,0.18)",
  },
];

function FamilyOfBrands() {
  return (
    <section className="px-4 md:px-12 lg:px-20 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <GoldRule className="mb-16" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-4"
        >
          <EyebrowLabel>Subsidiaries</EyebrowLabel>
          <h2
            className="text-white mb-6"
            style={{
              fontFamily: FONTS.heading,
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            The Family of Brands
          </h2>
          <p
            className="text-[#D8D7DB] max-w-2xl leading-relaxed mb-14"
            style={{
              fontFamily: FONTS.body,
              fontSize: "1.0625rem",
              lineHeight: 1.65,
            }}
          >
            Based on Creativity is the parent company behind three distinct
            creative entities, each with its own domain, discipline, and
            audience; united by a shared philosophy and a single creative
            vision.
          </p>
        </motion.div>

        <div className="space-y-5">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="rounded-2xl p-7 md:p-10 border flex flex-col md:flex-row md:items-start gap-6 md:gap-10 transition-all duration-300"
              style={{
                background: brand.cardBg,
                backdropFilter: "blur(10px)",
                borderColor: brand.border,
              }}
            >
              {/* Slug badge */}
              <div className="flex-shrink-0">
                <div
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2"
                  style={{
                    background: `${brand.accent}18`,
                    border: `1px solid ${brand.accent}40`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: brand.accent,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {brand.slug}
                  </span>
                </div>
                <p
                  className="mt-2 text-center"
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: "0.7rem",
                    color: `${brand.accent}80`,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {brand.domain}
                </p>
              </div>

              <div>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: FONTS.heading,
                    fontWeight: 700,
                    fontSize: "clamp(1.125rem, 3vw, 1.375rem)",
                    color: brand.accent,
                  }}
                >
                  {brand.name}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.72)",
                    lineHeight: 1.65,
                  }}
                >
                  {brand.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Direct services note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 rounded-2xl p-6 border border-white/8"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p
            className="text-[#D8D7DB]/80 leading-relaxed"
            style={{
              fontFamily: FONTS.body,
              fontSize: "0.9375rem",
              lineHeight: 1.65,
            }}
          >
            <span
              style={{
                color: COLORS.gold,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              BOC Direct -{" "}
            </span>
            Graphic design, web development, merchandise, and brand identity
            services are delivered directly under the Based on Creativity
            banner, working alongside clients without intermediary structure.
          </p>
        </motion.div>

        <GoldRule className="mt-16" />
      </div>
    </section>
  );
}

// ─── Section: Founder / Leadership ──────────────────────────────────────────

function LeadershipBlock() {
  return (
    <section className="px-4 md:px-12 lg:px-20 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <EyebrowLabel>Leadership</EyebrowLabel>
          <h2
            className="text-white"
            style={{
              fontFamily: FONTS.heading,
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            The Creative Direction
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-14 items-start"
        >
          {/* Portrait */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div
              className="w-48 h-56 md:w-full md:h-72 rounded-2xl overflow-hidden border"
              style={{
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                borderColor: `${COLORS.gold}33`,
              }}
            >
              <ImageWithFallback
                src="https://res.cloudinary.com/basecreator/image/upload/v1774631625/Founder_Pic_sptbms.png"
                alt="BOC Founder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <p
                className="text-white"
                style={{
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                Founder &amp; Creative Director
              </p>

              <p
                className="text-white"
                style={{
                  fontFamily: FONTS.heading,
                  fontWeight: 200,
                  fontSize: "1rem",
                }}
              >
                Clinton Omamohwo
              </p>
              <p
                className="uppercase tracking-[0.2em] mt-1"
                style={{
                  fontFamily: FONTS.body,
                  fontSize: "0.7rem",
                  color: COLORS.gold,
                  opacity: 0.6,
                }}
              >
                Based on Creativity
              </p>
            </div>
          </div>

          {/* Statement */}
          <div className="flex flex-col justify-center">
            <p
              className="text-[#F6E6B4] italic leading-relaxed mb-8"
              style={{
                fontFamily: FONTS.accent,
                fontSize: "clamp(1.25rem, 3.5vw, 1.625rem)",
                lineHeight: 1.55,
              }}
            >
              "I started Based on Creativity because I believed that great
              stories, the kind that cross cultures, disarm strangers, and make
              the world feel smaller, don't need a massive corporation to tell
              them. They need intention. Craft. And the courage to go quiet
              before going loud."
            </p>

            <div className="space-y-5">
              {[
                {
                  label: "Creative vision",
                  body: "BOC exists to prove that independent creative companies can produce work that competes with - and often surpasses - the output of larger institutions.",
                },
                {
                  label: "On collaboration",
                  body: "Every project is a relationship. We take our time choosing the work we do and the people we do it with - because that care shows up on the page, the screen, and the platform.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border-l-2 pl-5"
                  style={{ borderColor: `${COLORS.gold}66` }}
                >
                  <p
                    className="uppercase tracking-[0.15em] mb-1"
                    style={{
                      fontFamily: FONTS.heading,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: COLORS.gold,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[#D8D7DB] leading-relaxed"
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: "0.9375rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <GoldRule className="mt-16" />
      </div>
    </section>
  );
}

// ─── Section: Working Philosophy ─────────────────────────────────────────────

const PRINCIPLES = [
  {
    number: "01",
    title: "Quiet before loud.",
    body: "Every project begins with listening - to the brief, the context, and the space between what's said and what's meant. We don't rush to production; we earn the right to begin.",
  },
  {
    number: "02",
    title: "Craft as a non-negotiable.",
    body: "We believe the quality of what you make reflects the quality of your attention. Every deliverable - from a brand mark to a web platform - carries the same standard of finish.",
  },
  {
    number: "03",
    title: "Long relationships over quick transactions.",
    body: "Our best work has come from ongoing trust, not one-off engagements. We are selective with the projects we take on because we invest deeply in each one.",
  },
  {
    number: "04",
    title: "Stories that travel.",
    body: "The work we make is built to cross borders - culturally, aesthetically, and emotionally. Universality is not a style choice; it's a guiding principle.",
  },
];

function WorkingPhilosophy() {
  return (
    <section className="px-4 md:px-12 lg:px-20 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <EyebrowLabel>How We Work</EyebrowLabel>
          <h2
            className="text-white mb-6"
            style={{
              fontFamily: FONTS.heading,
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Working Philosophy
          </h2>
          <p
            className="text-[#D8D7DB] max-w-2xl leading-relaxed"
            style={{
              fontFamily: FONTS.body,
              fontSize: "1.0625rem",
              lineHeight: 1.65,
            }}
          >
            BOC collaborates with clients across Canada and internationally - in
            animation, editorial, graphic design, web development, merchandise,
            and digital platform work. Here is how we approach that work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.08 }}
              className="rounded-2xl p-7 border transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <p
                className="mb-4"
                style={{
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: COLORS.gold,
                  opacity: 0.4,
                }}
              >
                {p.number}
              </p>
              <h3
                className="text-white mb-3"
                style={{
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.01em",
                }}
              >
                {p.title}
              </h3>
              <p
                className="text-[#D8D7DB]/80 leading-relaxed"
                style={{
                  fontFamily: FONTS.body,
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

        <GoldRule className="mt-16" />
      </div>
    </section>
  );
}

// ─── Section: Closing Quote + CTA ────────────────────────────────────────────

function ClosingCTA() {
  const navigate = useNavigate();
  return (
    <section className="px-4 md:px-12 lg:px-20 pb-20 md:pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-4 md:px-16"
        >
          <p
            className="uppercase tracking-[0.25em] mb-6"
            style={{
              fontFamily: FONTS.body,
              fontSize: "0.7rem",
              color: COLORS.gold,
              opacity: 0.5,
            }}
          >
            Our Foundation
          </p>
          <blockquote
            className="italic leading-relaxed mb-6"
            style={{
              fontFamily: FONTS.accent,
              fontSize: "clamp(1.375rem, 5vw, 2.25rem)",
              lineHeight: 1.5,
              color: COLORS.gold,
            }}
          >
            "Because sometimes the most powerful stories are the ones that
            remind us we were never that different to begin with."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: COLORS.gold, opacity: 0.3 }} />
            <p
              className="tracking-[0.15em] uppercase"
              style={{
                fontFamily: FONTS.body,
                fontSize: "0.7rem",
                color: COLORS.gold,
              }}
            >
              Based on Creativity
            </p>
            <div className="h-px w-16" style={{ background: COLORS.gold, opacity: 0.3 }} />
          </div>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-3 rounded-lg px-8 py-4 transition-colors duration-200"
            style={{
              background: COLORS.gold,
              color: "#1A1F4B",
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.04em",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#C9972E";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                COLORS.gold;
            }}
          >
            View Our Services
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="flex items-center gap-3 rounded-lg px-8 py-4 transition-all duration-200"
            style={{
              background: "transparent",
              color: COLORS.gold,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.04em",
              border: `2px solid ${COLORS.gold}`,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = COLORS.gold;
              btn.style.color = "#1A1F4B";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "transparent";
              btn.style.color = COLORS.gold;
            }}
          >
            Start a Conversation
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Root Component ──────────────────────────────────────────────────────────

export function AboutPage() {
  const { scrollYProgress } = useScroll();

  const sunY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const moonY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const sunOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 1, 0.6, 0.2],
  );
  const moonOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.2, 0.6, 1, 0.3],
  );

  return (
    <>
      <SEO
        title="About | Based on Creativity"
        description="Learn about Based on Creativity, the studio philosophy, creative practice, and the perspective behind its design-led storytelling."
        path="/about"
      />
      <div
        className="relative overflow-hidden"
        style={{ background: "#1A1F4B" }}
      >
        {/* Background layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom right, #1A1F4B, #1e2452, #1A1F4B)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 20% 10%, rgba(255,200,87,0.10), transparent 55%)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 80% 90%, rgba(246,230,180,0.07), transparent 55%)' }}
          />
          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Page content */}
        <div className="relative" style={{ zIndex: 1 }}>
          <HeroBlock
            sunY={sunY}
            sunOpacity={sunOpacity}
            moonY={moonY}
            moonOpacity={moonOpacity}
          />
          <AtAGlance />
          <Philosophy />
          <FamilyOfBrands />
          <LeadershipBlock />
          <WorkingPhilosophy />
          <ClosingCTA />
        </div>
      </div>
    </>
  );
}
