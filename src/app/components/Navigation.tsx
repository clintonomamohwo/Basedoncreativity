/**
 * Navigation
 *
 * Fixed top navigation bar for Based on Creativity.
 *
 * Features:
 * - Trailing gold star particle effect on mouse/touch movement (nav only).
 * - Compact desktop links with an Explore disclosure.
 * - Inline expanding search bar with live site-index lookup.
 * - Responsive mobile menu with a tap-friendly Explore accordion.
 * - Active page indicator: top beam + spotlight glow.
 */

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  COLORS,
  FONTS,
  EASE_STANDARD,
} from "../../lib/constants";
import { SECTION_COLORS, TrailingStar, searchSite, EXPLORE_LINKS, NAV_ROUTES, getIsNavActive } from './NavigationSections';
import type { SearchResult, Star } from './NavigationSections';
import logoImage from "../../assets/boc_logo.png";
import { handleLinkHover } from '../../lib/prefetch';

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
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    SearchResult[]
  >([]);
  const [stars, setStars] = useState<Star[]>([]);

  const navRef = useRef<HTMLElement>(null);
  const exploreMenuRef = useRef<HTMLDivElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const mobileExploreButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  // Monotonically increasing ID for star particles - avoids key collisions
  const starCounterRef = useRef(0);
  // Last known star spawn position - throttles spawn rate on slow drags
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

  // ── Search ──────────────────────────────────────────────────────────────────

  /** Navigates to the page that contains a search result. */
  const handleSearchResultClick = (path: string) => {
    setIsSearchOpen(false);
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(path);
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

  // Close open navigation disclosures on Escape and return focus to their trigger.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsSearchOpen(false);
      if (isExploreOpen) {
        setIsExploreOpen(false);
        (isMenuOpen ? mobileExploreButtonRef.current : exploreButtonRef.current)?.focus();
      } else if (isMenuOpen) {
        setIsMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [isExploreOpen, isMenuOpen]);

  // Close mobile menu when clicking anywhere outside the nav
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
        setIsExploreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [isMenuOpen]);

  // Close the desktop Explore panel when focus/click moves outside its disclosure.
  useEffect(() => {
    if (!isExploreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (
        exploreMenuRef.current?.contains(e.target as Node) ||
        target?.closest("#mobile-explore-trigger, #mobile-explore-menu")
      ) {
        return;
      }
      setIsExploreOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExploreOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsExploreOpen(false);
  }, [location.pathname]);

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
      <div className="relative max-w-[1380px] mx-auto px-4 md:px-8 xl:px-0 py-2">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo - navigates home on click or keyboard activation */}
          <Link
            to="/"
            aria-label="Based on Creativity home"
            className="boc-nav-control cursor-pointer flex items-center gap-2 flex-shrink-0"
            style={{ zIndex: 10, textDecoration: "none" }}
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
          </Link>

          {/* ── Compact desktop navigation ── */}
          <div
            className="hidden md:flex flex-1 self-stretch items-center justify-end gap-1 xl:gap-2"
            role="group"
            aria-label="Primary navigation"
          >
            {(["WORK", "SERVICES"] as const).map((item) => (
              <Link
                key={item}
                to={NAV_ROUTES[item]}
                onMouseEnter={() => handleLinkHover(NAV_ROUTES[item])}
                onClick={() => setIsExploreOpen(false)}
                aria-current={getIsNavActive(item, location.pathname) ? "page" : undefined}
                className="boc-nav-control"
                style={{
                  padding: "10px 11px",
                  color: getIsNavActive(item, location.pathname) ? COLORS.gold : "#FAF3E0",
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: "0.67rem",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </Link>
            ))}

            <div
              ref={exploreMenuRef}
              className="relative self-stretch flex items-center"
              onBlurCapture={(event) => {
                const nextTarget = event.relatedTarget;
                if (
                  nextTarget instanceof Node &&
                  exploreMenuRef.current?.contains(nextTarget)
                ) {
                  return;
                }
                setIsExploreOpen(false);
              }}
              onPointerLeave={() => setIsExploreOpen(false)}
            >
              <button
                ref={exploreButtonRef}
                type="button"
                onClick={() => setIsExploreOpen((open) => !open)}
                aria-expanded={isExploreOpen}
                aria-controls="desktop-explore-menu"
                className="boc-nav-control flex items-center gap-1"
                style={{
                  padding: "10px 11px",
                  color: getIsNavActive("EXPLORE", location.pathname) ? COLORS.gold : "#FAF3E0",
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: "0.67rem",
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                EXPLORE
                <ChevronDown
                  size={13}
                  aria-hidden="true"
                  style={{ transform: isExploreOpen ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }}
                />
              </button>
              {isExploreOpen && (
                <span
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    top: "100%",
                    left: "50%",
                    width: 132,
                    height: 10,
                    transform: "translateX(-50%)",
                    zIndex: 69,
                  }}
                />
              )}
              <AnimatePresence>
                {isExploreOpen && (
                  <motion.div
                    id="desktop-explore-menu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: EASE_STANDARD }}
                    role="group"
                    aria-label="Explore pages"
                    className="absolute z-[70] overflow-hidden"
                    style={{
                      top: "calc(100% + 10px)",
                      left: "50%",
                      width: 132,
                      transform: "translateX(-50%)",
                      background: COLORS.indigoBlue,
                      border: "1px solid rgba(255,200,87,0.38)",
                      borderTop: "none",
                      borderRadius: "0 0 8px 8px",
                      boxShadow: "0 14px 28px rgba(0,0,0,0.28)",
                    }}
                  >
                    {EXPLORE_LINKS.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsExploreOpen(false)}
                        onMouseEnter={() => handleLinkHover(link.path)}
                        aria-current={location.pathname === link.path ? "page" : undefined}
                        className="boc-explore-link"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          minHeight: 42,
                          padding: "10px 14px",
                          color: location.pathname === link.path ? COLORS.gold : "#FAF3E0",
                          fontFamily: FONTS.body,
                          fontSize: "0.9rem",
                          textDecoration: "none",
                          borderBottom: "1px solid rgba(255,200,87,0.1)",
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              onMouseEnter={() => handleLinkHover("/contact")}
              onClick={() => setIsExploreOpen(false)}
              aria-current={location.pathname === "/contact" ? "page" : undefined}
              className="boc-nav-control"
              style={{
                padding: "10px 11px",
                color: location.pathname === "/contact" ? COLORS.gold : "#FAF3E0",
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: "0.67rem",
                letterSpacing: "0.1em",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              CONTACT
            </Link>
          </div>

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
                  setIsExploreOpen(false);
                }}
                whileTap={{ scale: 0.9 }}
                whileHover={{
                  filter:
                    "drop-shadow(0 0 6px rgba(255,200,87,0.8))",
                  color: "#FFD88A",
                }}
                transition={{ duration: 0.15 }}
                className="boc-nav-control flex h-11 w-11 items-center justify-center"
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
                                  result.path,
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
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => {
                setIsMenuOpen((prev) => !prev);
                setIsExploreOpen(false);
                if (isSearchOpen) setIsSearchOpen(false);
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="boc-nav-control md:hidden flex h-11 w-11 items-center justify-center flex-shrink-0"
              aria-label={
                isMenuOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
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
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE_STANDARD }}
            className="md:hidden"
            role="group"
            aria-label="Primary navigation"
            style={{
              overflow: "hidden",
              borderTop: "1px solid rgba(255,200,87,0.15)",
              background: COLORS.indigoBlue,
            }}
          >
            {([
              { label: "Work", path: "/work" },
              { label: "Services", path: "/services" },
            ] as const).map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsExploreOpen(false);
                }}
                onMouseEnter={() => handleLinkHover(path)}
                aria-current={location.pathname === path ? "page" : undefined}
                className="boc-mobile-nav-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 54,
                  padding: "14px 24px",
                  color: location.pathname === path ? COLORS.gold : "#FAF3E0",
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,200,87,0.08)",
                }}
              >
                {label}
              </Link>
            ))}

            <div style={{ borderBottom: "1px solid rgba(255,200,87,0.08)" }}>
              <button
                ref={mobileExploreButtonRef}
                id="mobile-explore-trigger"
                type="button"
                onClick={() => setIsExploreOpen((open) => !open)}
                aria-expanded={isExploreOpen}
                aria-controls="mobile-explore-menu"
                className="boc-mobile-nav-link flex w-full items-center justify-between"
                style={{
                  minHeight: 54,
                  padding: "14px 24px",
                  color: getIsNavActive("EXPLORE", location.pathname) ? COLORS.gold : "#FAF3E0",
                  fontFamily: FONTS.heading,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.1em",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span>Explore</span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  style={{ transform: isExploreOpen ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }}
                />
              </button>
              <AnimatePresence initial={false}>
                {isExploreOpen && (
                  <motion.div
                    id="mobile-explore-menu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: EASE_STANDARD }}
                    aria-label="Explore pages"
                    style={{ overflow: "hidden", background: "rgba(9,13,39,0.56)" }}
                  >
                    {EXPLORE_LINKS.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsExploreOpen(false);
                        }}
                        onMouseEnter={() => handleLinkHover(link.path)}
                        aria-current={location.pathname === link.path ? "page" : undefined}
                        className="boc-mobile-explore-link"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          minHeight: 50,
                          padding: "13px 24px 13px 42px",
                          color: location.pathname === link.path ? COLORS.gold : "#FAF3E0",
                          fontFamily: FONTS.body,
                          fontSize: "1rem",
                          textDecoration: "none",
                          borderTop: "1px solid rgba(255,200,87,0.07)",
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              onClick={() => {
                setIsMenuOpen(false);
                setIsExploreOpen(false);
              }}
              onMouseEnter={() => handleLinkHover("/contact")}
              aria-current={location.pathname === "/contact" ? "page" : undefined}
              className="boc-mobile-nav-link"
              style={{
                display: "flex",
                alignItems: "center",
                minHeight: 54,
                padding: "14px 24px",
                color: location.pathname === "/contact" ? COLORS.gold : "#FAF3E0",
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,200,87,0.08)",
              }}
            >
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
