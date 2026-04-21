import { AnimatePresence, motion } from 'motion/react';
import { COLORS, EASE_STANDARD } from '../../lib/constants';


export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export interface SearchResult {
  title: string;
  description: string;
  section: string;
  anchor: string;
}

// ─── Navigation Data ──────────────────────────────────────────────────────────

/** Ordered list of labels shown in the nav bar. */
const NAV_LINKS = [
  "WORK",
  "SERVICES",
  "ABOUT",
  "STUDIO",
  "THE VAULT",
  "CONTACT",
] as const;

/** Maps each nav label to its corresponding route path. */
const NAV_ROUTES: Record<string, string> = {
  WORK: "/work",
  SERVICES: "/services",
  ABOUT: "/about",
  STUDIO: "/studio",
  "THE VAULT": "/vault",
  CONTACT: "/contact",
};

/** Returns true if the nav item's route matches the current pathname. */
function getIsNavActive(
  item: string,
  pathname: string,
): boolean {
  return NAV_ROUTES[item] === pathname;
}

// ─── Site Search Index ────────────────────────────────────────────────────────

/**
 * Static search index. Each entry represents a discoverable piece of content.
 * Extend this array as new pages and sections are added.
 */
const SITE_INDEX: SearchResult[] = [
  // Hero
  {
    title: "Where Vision Meets Mastery",
    description:
      "Award-Winning Creative Studio: extraordinary digital experiences.",
    section: "Hero",
    anchor: "#hero",
  },
  {
    title: "150+ Projects Delivered",
    description:
      "Over 150 successful projects completed for global clients.",
    section: "Hero",
    anchor: "#hero",
  },
  {
    title: "50+ Global Clients",
    description: "Trusted by more than 50 clients worldwide.",
    section: "Hero",
    anchor: "#hero",
  },
  {
    title: "25 Awards Won",
    description:
      "Recognised with 25 industry awards for design excellence.",
    section: "Hero",
    anchor: "#hero",
  },
  // Work / Portfolio
  {
    title: "Artisan Studio",
    description:
      "Brand Identity: A curated creative studio workspace.",
    section: "Work",
    anchor: "#work",
  },
  {
    title: "Modern Architecture",
    description:
      "Web Design: Interior and architectural digital experience.",
    section: "Work",
    anchor: "#work",
  },
  {
    title: "Abstract Installation",
    description:
      "Art Direction: Compelling visual installation narrative.",
    section: "Work",
    anchor: "#work",
  },
  {
    title: "Luxury Product",
    description:
      "Photography: High-end product visual storytelling.",
    section: "Work",
    anchor: "#work",
  },
  {
    title: "Brand Evolution",
    description:
      "Brand Strategy: Identity systems and brand growth.",
    section: "Work",
    anchor: "#work",
  },
  {
    title: "Editorial Excellence",
    description:
      "Publishing: Magazine layout and editorial design.",
    section: "Work",
    anchor: "#work",
  },
  // Services
  {
    title: "Brand Identity",
    description:
      "Crafting memorable visual identities that resonate and stand the test of time.",
    section: "Services",
    anchor: "#services",
  },
  {
    title: "Digital Experiences",
    description:
      "Building intuitive digital products combining aesthetic excellence with technical precision.",
    section: "Services",
    anchor: "#services",
  },
  {
    title: "Creative Direction",
    description:
      "Directing compelling visual narratives that captivate audiences and elevate brand storytelling.",
    section: "Services",
    anchor: "#services",
  },
  {
    title: "Strategy & Growth",
    description:
      "Data-driven strategies that transform creative vision into measurable business impact.",
    section: "Services",
    anchor: "#services",
  },
  // Testimonials
  {
    title: "Sarah Mitchell, CEO, Artisan Collective",
    description:
      '"Based on Creativity transformed our brand identity beyond our wildest expectations."',
    section: "Testimonials",
    anchor: "#testimonials",
  },
  {
    title: "James Chen, Founder, Modern Architecture Studio",
    description:
      '"They didn\'t just deliver a project; they delivered a masterpiece."',
    section: "Testimonials",
    anchor: "#testimonials",
  },
  {
    title: "Emily Rodriguez, Director of Marketing",
    description:
      '"The level of craftsmanship sets a new standard in the industry."',
    section: "Testimonials",
    anchor: "#testimonials",
  },
  // Contact / CTA
  {
    title: "Start a Project",
    description:
      "Ready to create something extraordinary? Let's talk.",
    section: "Contact",
    anchor: "#contact",
  },
  {
    title: "Get in Touch",
    description:
      "Reach out to Based on Creativity for your next project.",
    section: "Contact",
    anchor: "#contact",
  },
  // About
  {
    title: "About the Studio",
    description:
      "Based on Creativity, a luxury-tier creative studio driven by innovation and design mastery.",
    section: "About",
    anchor: "#about",
  },
];

/** Badge colour for each search result section label. */
export const SECTION_COLORS: Record<string, string> = {
  Hero: COLORS.gold,
  Work: COLORS.creamAccent,
  Services: COLORS.gold,
  Testimonials: "#D8D7DB",
  Contact: COLORS.gold,
  About: COLORS.creamAccent,
};

/**
 * Scores a single search result against the query.
 * Higher score = better match; title prefix matches score highest.
 */
function scoreResult(
  result: SearchResult,
  query: string,
): number {
  const q = query.toLowerCase();
  const title = result.title.toLowerCase();
  const desc = result.description.toLowerCase();
  const section = result.section.toLowerCase();

  let score = 0;
  if (title.startsWith(q)) score += 10;
  if (title.includes(q)) score += 6;
  if (section.includes(q)) score += 4;
  if (desc.includes(q)) score += 2;
  return score;
}

/** Returns up to 6 scored, sorted results for the given query string. */
export function searchSite(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return SITE_INDEX.map((item) => ({
    item,
    score: scoreResult(item, q),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ item }) => item);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * NavActiveIndicator
 * Renders the top-beam + spotlight glow that highlights the active nav item.
 * Extracted to avoid duplicating these animations in both desktop and mobile.
 */
export function NavActiveIndicator({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) {
  return (
    <>
      {/* Spotlight cone from the top edge */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            key={`spotlight-${id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "120%",
              height: "100%",
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 80% at 50% -10%, rgba(255,200,87,0.28) 0%, rgba(255,200,87,0.10) 45%, transparent 80%)",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Horizontal beam at the top edge */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            key={`beam-${id}`}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_STANDARD }}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              width: "80%",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, #FFC857, transparent)",
              boxShadow:
                "0 0 8px rgba(255,200,87,0.8), 0 0 16px rgba(255,200,87,0.4)",
              borderRadius: "999px",
              transformOrigin: "center",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Gold star particle emitted on mouse/touch movement over the nav bar. */
export function TrailingStar({ star }: { star: Star }) {
  // Alternate between two gold shades for visual variety
  const fill =
    star.id % 2 === 0 ? COLORS.gold : COLORS.creamAccent;
  return (
    <motion.svg
      key={star.id}
      initial={{ opacity: 1, scale: 1, rotate: star.rotation }}
      animate={{
        opacity: 0,
        scale: 0.2,
        rotate: star.rotation + 90,
        y: -16,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      width={star.size}
      height={star.size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: star.x - star.size / 2,
        top: star.y - star.size / 2,
        fill,
        filter: "drop-shadow(0 0 3px rgba(255,200,87,0.8))",
        pointerEvents: "none",
      }}
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </motion.svg>
  );
}
