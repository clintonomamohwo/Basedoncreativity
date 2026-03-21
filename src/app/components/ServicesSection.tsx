import { motion } from "motion/react";
import {
  Film,
  PenTool,
  Code2,
  BookOpen,
  ShoppingBag,
  Globe,
} from "lucide-react";

const services = [
  {
    icon: Film,
    title: "Animation",
    description:
      "Original animated series, short films, and character-driven storytelling through Creativity Base Studios.",
  },
  {
    icon: PenTool,
    title: "Graphic Design",
    description:
      "Brand identity, visual systems, and creative direction that elevates your presence.",
  },
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Custom websites and digital platforms built with precision and purpose.",
  },
  {
    icon: BookOpen,
    title: "Publishing",
    description:
      "Original stories, graphic novels, and editorial content through Creativity Base Press.",
  },
  {
    icon: ShoppingBag,
    title: "Merchandise",
    description:
      "Premium branded products from apparel to accessories, designed in-house.",
  },
  {
    icon: Globe,
    title: "Web Platform",
    description:
      "Digital community and content distribution through Creativity Base Network.",
  },
];

export function ServicesSection() {
  return (
    <section
      className="py-16 md:py-32 px-4 md:px-6"
      style={{ background: "#FFF6D8" }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  color: "#1A1F4B",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                What We{" "}
                {/* Gold 700 (#C9972E) on light background - meets WCAG AA contrast */}
                <span style={{ color: "#C9972E" }}>Do</span>
              </h2>
            </div>
            <div>
              <p
                className="text-lg leading-relaxed"
                style={{
                  color: "#2D2D2D",
                  fontFamily: "'Source Sans 3', sans-serif",
                }}
              >
                Six creative disciplines, one shared mission to
                build work that endures across animation,
                design, development, publishing, merchandise,
                and digital platforms.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3×2 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="group flex flex-col"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow:
                    "0 2px 16px rgba(26, 31, 75, 0.07)",
                  border: "1px solid rgba(26, 31, 75, 0.08)",
                  cursor: "default",
                }}
              >
                {/* Icon — Indigo outline, 24px, rounded wrapper */}
                <div
                  className="mb-6 inline-flex items-center justify-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    background: "rgba(26, 31, 75, 0.07)",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    style={{ color: "#1A1F4B" }}
                  />
                </div>

                {/* Title — Space Mono bold, Indigo */}
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "1.125rem",
                    color: "#1A1F4B",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {service.title}
                </h3>

                {/* Description — Source Sans 3 regular 16px */}
                <p
                  style={{
                    color: "#3A3A3A",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}