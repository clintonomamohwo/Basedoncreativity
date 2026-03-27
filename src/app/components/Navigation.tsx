/**
 * Navigation
 *
 * Fixed top navigation bar for Based on Creativity.
 *
 * Features:
 * - Trailing gold star particle effect on mouse/touch movement (nav only).
 * - Collapsible desktop menu that slides in from the left.
 * - Inline expanding search bar with live site-index lookup.
 * - Responsive mobile dropdown with staggered entry animations.
 * - Active page indicator: top beam + spotlight glow.
 */

import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search } from "lucide-react";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "react-router";
import logoImage from "../../assets/boc_logo.png";
import {
  COLORS,
  FONTS,
  EASE_STANDARD,
} from "../../lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

interface SearchResult {
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
      "\"They didn't just deliver a project; they delivered a masterpiece.\"",
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
const SECTION_COLORS: Record<string, string> = {
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
function searchSite(query: string): SearchResult[] {
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
function NavActiveIndicator({
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
function TrailingStar({ star }: { star: Star }) {
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    SearchResult[]
  >([]);
  const [stars, setStars] = useState<Star[]>([]);

  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  // Monotonically increasing ID for star particles — avoids key collisions
  const starCounterRef = useRef(0);
  // Last known star spawn position — throttles spawn rate on slow drags
  const lastStarPosRef = useRef({ x: 0, y: 0 });

  const navigate = useNavigate();
  const location = useLocation();

  // ── Star particle spawning ──────────────────────────────────────────────────

  /**
   * Spawns a fleeting gold star at the given viewport coordinates.
   * Guards against flooding by requiring ≥12px of movement between spawns.
   * Caps live stars at 20 to prevent DOM bloat.
   */
  const spawnStar = useCallback(
    (clientX: number, clientY: number) => {
      if (!navRef.current) return;

      const rect = navRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const dx = x - lastStarPosRef.current.x;
      const dy = y - lastStarPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 12) return;
      lastStarPosRef.current = { x, y };

      const newStar: Star = {
        id: starCounterRef.current++,
        x,
        y,
        size: Math.random() * 10 + 6,
        rotation: Math.random() * 360,
      };

      setStars((prev) => [...prev.slice(-20), newStar]);
      // Remove this star after its animation completes
      setTimeout(() => {
        setStars((prev) =>
          prev.filter((s) => s.id !== newStar.id),
        );
      }, 700);
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) =>
      spawnStar(e.clientX, e.clientY),
    [spawnStar],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const touch = e.touches[0];
      if (touch) spawnStar(touch.clientX, touch.clientY);
    },
    [spawnStar],
  );

  // ── Navigation ──────────────────────────────────────────────────────────────

  /** Closes all overlays and navigates to the route for the given nav label. */
  const handleNavClick = useCallback(
    (item: string) => {
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      navigate(NAV_ROUTES[item]);
    },
    [navigate],
  );

  // ── Search ──────────────────────────────────────────────────────────────────

  /** Scrolls to the anchor element from a search result. */
  const handleSearchResultClick = (anchor: string) => {
    setIsSearchOpen(false);
    document
      .querySelector(anchor)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Re-run search whenever the query changes
  useEffect(() => {
    setSearchResults(searchSite(searchQuery));
  }, [searchQuery]);

  // Auto-focus the input when search opens; clear state when it closes
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 350);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Close search when clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [isSearchOpen]);

  // Close search on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu when clicking anywhere outside the nav
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 overflow-visible"
      style={{
        background: COLORS.indigoBlue,
        borderBottom: `2px solid ${COLORS.gold}`,
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* ── Trailing star particles ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {stars.map((star) => (
            <TrailingStar key={star.id} star={star} />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Main nav row ── */}
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-2">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo — navigates home on click */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer flex items-center gap-2 flex-shrink-0"
            style={{ zIndex: 10 }}
            onClick={() => navigate("/")}
          >
            <img
              src={logoImage}
              alt="Based on Creativity Logo"
              width={40}
              height={40}
              style={{
                borderRadius: "50%",
                display: "block",
                transition:
                  "box-shadow 0.3s ease, filter 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 12px 3px rgba(255, 200, 87, 0.56), 0 0 25px 6px rgba(255, 200, 87, 0.24)";
                e.currentTarget.style.filter =
                  "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.filter = "brightness(1)";
              }}
            />
          </motion.div>

          {/* ── Desktop expanded menu (hidden on mobile) ── */}
          <AnimatePresence>
            {isMenuOpen && !isSearchOpen && (
              <motion.div
                key="desktop-menu"
                initial={{
                  opacity: 0,
                  clipPath: "inset(0 100% 0 0)",
                }}
                animate={{
                  opacity: 1,
                  clipPath: "inset(0 0% 0 0)",
                }}
                exit={{
                  opacity: 0,
                  clipPath: "inset(0 100% 0 0)",
                }}
                transition={{
                  duration: 0.45,
                  ease: EASE_STANDARD,
                }}
                className="hidden md:flex items-center gap-0 flex-1"
                style={{ overflow: "hidden" }}
              >
                {NAV_LINKS.map((item, i) => {
                  const isActive = getIsNavActive(
                    item,
                    location.pathname,
                  );
                  return (
                    <motion.button
                      key={item}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.06 + i * 0.055,
                        ease: EASE_STANDARD,
                      }}
                      whileHover={{
                        textShadow:
                          "0 0 8px rgba(255,200,87,0.9), 0 0 20px rgba(255,200,87,0.5), 0 0 40px rgba(255,200,87,0.25)",
                        color: "#FFD88A",
                      }}
                      className="group relative flex-1 flex items-center justify-center py-3"
                      style={{
                        fontFamily: FONTS.heading,
                        fontWeight: 700,
                        color: isActive
                          ? "#FFE499"
                          : COLORS.gold,
                        fontSize: "0.8125rem",
                        letterSpacing: "0.12em",
                        transition:
                          "text-shadow 0.3s ease, color 0.3s ease",
                        position: "relative",
                        overflow: "visible",
                        background: "transparent",
                        border: "none",
                        borderRight:
                          i < NAV_LINKS.length - 1
                            ? "1px solid rgba(255,200,87,0.2)"
                            : "none",
                        cursor: "pointer",
                      }}
                    >
                      <NavActiveIndicator
                        isActive={isActive}
                        id={`desktop-${item}`}
                      />
                      <span
                        style={{
                          position: "relative",
                          zIndex: 2,
                          textShadow: isActive
                            ? "0 0 10px #FFC857, 0 0 24px rgba(255,200,87,0.6), 0 0 48px rgba(255,200,87,0.3)"
                            : "none",
                        }}
                      >
                        {item}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Right controls: search + menu toggle ── */}
          <div
            className="flex items-center gap-4 flex-shrink-0 ml-auto"
            ref={searchContainerRef}
          >
            {/* Expanding inline search bar */}
            <div className="relative flex items-center">
              <motion.div
                initial={false}
                animate={{
                  width: isSearchOpen ? 260 : 0,
                  opacity: isSearchOpen ? 1 : 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: EASE_STANDARD,
                }}
                style={{
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: 260,
                    background: "rgba(255,200,87,0.08)",
                    border: "1px solid rgba(255,200,87,0.35)",
                    borderRadius: "999px",
                    paddingLeft: "16px",
                    paddingRight: "12px",
                    height: "36px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Search the site…"
                    aria-label="Search the site"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: COLORS.gold,
                      fontFamily: FONTS.body,
                      fontSize: "0.8125rem",
                      letterSpacing: "0.04em",
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(255,200,87,0.5)",
                        padding: "0 2px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Search icon toggle */}
              <motion.button
                type="button"
                onClick={() => {
                  setIsSearchOpen((prev) => !prev);
                  if (isMenuOpen) setIsMenuOpen(false);
                }}
                whileTap={{ scale: 0.9 }}
                whileHover={{
                  filter:
                    "drop-shadow(0 0 6px rgba(255,200,87,0.8))",
                  color: "#FFD88A",
                }}
                transition={{ duration: 0.15 }}
                aria-label={
                  isSearchOpen ? "Close search" : "Open search"
                }
                style={{
                  color: isSearchOpen ? "#FFD88A" : COLORS.gold,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  filter: isSearchOpen
                    ? "drop-shadow(0 0 6px rgba(255,200,87,0.7))"
                    : "none",
                }}
              >
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.span
                      key="close-search"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open-search"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Search size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Search results dropdown */}
              <AnimatePresence>
                {isSearchOpen && searchQuery.trim() && (
                  <motion.div
                    key="search-results"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{
                      duration: 0.25,
                      ease: EASE_STANDARD,
                    }}
                    role="listbox"
                    aria-label="Search results"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 14px)",
                      right: 0,
                      width: 340,
                      background: "rgba(20, 24, 60, 0.97)",
                      border: "1px solid rgba(255,200,87,0.25)",
                      borderRadius: "16px",
                      backdropFilter: "blur(24px)",
                      boxShadow:
                        "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,200,87,0.08)",
                      overflow: "hidden",
                      zIndex: 200,
                    }}
                  >
                    {searchResults.length === 0 ? (
                      <div
                        style={{
                          padding: "20px",
                          color: "rgba(255,200,87,0.4)",
                          fontFamily: FONTS.body,
                          fontSize: "0.875rem",
                          textAlign: "center",
                        }}
                      >
                        No results for "{searchQuery}"
                      </div>
                    ) : (
                      <>
                        {/* Result count header */}
                        <div
                          style={{
                            padding: "10px 16px 6px",
                            fontFamily: FONTS.heading,
                            fontSize: "0.625rem",
                            letterSpacing: "0.14em",
                            color: "rgba(255,200,87,0.4)",
                            borderBottom:
                              "1px solid rgba(255,200,87,0.08)",
                          }}
                        >
                          {searchResults.length} RESULT
                          {searchResults.length !== 1
                            ? "S"
                            : ""}
                        </div>

                        {searchResults.map((result, i) => {
                          const badgeColor =
                            SECTION_COLORS[result.section] ??
                            COLORS.gold;
                          return (
                            <motion.button
                              key={i}
                              type="button"
                              role="option"
                              onClick={() =>
                                handleSearchResultClick(
                                  result.anchor,
                                )
                              }
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: i * 0.04,
                                duration: 0.2,
                              }}
                              whileHover={{
                                background:
                                  "rgba(255,200,87,0.07)",
                              }}
                              style={{
                                width: "100%",
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "12px",
                                background: "transparent",
                                border: "none",
                                borderBottom:
                                  i < searchResults.length - 1
                                    ? "1px solid rgba(255,200,87,0.06)"
                                    : "none",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            >
                              {/* Section badge */}
                              <span
                                style={{
                                  flexShrink: 0,
                                  marginTop: "2px",
                                  padding: "2px 8px",
                                  borderRadius: "999px",
                                  background: `${badgeColor}18`,
                                  border: `1px solid ${badgeColor}40`,
                                  color: badgeColor,
                                  fontFamily: FONTS.heading,
                                  fontSize: "0.55rem",
                                  letterSpacing: "0.1em",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {result.section.toUpperCase()}
                              </span>

                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontFamily: FONTS.body,
                                    fontWeight: 700,
                                    fontSize: "0.875rem",
                                    color: COLORS.gold,
                                    marginBottom: "3px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {result.title}
                                </div>
                                <div
                                  style={{
                                    fontFamily: FONTS.body,
                                    fontSize: "0.75rem",
                                    color:
                                      "rgba(255,255,255,0.45)",
                                    lineHeight: 1.4,
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {result.description}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu toggle button */}
            <motion.button
              type="button"
              onClick={() => {
                setIsMenuOpen((prev) => !prev);
                if (isSearchOpen) setIsSearchOpen(false);
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex items-center flex-shrink-0"
              aria-label={
                isMenuOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={isMenuOpen}
              style={{
                color: COLORS.gold,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.span
                    key="close-menu"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open-menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu (visible only on small screens) ── */}
      <AnimatePresence>
        {isMenuOpen && !isSearchOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE_STANDARD }}
            className="md:hidden"
            style={{
              overflow: "hidden",
              borderTop: "1px solid rgba(255,200,87,0.15)",
              background: COLORS.indigoBlue,
            }}
          >
            {NAV_LINKS.map((item, i) => {
              const isActive = getIsNavActive(
                item,
                location.pathname,
              );
              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.045,
                    duration: 0.25,
                    ease: EASE_STANDARD,
                  }}
                  style={{
                    borderBottom:
                      "1px solid rgba(255,200,87,0.08)",
                    background: isActive
                      ? "rgba(255,200,87,0.06)"
                      : "transparent",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    style={{
                      width: "100%",
                      padding: "16px 24px",
                      textAlign: "left",
                      fontFamily: FONTS.heading,
                      fontWeight: 700,
                      color: isActive ? "#FFE499" : COLORS.gold,
                      fontSize: "0.9375rem",
                      letterSpacing: "0.1em",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textShadow: isActive
                        ? "0 0 10px #FFC857, 0 0 24px rgba(255,200,87,0.6)"
                        : "none",
                    }}
                  >
                    {item}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}