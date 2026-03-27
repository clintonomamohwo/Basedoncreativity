import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon, FileText, Film } from 'lucide-react';
import { CloudinaryImage } from './CloudinaryImage';
import { cloudinaryVideoUrl } from '../../lib/cloudinary';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

type MediaType = 'image' | 'video' | 'writing';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  year: number;
  type: MediaType;
  // Image / Video
  publicId?: string;
  aspect?: 'landscape' | 'portrait' | 'square';
  // Writing
  excerpt?: string;
  body?: string;
  heroPublicId?: string; // optional hero image for writing card
  // Bento size hint
  size?: 'sm' | 'md' | 'lg';
}

/* ═══════════════════════════════════════════════════════════════════════════
   GALLERY DATA
   Add images, videos and writing pieces here.
   Videos: set type:'video' and provide a Cloudinary video publicId.
   Writing: set type:'writing' and provide excerpt + body text.
═══════════════════════════════════════════════════════════════════════════ */

const GALLERY_DATA: GalleryItem[] = [
  // ── Images ──────────────────────────────────────────────────────────────
  {
    id: 1, year: 2025, type: 'image', title: 'Royal Dog',
    category: 'Illustration', publicId: 'Royal_Dog_dpz0gl', aspect: 'portrait',
  },
  {
    id: 2, year: 2020, type: 'image', title: 'Trevor J',
    category: 'Portrait', publicId: 'Vault/2020/TrevorJ1_de3b13', aspect: 'portrait',
  },

];

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS  (orb reveal mechanic — unchanged)
═══════════════════════════════════════════════════════════════════════════ */

const EAST_THRESHOLD  = 0.75;
const LIGHT_REVEAL_MS = 2500;
const ORB_RADIUS      = 64;
const NAV_HEIGHT      = 80;

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════════════════ */

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function buildGradient(x: number, y: number, light: number): string {
  const gA    = (light * 0.45).toFixed(3);
  const gB    = (light * 0.18).toFixed(3);
  const stop2 = `${(light * 15).toFixed(1)}%`;
  const stop3 = light > 0.01 ? `${Math.min(light * 35 + 20, 65).toFixed(1)}%` : '100%';
  return [
    `radial-gradient(ellipse at ${x}px ${y}px, rgba(255,248,220,${gA}) 0%, rgba(255,200,87,${gB}) ${stop2}, transparent ${stop3})`,
    `radial-gradient(ellipse at 60% 20%, #1e2d6e 0%, #1A1F4B 45%, #0d1235 100%)`,
  ].join(', ');
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAR CANVAS  (unchanged)
═══════════════════════════════════════════════════════════════════════════ */

interface CanvasStar {
  x: number; y: number; r: number;
  baseOpacity: number; opacity: number;
  speed: number; phase: number; kind: number;
}
const STAR_COLORS = ['#FFFFFF', '#C8DCFF', '#A8C8FF', '#FFC857'];
const STAR_GLOWS: [number, number, number][] = [
  [255, 255, 255], [180, 210, 255], [140, 190, 255], [255, 200, 87],
];

function StarCanvas({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef  = useRef<CanvasStar[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const buildStars = (w: number, h: number) => {
      const count = Math.round((w * h) / 3000);
      starsRef.current = Array.from({ length: Math.max(count, 160) }, () => {
        const isGold = Math.random() < 0.15;
        const isMid  = Math.random() < 0.25;
        const kind   = isGold ? 3 : isMid ? 2 : Math.random() < 0.5 ? 0 : 1;
        const base   = 0.45 + Math.random() * 0.55;
        return { x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, baseOpacity: base, opacity: base, speed: 0.003 + Math.random() * 0.012, phase: Math.random() * Math.PI * 2, kind };
      });
    };

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; buildStars(canvas.width, canvas.height); };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!visible) { rafRef.current = requestAnimationFrame(draw); return; }
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      for (const s of starsRef.current) {
        s.phase += s.speed; s.opacity = s.baseOpacity * (0.55 + 0.45 * Math.sin(s.phase));
        const [gr, gg, gb] = STAR_GLOWS[s.kind];
        const glow = s.r * 5;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glow);
        grad.addColorStop(0,   `rgba(${gr},${gg},${gb},${(s.opacity * 0.9).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(${gr},${gg},${gb},${(s.opacity * 0.3).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${gr},${gg},${gb},0)`);
        ctx.beginPath(); ctx.arc(s.x, s.y, glow, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = STAR_COLORS[s.kind]; ctx.globalAlpha = s.opacity; ctx.fill(); ctx.globalAlpha = 1;
        if (s.r > 1.2) {
          ctx.save(); ctx.globalAlpha = s.opacity * 0.5; ctx.strokeStyle = STAR_COLORS[s.kind]; ctx.lineWidth = 0.5;
          const arm = s.r * 4;
          ctx.beginPath(); ctx.moveTo(s.x - arm, s.y); ctx.lineTo(s.x + arm, s.y); ctx.moveTo(s.x, s.y - arm); ctx.lineTo(s.x, s.y + arm); ctx.stroke(); ctx.restore();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER BAR
═══════════════════════════════════════════════════════════════════════════ */

const TYPE_FILTERS: { value: MediaType | 'all'; label: string; Icon: React.ElementType }[] = [
  { value: 'all',     label: 'All',     Icon: () => <span style={{ fontSize: '0.8rem' }}>✦</span> },
  { value: 'image',   label: 'Images',  Icon: ImageIcon },
  { value: 'video',   label: 'Video',   Icon: Film },
  { value: 'writing', label: 'Writing', Icon: FileText },
];

interface FilterBarProps {
  activeType: MediaType | 'all';
  activeYear: number | 'all';
  years: number[];
  onTypeChange: (t: MediaType | 'all') => void;
  onYearChange: (y: number | 'all') => void;
}

function FilterBar({ activeType, activeYear, years, onTypeChange, onYearChange }: FilterBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 32 }}>
      {/* Type tabs */}
      <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 999, padding: '5px 6px', border: '1px solid rgba(255,200,87,0.1)' }}>
        {TYPE_FILTERS.map(({ value, label, Icon }) => {
          const active = activeType === value;
          return (
            <motion.button
              key={value}
              onClick={() => onTypeChange(value)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: active ? '#FFC857' : 'transparent',
                color: active ? '#1A1F4B' : 'rgba(255,255,255,0.45)',
                fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', letterSpacing: '0.08em',
                transition: 'all 0.22s ease',
                fontWeight: active ? 700 : 400,
              }}
            >
              <Icon size={13} />
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Year pills */}
      {years.length > 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['all', ...years] as (number | 'all')[]).map(y => {
            const active = activeYear === y;
            return (
              <motion.button
                key={y}
                onClick={() => onYearChange(y)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '4px 14px', borderRadius: 999, border: active ? '1px solid rgba(255,200,87,0.7)' : '1px solid rgba(255,200,87,0.18)',
                  background: active ? 'rgba(255,200,87,0.12)' : 'transparent',
                  color: active ? '#FFC857' : 'rgba(255,255,255,0.38)',
                  fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                {y === 'all' ? 'ALL YEARS' : y}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BENTO CARDS
═══════════════════════════════════════════════════════════════════════════ */

const TYPE_ACCENT: Record<MediaType, string> = {
  image:   '#FFC857',
  video:   '#7B9CFF',
  writing: '#C9B89A',
};

interface BentoCardProps {
  item: GalleryItem;
  onClick: () => void;
  index: number;
  colSpan: number; // calculated by parent
}

function ImageBentoCard({ item, onClick, index }: Omit<BentoCardProps, 'colSpan'>) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        background: '#0d1235', minHeight: 280,
        border: hovered ? '1px solid rgba(255,200,87,0.5)' : '1px solid rgba(255,200,87,0.1)',
        transition: 'border-color 0.25s ease',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {item.publicId && (
        <CloudinaryImage
          publicId={item.publicId}
          alt={item.title}
          cloudinaryOptions={{ width: 700, format: 'auto', quality: 'auto', fit: 'fill' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.55s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)', position: 'absolute', inset: 0 }}
        />
      )}
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,13,40,0.92) 0%, rgba(10,13,40,0.2) 50%, transparent 100%)', pointerEvents: 'none' }} />
      {/* Type badge */}
      <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: 'rgba(10,13,40,0.7)', backdropFilter: 'blur(8px)', border: `1px solid ${TYPE_ACCENT.image}33` }}>
        <ImageIcon size={10} style={{ color: TYPE_ACCENT.image }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: TYPE_ACCENT.image, letterSpacing: '0.1em' }}>IMAGE</span>
      </div>
      {/* Meta */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 18px 16px' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'rgba(255,200,87,0.55)', letterSpacing: '0.1em', margin: '0 0 5px' }}>{item.category.toUpperCase()} · {item.year}</p>
        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: '#F6E6B4', margin: 0, letterSpacing: '0.04em' }}>{item.title}</h4>
      </div>
    </motion.div>
  );
}

function VideoBentoCard({ item, onClick, index }: Omit<BentoCardProps, 'colSpan'>) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        background: '#080d22', minHeight: 300,
        border: hovered ? '1px solid rgba(123,156,255,0.5)' : '1px solid rgba(123,156,255,0.12)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.55)' : '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Thumbnail or gradient bg */}
      {item.heroPublicId ? (
        <CloudinaryImage
          publicId={item.heroPublicId}
          alt={item.title}
          cloudinaryOptions={{ width: 900, format: 'auto', quality: 'auto', fit: 'fill' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.55, transition: 'opacity 0.3s ease', filter: 'blur(2px)' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 50%, #1a2a6c 0%, #0a0e22 100%)' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,13,34,0.95) 0%, rgba(8,13,34,0.3) 60%, transparent 100%)', pointerEvents: 'none' }} />

      {/* Play button */}
      <motion.div
        animate={{ scale: hovered ? 1.12 : 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'relative', zIndex: 2,
          width: 64, height: 64, borderRadius: '50%',
          background: hovered ? 'rgba(123,156,255,0.25)' : 'rgba(123,156,255,0.12)',
          border: '2px solid rgba(123,156,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.25s ease',
        }}
      >
        <Play size={22} style={{ color: '#7B9CFF', marginLeft: 4 }} fill="#7B9CFF" />
      </motion.div>

      {/* Type badge */}
      <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: 'rgba(8,13,34,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(123,156,255,0.25)' }}>
        <Film size={10} style={{ color: TYPE_ACCENT.video }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: TYPE_ACCENT.video, letterSpacing: '0.1em' }}>VIDEO</span>
      </div>

      {/* Meta */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 18px 16px' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'rgba(123,156,255,0.6)', letterSpacing: '0.1em', margin: '0 0 5px' }}>{item.category.toUpperCase()} · {item.year}</p>
        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: '#E8EEFF', margin: 0, letterSpacing: '0.04em' }}>{item.title}</h4>
      </div>
    </motion.div>
  );
}

function WritingBentoCard({ item, onClick, index }: Omit<BentoCardProps, 'colSpan'>) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        background: hovered ? '#2a2218' : '#1e1a14',
        minHeight: 280, padding: '28px 26px 22px',
        border: hovered ? '1px solid rgba(201,184,154,0.45)' : '1px solid rgba(201,184,154,0.15)',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
    >
      {/* Decorative ruled lines */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${30 + i * 36}px`, height: 1, background: 'rgba(201,184,154,0.06)', pointerEvents: 'none' }} />
      ))}

      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 18, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: 'rgba(201,184,154,0.1)', border: '1px solid rgba(201,184,154,0.2)' }}>
          <FileText size={10} style={{ color: TYPE_ACCENT.writing }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: TYPE_ACCENT.writing, letterSpacing: '0.1em' }}>WRITING</span>
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'rgba(201,184,154,0.4)', letterSpacing: '0.1em' }}>{item.year}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Opening quote mark */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4rem', color: 'rgba(201,184,154,0.15)', lineHeight: 1, marginBottom: -16, userSelect: 'none' }}>"</div>
        {item.excerpt && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic',
            color: '#D4C5A9', lineHeight: 1.65, margin: '0 0 20px',
            display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.excerpt}
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(201,184,154,0.1)', paddingTop: 14 }}>
        <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#C9B89A', margin: '0 0 4px', letterSpacing: '0.06em' }}>{item.title}</h4>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.7rem', color: 'rgba(201,184,154,0.45)', margin: 0 }}>{item.category}</p>
      </div>

      {/* Read CTA */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        style={{ position: 'absolute', bottom: 18, right: 18, display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#C9B89A', letterSpacing: '0.1em' }}>READ</span>
        <ChevronRight size={12} style={{ color: '#C9B89A' }} />
      </motion.div>
    </motion.div>
  );
}

const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  function BentoCard({ item, onClick, index, colSpan }, ref) {
    const props = { item, onClick, index };
    const card = item.type === 'image'   ? <ImageBentoCard   {...props} />
               : item.type === 'video'   ? <VideoBentoCard   {...props} />
               :                           <WritingBentoCard  {...props} />;
    return (
      <div ref={ref} style={{ gridColumn: `span ${colSpan}` }}>
        {card}
      </div>
    );
  }
);

/* ═══════════════════════════════════════════════════════════════════════════
   FULL-SCREEN DECK VIEWS
═══════════════════════════════════════════════════════════════════════════ */

function DeckImageView({ item }: { item: GalleryItem }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Blurred bg */}
      {item.publicId && (
        <div style={{ position: 'absolute', inset: '-40px', filter: 'blur(40px)', opacity: 0.35 }}>
          <CloudinaryImage publicId={item.publicId} alt="" cloudinaryOptions={{ width: 400, format: 'auto', quality: 30, fit: 'fill' }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      {/* Main image */}
      {item.publicId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 1, maxHeight: '78vh', maxWidth: '90%' }}
        >
          <CloudinaryImage
            publicId={item.publicId}
            alt={item.title}
            cloudinaryOptions={{ width: 1400, format: 'auto', quality: 'auto' }}
            style={{ maxHeight: '78vh', maxWidth: '100%', objectFit: 'contain', display: 'block', borderRadius: 4, boxShadow: '0 32px 100px rgba(0,0,0,0.8)' }}
          />
        </motion.div>
      )}
    </div>
  );
}

function DeckVideoView({ item }: { item: GalleryItem }) {
  const src = item.publicId ? cloudinaryVideoUrl(item.publicId, { format: 'auto', quality: 'auto' }) : '';
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
      <motion.video
        key={src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        controls
        autoPlay
        playsInline
        style={{ maxWidth: '100%', maxHeight: '82vh', outline: 'none', borderRadius: 4, boxShadow: '0 32px 100px rgba(0,0,0,0.8)' }}
      >
        <source src={src} type="video/mp4" />
        <source src={cloudinaryVideoUrl(item.publicId ?? '', { format: 'webm', quality: 'auto' })} type="video/webm" />
      </motion.video>
    </div>
  );
}

function DeckWritingView({ item }: { item: GalleryItem }) {
  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 680, width: '100%' }}
      >
        {/* Category + year */}
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'rgba(201,184,154,0.6)', letterSpacing: '0.14em', marginBottom: 16 }}>
          {item.category.toUpperCase()} · {item.year}
        </p>
        {/* Title */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400, color: '#F6E6B4', marginBottom: 32, lineHeight: 1.2, letterSpacing: '0.04em' }}>
          {item.title}
        </h2>
        {/* Gold rule */}
        <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, #FFC857, transparent)', marginBottom: 36 }} />
        {/* Body */}
        {item.body ? (
          item.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 28 }}>
              {para}
            </p>
          ))
        ) : item.excerpt ? (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontStyle: 'italic', color: '#D4C5A9', lineHeight: 1.65 }}>
            {item.excerpt}
          </p>
        ) : null}
      </motion.article>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FULL-SCREEN DECK
═══════════════════════════════════════════════════════════════════════════ */

interface DeckProps {
  items: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}

function FullScreenDeck({ items, startIndex, onClose }: DeckProps) {
  const [current, setCurrent] = useState(startIndex);
  const [direction, setDirection] = useState(0); // −1 prev, +1 next
  const item = items[current];

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent(c => Math.max(0, Math.min(items.length - 1, c + dir)));
  }, [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')       onClose();
      if (e.key === 'ArrowRight')   go(1);
      if (e.key === 'ArrowLeft')    go(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, go]);

  const accent = TYPE_ACCENT[item.type];

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: item.type === 'writing' ? '#100e0a' : 'rgba(4,5,18,0.97)',
        backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', flexShrink: 0,
        borderBottom: `1px solid ${accent}18`,
        background: 'rgba(0,0,0,0.3)',
      }}>
        {/* Left: type + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, border: `1px solid ${accent}44`, flexShrink: 0 }}>
            {item.type === 'image'   && <ImageIcon size={11} style={{ color: accent }} />}
            {item.type === 'video'   && <Film      size={11} style={{ color: accent }} />}
            {item.type === 'writing' && <FileText  size={11} style={{ color: accent }} />}
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: accent, letterSpacing: '0.1em' }}>{item.type.toUpperCase()}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#F6E6B4', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h3>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.57rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', margin: '2px 0 0' }}>{item.category} · {item.year}</p>
          </div>
        </div>

        {/* Right: counter + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
            {current + 1} / {items.length}
          </span>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={item.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {item.type === 'image'   && <DeckImageView   item={item} />}
            {item.type === 'video'   && <DeckVideoView   item={item} />}
            {item.type === 'writing' && <DeckWritingView item={item} />}
          </motion.div>
        </AnimatePresence>

        {/* Prev arrow */}
        {current > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => go(-1)}
            style={{
              position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', zIndex: 10, transition: 'background 0.2s ease',
            }}
            whileHover={{ scale: 1.08, background: 'rgba(255,255,255,0.14)' } as never}
            whileTap={{ scale: 0.94 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}

        {/* Next arrow */}
        {current < items.length - 1 && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => go(1)}
            style={{
              position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', zIndex: 10, transition: 'background 0.2s ease',
            }}
            whileHover={{ scale: 1.08, background: 'rgba(255,255,255,0.14)' } as never}
            whileTap={{ scale: 0.94 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </div>

      {/* ── Progress dots ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '14px 24px', flexShrink: 0 }}>
        {items.map((it, i) => (
          <motion.button
            key={it.id}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            animate={{ width: i === current ? 24 : 6, background: i === current ? accent : 'rgba(255,255,255,0.2)' }}
            transition={{ duration: 0.25 }}
            style={{ height: 6, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, outline: 'none' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BENTO VAULT  (grid + deck combined)
═══════════════════════════════════════════════════════════════════════════ */

function BentoVault() {
  const [activeType, setActiveType] = useState<MediaType | 'all'>('all');
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');
  const [deckIndex,  setDeckIndex]  = useState<number | null>(null);
  const windowWidth = useWindowWidth();

  const years = useMemo(() =>
    [...new Set(GALLERY_DATA.map(i => i.year))].sort((a, b) => b - a),
  []);

  const filtered = useMemo(() =>
    GALLERY_DATA.filter(item => {
      const typeMatch = activeType === 'all' || item.type === activeType;
      const yearMatch = activeYear === 'all' || item.year === activeYear;
      return typeMatch && yearMatch;
    }),
  [activeType, activeYear]);

  // Column spans based on viewport
  const getColSpan = (item: GalleryItem): number => {
    if (windowWidth < 640) return 6;      // full on mobile
    if (windowWidth < 1024) {
      if (item.type === 'video') return 6;
      return 3;
    }
    // desktop
    if (item.type === 'video') return 3;  // span 3 of 6
    return 2;                             // span 2 of 6
  };

  const handleOpen = useCallback((item: GalleryItem) => {
    const idx = filtered.findIndex(f => f.id === item.id);
    if (idx !== -1) setDeckIndex(idx);
  }, [filtered]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden' }}
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', padding: 'clamp(80px, 7vw, 96px) clamp(24px, 5vw, 80px) 0' }}
      >
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 300, color: '#FFC857', letterSpacing: '0.12em', marginBottom: 10, textShadow: '0 2px 20px rgba(255,200,87,0.3)' }}>
          The Vault
        </h2>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.65 }}>
          A curated archive: images, video, and writing, organised by year.
        </p>

        <FilterBar
          activeType={activeType}
          activeYear={activeYear}
          years={years}
          onTypeChange={setActiveType}
          onYearChange={setActiveYear}
        />
      </motion.div>

      {/* ── Bento Grid ── */}
      <div style={{ padding: 'clamp(16px, 3vw, 40px) clamp(20px, 4vw, 64px) 80px', maxWidth: 1440, margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 24px' }}
          >
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontStyle: 'italic', color: 'rgba(255,200,87,0.4)' }}>
              Nothing in the vault for this filter yet.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 'clamp(10px, 1.8vw, 20px)',
              alignItems: 'start',
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, idx) => (
                <BentoCard
                  key={item.id}
                  item={item}
                  index={idx}
                  colSpan={getColSpan(item)}
                  onClick={() => handleOpen(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Full-Screen Deck ── */}
      <AnimatePresence>
        {deckIndex !== null && (
          <FullScreenDeck
            items={filtered}
            startIndex={deckIndex}
            onClose={() => setDeckIndex(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VAULT PAGE  (orb reveal → bento vault)
═══════════════════════════════════════════════════════════════════════════ */

export function VaultPage() {
  const [isDragging,     setIsDragging]     = useState(false);
  const [hasTransformed, setHasTransformed] = useState(false);
  const [showVaultText,  setShowVaultText]  = useState(false);
  const [showGallery,    setShowGallery]    = useState(false);

  const containerRef      = useRef<HTMLDivElement>(null);
  const hasTransformedRef = useRef(false);
  const showGalleryRef    = useRef(false);
  const isDraggingRef     = useRef(false);
  const dragStartRef      = useRef({ x: 0, y: 0 });
  const moonOffsetRef     = useRef({ x: 0, y: 0 });
  const lightRef          = useRef(0);
  const rafRef            = useRef<number>(0);

  const moonX = useMotionValue(120);
  const moonY = useMotionValue(300);

  useEffect(() => {
    const w = window.innerWidth, h = window.innerHeight;
    moonX.set(ORB_RADIUS + 20 + Math.random() * (w * 0.45 - ORB_RADIUS - 20));
    moonY.set(NAV_HEIGHT + ORB_RADIUS + 20 + Math.random() * (h - NAV_HEIGHT - ORB_RADIUS * 2 - 40));
  }, [moonX, moonY]);

  const applyBackground = useCallback(() => {
    if (!containerRef.current || showGalleryRef.current) return;
    containerRef.current.style.background = buildGradient(moonX.get(), moonY.get(), lightRef.current);
  }, [moonX, moonY]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.style.background = 'radial-gradient(ellipse at 60% 20%, #1e2d6e 0%, #1A1F4B 45%, #0d1235 100%)';
  }, []);

  const triggerTransformation = useCallback(() => {
    if (hasTransformedRef.current) return;
    hasTransformedRef.current = true;
    setHasTransformed(true);
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / LIGHT_REVEAL_MS, 1);
      lightRef.current = easeInOutCubic(progress);
      applyBackground();
      if (progress < 1) { rafRef.current = requestAnimationFrame(tick); }
      else {
        setTimeout(() => setShowVaultText(true), 400);
        setTimeout(() => { showGalleryRef.current = true; setShowGallery(true); if (containerRef.current) containerRef.current.style.background = '#0d1235'; }, 1900);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [applyBackground]);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    dragStartRef.current  = { x: clientX, y: clientY };
    moonOffsetRef.current = { x: moonX.get(), y: moonY.get() };
    setIsDragging(true);
  }, [moonX, moonY]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.max(ORB_RADIUS, Math.min(width  - ORB_RADIUS, moonOffsetRef.current.x + (clientX - dragStartRef.current.x)));
    const y = Math.max(NAV_HEIGHT + ORB_RADIUS, Math.min(height - ORB_RADIUS, moonOffsetRef.current.y + (clientY - dragStartRef.current.y)));
    moonX.set(x); moonY.set(y); applyBackground();
    if (x > width * EAST_THRESHOLD) triggerTransformation();
  }, [moonX, moonY, applyBackground, triggerTransformation]);

  const handleDragEnd = useCallback(() => { isDraggingRef.current = false; setIsDragging(false); }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent)  => handleDragMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent)  => { e.preventDefault(); handleDragMove(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('mouseup',    handleDragEnd);
    window.addEventListener('touchmove',  onTouchMove, { passive: false });
    window.addEventListener('touchend',   handleDragEnd);
    return () => {
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseup',    handleDragEnd);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   handleDragEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleDragMove, handleDragEnd]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#1A1F4B', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'default', touchAction: 'none' }}
    >
      <StarCanvas visible={!showGallery} />

      <div style={{ position: 'relative', maxWidth: 1920, margin: '0 auto', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(20px, 5vw, 80px)' }}>

        {/* ── Draggable Orb ── */}
        <AnimatePresence mode="wait">
          {!showGallery && (
            <motion.div
              key="celestial"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onMouseDown={e => handleDragStart(e.clientX, e.clientY)}
              onTouchStart={e => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
              style={{ position: 'absolute', left: moonX, top: moonY, translateX: '-50%', translateY: '-50%', cursor: isDragging ? 'grabbing' : 'grab', zIndex: 30, touchAction: 'none', userSelect: 'none' }}
            >
              {!hasTransformed && (
                <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '2px solid rgba(255,200,87,0.7)', pointerEvents: 'none' }} />
              )}
              <motion.div
                animate={{ rotate: hasTransformed ? 360 : 0, scale: hasTransformed ? [1, 1.3, 1.5] : 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: 'clamp(72px, 16vw, 120px)', height: 'clamp(72px, 16vw, 120px)', position: 'relative' }}
              >
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: hasTransformed ? 'radial-gradient(circle, #FFF8DC 0%, #FFC857 50%, #FFB347 100%)' : 'radial-gradient(circle at 30% 30%, #F0F0F0 0%, #D8D7DB 50%, #A0A0A0 100%)', boxShadow: hasTransformed ? '0 0 30px rgba(255,200,87,0.55), 0 0 60px rgba(255,200,87,0.25)' : '0 0 20px rgba(216,215,219,0.4), inset -10px -10px 30px rgba(0,0,0,0.2)', transition: 'background 1s ease-out, box-shadow 1s ease-out' }} />
                {hasTransformed && Array.from({ length: 12 }, (_, i) => (
                  <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: [0.6, 0.3, 0.6] }} transition={{ scale: { duration: 0.6, delay: i * 0.05 }, opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
                    style={{ position: 'absolute', top: '50%', left: '50%', width: 'clamp(50px, 10vw, 80px)', height: 3, background: 'linear-gradient(90deg, #FFC857, transparent)', transformOrigin: '0 50%', transform: `rotate(${i * 30}deg)`, filter: 'blur(1px)' }} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Compass ── */}
        {!showGallery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: hasTransformed ? 0 : 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}
          >
            <svg viewBox="0 0 200 200" style={{ width: 'clamp(140px, 40vw, 200px)', height: 'clamp(140px, 40vw, 200px)', filter: 'drop-shadow(0 4px 20px rgba(255,200,87,0.4))' }}>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#FFC857" strokeWidth="2" opacity="0.3" />
              <line x1="100" y1="20" x2="100" y2="30" stroke="#FFC857" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="170" x2="100" y2="180" stroke="#FFC857" strokeWidth="2" opacity="0.6" />
              <line x1="20" y1="100" x2="30" y2="100" stroke="#FFC857" strokeWidth="2" opacity="0.6" />
              <line x1="170" y1="100" x2="180" y2="100" stroke="#FFC857" strokeWidth="2" opacity="0.6" />
              <text x="100" y="14"  textAnchor="middle" fill="#FFC857" fontSize="15" fontWeight="bold" fontFamily="'Space Mono', monospace">N</text>
              <text x="100" y="198" textAnchor="middle" fill="#FFC857" fontSize="15" fontWeight="bold" fontFamily="'Space Mono', monospace" opacity="0.75">S</text>
              <text x="10"  y="104" textAnchor="middle" fill="#FFC857" fontSize="15" fontWeight="bold" fontFamily="'Space Mono', monospace" opacity="0.75">W</text>
              <motion.text x="192" y="104" textAnchor="middle" fill="#FFC857" fontSize="16" fontWeight="bold" fontFamily="'Space Mono', monospace" animate={{ opacity: [1, 0.55, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>E</motion.text>
              <motion.line x1="100" y1="100" x2="100" y2="30" stroke="#FFC857" strokeWidth="3" strokeLinecap="round" animate={{ rotate: [-15, -12, -15] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '100px 100px' }} />
              <motion.line x1="100" y1="100" x2="100" y2="30" stroke="#FFC857" strokeWidth="3" strokeLinecap="round" animate={{ rotate: [15, 18, 15] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '100px 100px' }} />
              <circle cx="100" cy="100" r="5" fill="#FFC857" />
              <motion.polygon points="100,25 95,20 105,20" fill="#FFC857" animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
            </svg>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} style={{ marginTop: 32, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.05rem, 2.8vw, 1.35rem)', fontStyle: 'italic', fontWeight: 600, color: '#FFC857', letterSpacing: '0.07em' }}>
              "The sun rises in the east."
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ delay: 2, duration: 1 }} style={{ marginTop: 12, textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.75rem', color: '#FFC857', letterSpacing: '0.08em' }}>
              Drag the orb east to open the vault
            </motion.p>
          </motion.div>
        )}

        {/* ── Vault text flash ── */}
        <AnimatePresence>
          {showVaultText && !showGallery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'absolute', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%', textAlign: 'center', zIndex: 30, width: '100%', padding: '0 24px' }}
            >
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 300, color: '#FFF8DC', letterSpacing: '0.15em', textShadow: '0 4px 40px rgba(255,200,87,0.6), 0 0 80px rgba(255,248,220,0.4)', margin: 0 }}>
                The Vault Awaits
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bento Vault ── */}
        <AnimatePresence>
          {showGallery && <BentoVault />}
        </AnimatePresence>
      </div>
    </div>
  );
}
