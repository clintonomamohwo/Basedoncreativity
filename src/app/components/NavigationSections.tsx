import { AnimatePresence, motion } from 'motion/react';
import { COLORS, EASE_STANDARD } from '../../lib/constants';


export type StarVariant = "trail" | "burst" | "transition";

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  variant?: StarVariant;
  delay?: number;
  duration?: number;
  driftX?: number;
  driftY?: number;
}

export interface SearchResult {
  title: string;
  description: string;
  section: string;
  path: string;
}

// ─── Navigation Data ──────────────────────────────────────────────────────────

/** Ordered list of the compact, top-level navigation items. */
export const NAV_LINKS = ["WORK", "SERVICES", "EXPLORE", "CONTACT", "BOOK A CALL"] as const;

/** Destinations revealed by Explore, in editorial priority order. */
export const EXPLORE_LINKS = [
  { label: "About", path: "/about" },
  { label: "Studio", path: "/studio" },
  { label: "The Vault", path: "/vault" },
  { label: "Library", path: "/library" },
] as const;

/** Maps each nav label to its corresponding route path. */
export const NAV_ROUTES: Record<string, string> = {
  WORK: "/work",
  SERVICES: "/services",
  ABOUT: "/about",
  STUDIO: "/studio",
  "THE VAULT": "/vault",
  CONTACT: "/contact",
  "BOOK A CALL": "/contact",
};

/** Returns true if the nav item's route matches the current pathname. */
export function getIsNavActive(
  item: string,
  pathname: string,
): boolean {
  if (item === "EXPLORE") {
    return EXPLORE_LINKS.some((link) => link.path === pathname);
  }
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
    title: "Creative Studio",
    description:
      "Based on Creativity is a Toronto-based studio working across identity, web, animation, publishing, and merchandise.",
    section: "Hero",
    path: "/",
  },
  // Work / Portfolio
  {
    title: "BOC Brand System Refresh",
    description:
      "BOC-owned identity refresh with editorial typography, motion-ready assets, and a visual system.",
    section: "Work",
    path: "/work/boc-brand-identity",
  },
  {
    title: "Creativity Base Web Platform",
    description:
      "BOC-owned editorial web experience for the Creativity Base ecosystem.",
    section: "Work",
    path: "/work/bochq-website",
  },
  {
    title: "First Animated Series · In Development",
    description:
      "BOC-owned animated series project in development.",
    section: "Work",
    path: "/work/first-animated-series",
  },
  {
    title: "Motion Merch Capsule · Concept",
    description:
      "BOC-owned merchandise concept with product visuals and campaign assets.",
    section: "Work",
    path: "/work/motion-merch-capsule",
  },
  {
    title: "First Publication · In Development",
    description:
      "BOC-owned illustrated publication project in development.",
    section: "Work",
    path: "/work/first-publication",
  },
  {
    title: "View BOC Work",
    description:
      "Browse BOC-owned work, concepts, and projects in development.",
    section: "Work",
    path: "/work",
  },
  // Services
  {
    title: "Brand Identity",
    description:
      "Crafting memorable visual identities that resonate and stand the test of time.",
    section: "Services",
    path: "/services",
  },
  {
    title: "Digital Experiences",
    description:
      "Building intuitive digital products combining aesthetic excellence with technical precision.",
    section: "Services",
    path: "/services",
  },
  {
    title: "Creative Direction",
    description:
      "Directing compelling visual narratives that captivate audiences and elevate brand storytelling.",
    section: "Services",
    path: "/services",
  },
  {
    title: "Publishing & Editorial",
    description:
      "Book, editorial, illustrated, and digital-first publication design and production.",
    section: "Services",
    path: "/services",
  },
  // Contact / CTA
  {
    title: "Start a Project",
    description:
      "Ready to create something extraordinary? Let's talk.",
    section: "Contact",
    path: "/contact",
  },
  {
    title: "Get in Touch",
    description:
      "Reach out to Based on Creativity for your next project.",
    section: "Contact",
    path: "/contact",
  },
  // About
  {
    title: "About the Studio",
    description:
      "Learn about Based on Creativity, its studio divisions, creative practice, and approach to design-led storytelling.",
    section: "About",
    path: "/about",
  },
];

/** Badge colour for each search result section label. */
export const SECTION_COLORS: Record<string, string> = {
  Hero: COLORS.gold,
  Work: COLORS.creamAccent,
  Services: COLORS.gold,
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
  const variant = star.variant ?? "trail";
  const isBurst = variant === "burst";
  const isTransition = variant === "transition";

  // Alternate between two gold shades for visual variety
  const fill =
    star.id % 2 === 0 ? COLORS.gold : COLORS.creamAccent;

  const animate = isBurst
    ? {
        opacity: [0, 1, 0.95, 0],
        scale: [0.35, 1.4, 0.8, 0.15],
        rotate: star.rotation + 180,
        x: star.driftX ?? 0,
        y: star.driftY ?? -22,
      }
    : isTransition
      ? {
          opacity: [0, 1, 0.75, 0],
          scale: [0.25, 1.05, 0.65, 0.12],
          rotate: star.rotation + 135,
          x: star.driftX ?? 46,
          y: star.driftY ?? -10,
        }
      : {
          opacity: 0,
          scale: 0.2,
          rotate: star.rotation + 90,
          x: 0,
          y: -16,
        };

  const transition = isBurst || isTransition
    ? {
        duration: star.duration ?? (isBurst ? 1.15 : 0.85),
        delay: star.delay ?? 0,
        ease: "easeOut" as const,
        times: [0, 0.18, 0.72, 1],
      }
    : {
        duration: star.duration ?? 0.7,
        delay: star.delay ?? 0,
        ease: "easeOut" as const,
      };

  const glowFilter = isBurst
    ? "drop-shadow(0 0 8px rgba(255,200,87,0.95)) drop-shadow(0 0 18px rgba(255,200,87,0.55))"
    : isTransition
      ? "drop-shadow(0 0 5px rgba(255,200,87,0.9)) drop-shadow(0 0 12px rgba(255,200,87,0.32))"
      : "drop-shadow(0 0 3px rgba(255,200,87,0.8))";

  return (
    <motion.svg
      key={star.id}
      initial={{
        opacity: isBurst || isTransition ? 0 : 1,
        scale: isBurst ? 0.35 : isTransition ? 0.25 : 1,
        rotate: star.rotation,
      }}
      animate={animate}
      exit={{ opacity: 0 }}
      transition={transition}
      width={star.size}
      height={star.size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: star.x - star.size / 2,
        top: star.y - star.size / 2,
        fill,
        filter: glowFilter,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </motion.svg>
  );
}
