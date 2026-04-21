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

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, Search } from "lucide-react";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "react-router";
import logoImagePng from "../../assets/boc_logo.png";
import logoImageWebp from "../../assets/boc_logo.webp";
import {
  COLORS,
  FONTS,
  EASE_STANDARD,
} from "../../lib/constants";
import { NavActiveIndicator, SECTION_COLORS, TrailingStar, searchSite, NAV_LINKS, NAV_ROUTES, getIsNavActive } from './NavigationSections';
import type { SearchResult, Star } from './NavigationSections';

const INTRO_BURST_STORAGE_KEY = "boc-nav-first-visit-sparkle-burst-seen";
const MAX_VISIBLE_STARS = 36;

function getStarLifetime(star: Star) {
  const duration =
    star.duration ??
    (star.variant === "burst"
      ? 1.15
      : star.variant === "transition"
        ? 0.85
        : 0.7);

  return Math.ceil(((star.delay ?? 0) + duration + 0.1) * 1000);
}

// ─── Types ────────────────────────────────────────────────────────────────────

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
  const starRemovalTimersRef = useRef<number[]>([]);
  const introBurstTimerRef = useRef<number | null>(null);

  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Star particle spawning ──────────────────────────────────────────────────

  const queueStar = useCallback((star: Star) => {
    setStars((prev) => [...prev.slice(-(MAX_VISIBLE_STARS - 1)), star]);

    const removalTimer = window.setTimeout(() => {
      setStars((prev) => prev.filter((item) => item.id !== star.id));
      starRemovalTimersRef.current = starRemovalTimersRef.current.filter(
        (timerId) => timerId !== removalTimer,
      );
    }, getStarLifetime(star));

    starRemovalTimersRef.current.push(removalTimer);
  }, []);

  /**
   * Spawns a fleeting gold star at the given viewport coordinates.
   * Guards against flooding by requiring ≥12px of movement between spawns.
   */
  const spawnStar = useCallback(
    (clientX: number, clientY: number) => {
      if (reduceMotion || !navRef.current) return;

      const rect = navRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const dx = x - lastStarPosRef.current.x;
      const dy = y - lastStarPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 12) return;
      lastStarPosRef.current = { x, y };

      queueStar({
        id: starCounterRef.current++,
        x,
        y,
        size: Math.random() * 10 + 6,
        rotation: Math.random() * 360,
        variant: "trail",
      });
    },
    [queueStar, reduceMotion],
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
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [isMenuOpen]);

  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(INTRO_BURST_STORAGE_KEY)) return;

    window.localStorage.setItem(INTRO_BURST_STORAGE_KEY, "true");

    introBurstTimerRef.current = window.setTimeout(() => {
      if (!navRef.current) return;

      const rect = navRef.current.getBoundingClientRect();
      const horizontalInset = Math.min(88, Math.max(44, rect.width * 0.08));
      const usableWidth = Math.max(rect.width - horizontalInset * 2, 120);
      const rowPattern = [0.34, 0.54, 0.72] as const;
      const burstCount = 18;

      Array.from({ length: burstCount }).forEach((_, index) => {
        const progress = index / Math.max(burstCount - 1, 1);
        const row = rowPattern[index % rowPattern.length];

        queueStar({
          id: starCounterRef.current++,
          x:
            horizontalInset +
            usableWidth * progress +
            Math.sin(index * 0.9) * 14,
          y:
            rect.height * row +
            (index % 2 === 0 ? -4 : 4),
          size: 15 + (index % 4) * 2.5 + Math.random() * 2,
          rotation: Math.random() * 360,
          variant: "burst",
          delay: progress * 1.55 + (index % 3) * 0.08,
          duration: 0.95 + (index % 5) * 0.07,
          driftX:
            (index % 2 === 0 ? 24 : -18) + Math.sin(index * 1.3) * 10,
          driftY: -12 - (index % 3) * 8,
        });
      });
    }, 320);

    return () => {
      if (introBurstTimerRef.current !== null) {
        window.clearTimeout(introBurstTimerRef.current);
        introBurstTimerRef.current = null;
      }
    };
  }, [queueStar, reduceMotion]);

  useEffect(() => {
    return () => {
      if (introBurstTimerRef.current !== null) {
        window.clearTimeout(introBurstTimerRef.current);
      }

      starRemovalTimersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      starRemovalTimersRef.current = [];
    };
  }, []);

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
            <picture>
              <source srcSet={logoImageWebp} type="image/webp" />
              <img
                src={logoImagePng}
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
            </picture>
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
                        color: "#D4A853",
                        textShadow:
                          "0 0 10px rgba(212,168,83,0.22)",
                      }}
                      className="group relative flex-1 flex items-center justify-center py-3"
                      style={{
                        fontFamily: FONTS.heading,
                        fontWeight: 700,
                        color: isActive ? "#D4A853" : "#FAF3E0",
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
                            ? "1px solid rgba(212,168,83,0.22)"
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
                            ? "0 0 10px rgba(212,168,83,0.45), 0 0 24px rgba(212,168,83,0.22)"
                            : "none",
                        }}
                      >
                        {item}
                      </span>

                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{
                          scaleX: isActive ? 1 : 0,
                          opacity: isActive ? 1 : 0.9,
                        }}
                        whileHover={{
                          scaleX: 1,
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.28,
                          ease: EASE_STANDARD,
                        }}
                        style={{
                          position: "absolute",
                          left: "22%",
                          right: "22%",
                          bottom: "10px",
                          height: "1.5px",
                          background:
                            "linear-gradient(90deg, transparent, #D4A853 18%, #D4A853 82%, transparent)",
                          transformOrigin: "center",
                          borderRadius: "999px",
                          boxShadow:
                            "0 0 10px rgba(212,168,83,0.28)",
                          zIndex: 1,
                          pointerEvents: "none",
                        }}
                      />
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
                      color: isActive ? "#D4A853" : "#FAF3E0",
                      fontSize: "0.9375rem",
                      letterSpacing: "0.1em",
                      background: "transparent",
                      border: "none",
                      borderBottom: isActive
                        ? "1px solid rgba(212,168,83,0.75)"
                        : "1px solid transparent",
                      cursor: "pointer",
                      transition:
                        "color 0.3s ease, border-color 0.3s ease, text-shadow 0.3s ease",
                      textShadow: isActive
                        ? "0 0 10px rgba(212,168,83,0.38)"
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
