import type React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useRef, useEffect } from 'react';

export type LibraryMode    = 'reflection' | 'expression';
export type MediumFilter   = 'all' | 'animation' | 'writing' | 'design';
export type StatusFilter   = 'all' | 'active' | 'archived';

export interface LibraryItem {
  id: string;
  title: string;
  subtitle: string;
  medium: 'animation' | 'writing' | 'design';
  status: 'active' | 'archived';
  year: string;
  tools: string[];
  description: string;
  imageUrl: string;
  section: string;
  mode: LibraryMode;
}

function CompassIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={color} opacity="0.8"/>
      <circle cx="12" cy="12" r="1.5" fill={color}/>
    </svg>
  );
}

function QuillIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 3C20 3 14 5 12 12L10 20" />
      <path d="M12 12C10 10 7 10 4 12" />
      <path d="M10 20L9 21" />
      <path d="M20 3C18 5 16 5 14 7" />
    </svg>
  );
}

function LensIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <circle cx="11" cy="11" r="3" strokeDasharray="2 2"/>
    </svg>
  );
}

export function MoonSvg({ size = 22, active }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? '#D8D7DB' : 'none'}
      stroke={active ? '#D8D7DB' : 'rgba(216,215,219,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export function SunSvg({ size = 22, active }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? '#FFC857' : 'none'}
      stroke={active ? '#FFC857' : 'rgba(255,200,87,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode Toggle
// ─────────────────────────────────────────────────────────────────────────────
export function ModeToggle({ mode, onToggle }: { mode: LibraryMode; onToggle: () => void }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const isMoon = mode === 'reflection';
  return (
    <motion.button
      onClick={onToggle}
      className="relative flex items-center gap-0 rounded-full border overflow-hidden cursor-pointer"
      style={{
        background: isMoon
          ? 'linear-gradient(135deg, #0d1117 0%, #1A1F2E 100%)'
          : 'linear-gradient(135deg, #F6E6B4 0%, #FFF3CC 100%)',
        borderColor: isMoon ? 'rgba(216,215,219,0.25)' : 'rgba(255,200,87,0.5)',
        padding: '4px',
        gap: '0',
        width: 160,
        height: 44,
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Sliding pill indicator */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full"
        style={{
          background: isMoon
            ? 'linear-gradient(135deg, #1e2a4a 0%, #2d3561 100%)'
            : 'linear-gradient(135deg, #FFC857 0%, #FFD88A 100%)',
          boxShadow: isMoon
            ? '0 0 12px rgba(100,120,200,0.4)'
            : '0 0 12px rgba(255,200,87,0.6)',
          width: 'calc(50% - 2px)',
        }}
        animate={{ left: isMoon ? 4 : 'calc(50% + 2px)' }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
      />
      {/* Moon side */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-1.5 px-2">
        <MoonSvg size={16} active={isMoon} />
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: isMoon ? '#D8D7DB' : 'rgba(29,35,60,0.5)',
          fontWeight: 700,
        }}>MOON</span>
      </div>
      {/* Sun side */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-1.5 px-2">
        <SunSvg size={16} active={!isMoon} />
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: !isMoon ? '#7a5c00' : 'rgba(246,230,180,0.5)',
          fontWeight: 700,
        }}>SUN</span>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Sidebar
// ─────────────────────────────────────────────────────────────────────────────
interface FilterSidebarProps {
  mode: LibraryMode;
  medium: MediumFilter;
  status: StatusFilter;
  onMedium: (v: MediumFilter) => void;
  onStatus: (v: StatusFilter) => void;
  isOpen: boolean;
  totalItems: number;
  filteredCount: number;
}

export function FilterSidebar({ mode, medium, status, onMedium, onStatus, isOpen, totalItems, filteredCount }: FilterSidebarProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const isMoon = mode === 'reflection';

  const bg = isMoon ? '#0d1117' : '#fefdf6';
  const border = isMoon ? 'rgba(216,215,219,0.12)' : 'rgba(26,31,75,0.15)';
  const textMuted = isMoon ? '#717182' : '#8a8890';
  const textPrimary = isMoon ? '#D8D7DB' : '#1A1F4B';
  const accentColor = isMoon ? '#FFC857' : '#B8860B';
  const chipActive = isMoon
    ? { bg: 'rgba(255,200,87,0.18)', border: 'rgba(255,200,87,0.6)', text: '#FFC857' }
    : { bg: 'rgba(26,31,75,0.12)', border: 'rgba(26,31,75,0.5)', text: '#1A1F4B' };
  const chipInactive = isMoon
    ? { bg: 'transparent', border: 'rgba(216,215,219,0.15)', text: '#717182' }
    : { bg: 'transparent', border: 'rgba(26,31,75,0.12)', text: '#717182' };

  const mediumOptions: { value: MediumFilter; label: string }[] = [
    { value: 'all', label: 'All Mediums' },
    { value: 'animation', label: 'Animation' },
    { value: 'writing', label: 'Writing' },
    { value: 'design', label: 'Design' },
  ];

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <motion.aside
      className="flex-shrink-0 overflow-hidden"
      animate={{ width: isOpen ? 220 : 0, opacity: isOpen ? 1 : 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ minWidth: 0 }}
    >
      <div
        className="h-full sticky top-[64px] overflow-y-auto"
        style={{
          width: 220,
          background: bg,
          borderRight: `1px solid ${border}`,
          padding: '2rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Count */}
        <div>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: textMuted, letterSpacing: '0.12em', marginBottom: 6 }}>
            SHOWING
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: accentColor, lineHeight: 1 }}>
            {filteredCount}
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: textMuted, letterSpacing: '0.1em' }}>
            OF {totalItems} WORKS
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: border }} />

        {/* Medium Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CompassIcon size={16} color={accentColor} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: textMuted, letterSpacing: '0.14em' }}>
              MEDIUM
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {mediumOptions.map(opt => {
              const isActive = medium === opt.value;
              const chip = isActive ? chipActive : chipInactive;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => onMedium(opt.value)}
                  className="text-left rounded-lg px-3 py-2 border transition-all"
                  style={{
                    background: chip.bg,
                    borderColor: chip.border,
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.8rem',
                    color: chip.text,
                    cursor: 'pointer',
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: border }} />

        {/* Status Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <QuillIcon size={16} color={accentColor} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: textMuted, letterSpacing: '0.14em' }}>
              STATUS
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {statusOptions.map(opt => {
              const isActive = status === opt.value;
              const chip = isActive ? chipActive : chipInactive;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => onStatus(opt.value)}
                  className="text-left rounded-lg px-3 py-2 border"
                  style={{
                    background: chip.bg,
                    borderColor: chip.border,
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.8rem',
                    color: chip.text,
                    cursor: 'pointer',
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: border }} />

        {/* Archive note */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LensIcon size={16} color={accentColor} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: textMuted, letterSpacing: '0.14em' }}>
              ARCHIVE
            </span>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: textMuted, lineHeight: 1.6 }}>
            "Every work begins as a whisper in the archive before it becomes a voice in the world."
          </p>
        </div>
      </div>
    </motion.aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quiet archive cards (details remain visible without hover)
// ─────────────────────────────────────────────────────────────────────────────
function QuietArchiveCard({ item, mode }: { item: LibraryItem; mode: LibraryMode }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const isMoon = mode === 'reflection';
  const accent = isMoon ? '#FFC857' : '#8A6410';
  const titleColor = isMoon ? '#F6E6B4' : '#1A1F4B';
  const bodyColor = isMoon ? 'rgba(216,215,219,0.8)' : 'rgba(26,31,75,0.78)';
  const mutedColor = isMoon ? '#9B9AA9' : '#74717A';

  return (
    <motion.article
      className="library-archive-card relative overflow-hidden rounded-xl"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.42, ease: 'easeOut' }}
      style={{
        background: isMoon ? 'rgba(13,17,31,0.9)' : 'rgba(255,253,247,0.92)',
        border: `1px solid ${isMoon ? 'rgba(255,200,87,0.16)' : 'rgba(26,31,75,0.14)'}`,
        boxShadow: isMoon ? '0 10px 26px rgba(0,0,0,0.16)' : '0 8px 22px rgba(15,21,48,0.055)',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', background: isMoon ? '#101521' : '#EEE8D8' }}>
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: isMoon ? 0.78 : 0.86 }}
        />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: isMoon ? 'linear-gradient(180deg, rgba(7,12,24,0.08), rgba(7,12,24,0.36))' : 'linear-gradient(180deg, rgba(255,249,232,0.02), rgba(26,31,75,0.2))' }} />
        <span style={{ position: 'absolute', top: 12, left: 12, padding: '5px 9px', borderRadius: 999, color: isMoon ? '#FFC857' : '#1A1F4B', background: isMoon ? 'rgba(10,14,26,0.78)' : 'rgba(255,249,232,0.9)', border: `1px solid ${accent}45`, fontFamily: "'Space Mono', monospace", fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {item.medium}
        </span>
      </div>

      <div style={{ padding: '18px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <h3 style={{ margin: 0, color: titleColor, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.28rem', fontWeight: 600, lineHeight: 1.18 }}>
            {item.title}
          </h3>
          <span style={{ flexShrink: 0, color: mutedColor, fontFamily: "'Space Mono', monospace", fontSize: '0.59rem', letterSpacing: '0.04em' }}>
            {item.year}
          </span>
        </div>
        <p style={{ margin: '6px 0 11px', color: accent, fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {item.subtitle} · {item.status}
        </p>
        <p style={{ margin: 0, color: bodyColor, fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.88rem', lineHeight: 1.58 }}>
          {item.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }} aria-label="Tools">
          {item.tools.map((tool) => (
            <span key={tool} style={{ padding: '4px 8px', borderRadius: 999, color: mutedColor, background: isMoon ? 'rgba(255,200,87,0.055)' : 'rgba(26,31,75,0.045)', border: `1px solid ${isMoon ? 'rgba(255,200,87,0.12)' : 'rgba(26,31,75,0.1)'}`, fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', lineHeight: 1.35 }}>
              {tool}
            </span>
          ))}
        </div>
      </div>
      <div aria-hidden="true" style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accent}72, transparent)`, opacity: 0.75 }} />
    </motion.article>
  );
}

export function GlitchCard({ item }: { item: LibraryItem }) {
  return <QuietArchiveCard item={item} mode="reflection" />;
}

export function RippleCard({ item }: { item: LibraryItem }) {
  return <QuietArchiveCard item={item} mode="expression" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chronicle Section Block
// ─────────────────────────────────────────────────────────────────────────────
interface ChronicleSectionProps {
  sectionName: string;
  sectionIndex: number;
  totalSections: number;
  mode: LibraryMode;
  children: React.ReactNode;
  onVisible: (name: string) => void;
}

export function ChronicleSectionBlock({
  sectionName, sectionIndex, totalSections, mode, children, onVisible
}: ChronicleSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const isMoon = mode === 'reflection';

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(sectionName); },
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [sectionName, onVisible]);

  const textPrimary = isMoon ? '#D8D7DB' : '#1A1F4B';
  const accentColor = isMoon ? '#FFC857' : '#B8860B';
  const lineColor   = isMoon ? 'rgba(255,200,87,0.25)' : 'rgba(26,31,75,0.2)';

  return (
    <div ref={ref} className="relative" id={`section-${sectionName.replace(/\s/g, '-').toLowerCase()}`}>
      {/* Chronicle node */}
      <div className="absolute left-0 top-6 flex items-center" style={{ width: 40, marginLeft: -20 }}>
        <motion.div
          className="rounded-full border-2 flex-shrink-0"
          style={{
            width: 12, height: 12,
            background: accentColor,
            borderColor: accentColor,
            boxShadow: `0 0 0 0 ${accentColor}70`,
          }}
          whileInView={prefersReducedMotion ? undefined : {
            boxShadow: [`0 0 0 0 ${accentColor}70`, `0 0 0 10px ${accentColor}00`],
          }}
          transition={{ duration: 1.5, repeat: 1 }}
          viewport={{ once: false }}
        />
      </div>

      {/* Section header */}
      <motion.div
        className="mb-6 pl-6"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { width: 0, opacity: 0.35 }}
            whileInView={{ width: 24, opacity: 0.72 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: 'easeOut' }}
            viewport={{ once: true }}
            style={{ height: 1, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)`, boxShadow: `0 0 5px ${accentColor}40` }}
          />
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            color: accentColor,
            letterSpacing: '0.2em',
            opacity: 0.8,
          }}>
            {String(sectionIndex + 1).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
          </span>
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.8rem',
          color: textPrimary,
          lineHeight: 1.2,
          marginTop: 4,
        }}>
          {sectionName}
        </h2>
        <div style={{ height: 1, marginTop: 8, background: lineColor }} />
      </motion.div>

      {/* Cards grid */}
      <div className="pl-6">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Heritage Background Pattern
// ─────────────────────────────────────────────────────────────────────────────
export function HeritagePattern({ mode }: { mode: LibraryMode }) {
  const isMoon = mode === 'reflection';
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ opacity: isMoon ? 0.04 : 0.05 }}>
      {/* Repeating text lines */}
      <div
        className="absolute inset-0"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '13px',
          lineHeight: '2.2',
          color: isMoon ? '#F6E6B4' : '#1A1F4B',
          padding: '2rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          userSelect: 'none',
        }}
      >
        {`In the beginning, there was the word, and the word was creation | Archives of the forgotten, whispered through the ages, bound in leather and starlight | Stories that dance between moonlight and sunlight | The library of infinite imagination, where every thought becomes a universe | Deep time stretches before us, each moment a page in the eternal codex | Where creativity flows like a river through the landscape of consciousness | Heritage text patterns that echo through eternity, repeating, evolving, transforming | The foundation upon which all stories rest, the canvas of possibility | Ancient wisdom meets modern vision in this space between spaces | `.repeat(20)}
      </div>
    </div>
  );
}
