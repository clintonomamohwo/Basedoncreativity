/**
 * Brand Design Tokens - Based on Creativity
 *
 * Single source of truth for colors, typography, animation, and shared
 * visual assets used across the entire application.
 *
 * Guidelines: Modern Heritage style - luxury, premium, accessible (WCAG 2.1 AA).
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const COLORS = {
  // Primary
  indigoBlue: '#1A1F4B',
  gold: '#FFC857',

  // Secondary
  navy700: '#2D3566',
  navy950: '#0F1530',
  goldDark: '#C9972E',
  cream: '#FFF6D8',
  creamAccent: '#F6E6B4',
  midBlue: '#233592',
  blueAccent: '#3761BE',
  charcoal: '#2D2D2D',
  darkAccent: '#414255',

  // Text
  textPrimary: '#111111',
  textSecondary: '#3A3A3A',
  textInverse: '#FFFFFF',
  textMuted: '#D1D5DB',
  textLightSecondary: '#E5E7EB',
} as const;

// ─── Font Stacks ─────────────────────────────────────────────────────────────

export const FONTS = {
  /** Space Mono - headings (H1-H4) */
  heading: "'Space Mono', monospace",
  /** Source Sans 3 - body, captions, paragraphs */
  body: "'Source Sans 3', sans-serif",
  /** Cormorant Garamond - accent / quotes / taglines. Min 18px. */
  accent: "'Cormorant Garamond', serif",
} as const;

// ─── Animation ───────────────────────────────────────────────────────────────

/**
 * Standard cubic-bezier easing used throughout the project.
 * Matches the "friendly curves of classic animation" brand philosophy.
 */
export const EASE_STANDARD = [0.22, 1, 0.36, 1] as const;

// ─── Shared Visual Assets ────────────────────────────────────────────────────

/**
 * URL-encoded inline SVG for the grain / film-noise overlay texture.
 * Used in hero sections, coming-soon pages, and dark backgrounds.
 * Set as `backgroundImage` style value.
 */
export const NOISE_SVG_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

/**
 * URL-encoded inline SVG for grain overlay pattern (variant).
 * Optimized for finer grain effect on dark backgrounds.
 */
export const GRAIN_SVG_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ─── Contact Information ─────────────────────────────────────────────────────

export const CONTACT = {
  email: 'contact@bochq.com',
  phone: '647-847-9084',
  phoneFormatted: '+1 647-847-9084',
  phoneHref: 'tel:+16478479084',
  location: 'Toronto, Canada',
  responseTime: 'Within 2-3 days',
  availability: 'Clients Worldwide',
  formEndpoint: 'https://formsubmit.co/ajax/72a9e6f21908d30c38d2df816446e0e4',
} as const;

// ─── Social Media Links ──────────────────────────────────────────────────────

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/basedoncreativity',
  twitter: 'https://twitter.com/basedoncreativity',
  linkedin: 'https://www.linkedin.com/company/based-on-creativity/',
  youtube: 'https://www.youtube.com/@basedoncreativity',
} as const;
