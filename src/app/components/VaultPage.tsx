import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EAST_THRESHOLD = 0.75;
const LIGHT_REVEAL_MS = 2500;
const ORB_RADIUS = 64;
const NAV_HEIGHT = 80;

const GALLERY_DATA: GalleryItem[] = [
  { id: 1, title: 'Ethereal Spaces',       category: 'Experimental Design', image: 'https://images.unsplash.com/photo-1632899104329-ada983583e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGV4cGVyaW1lbnRhbCUyMGFydCUyMGluc3RhbGxhdGlvbnxlbnwxfHx8fDE3NzM5NjE4NDR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, title: 'Digital Dreams',        category: 'Interactive Art',     image: 'https://images.unsplash.com/photo-1643388019606-9173b24bcafb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwY29sb3JmdWwlMjBtb2Rlcm58ZW58MXx8fHwxNzczOTYxODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, title: 'Kinetic Forms',         category: 'Motion Study',        image: 'https://images.unsplash.com/photo-1651218956903-3d469a264884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraW5ldGljJTIwc2N1bHB0dXJlJTIwbW90aW9ufGVufDF8fHx8MTc3Mzk2MTg0NXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 4, title: 'Abstract Dimensions',   category: 'Conceptual Work',     image: 'https://images.unsplash.com/photo-1595411425732-e69c1abe2763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHNoYXBlc3xlbnwxfHx8fDE3NzM5NTA2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 5, title: 'Chromatic Visions',     category: 'Color Theory',        image: 'https://images.unsplash.com/photo-1706593095573-f3176b2677d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbWF0aWMlMjBjb2xvciUyMGdyYWRpZW50fGVufDF8fHx8MTc3Mzk2MTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 6, title: 'Symbolic Narratives',   category: 'Storytelling',        image: 'https://images.unsplash.com/photo-1757621788635-677d5ab50dda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeW1ib2xpYyUyMGFydGlzdGljJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzczOTYxODQ2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function easeInOutCubic(t: number): number {
  // Smooth acceleration + deceleration: fast in the middle, slow at both ends
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// buildGradient computes the dynamic background as the orb moves east.
// Two stacked radial gradients:
//   1. A warm light bloom centred on the orb — opacity and spread grow with `light` (0→1)
//   2. A static deep-indigo night-sky base that's always visible behind the bloom
function buildGradient(x: number, y: number, light: number): string {
  const gA    = (light * 0.45).toFixed(3);          // cream core opacity
  const gB    = (light * 0.18).toFixed(3);          // gold mid-ring opacity
  const stop2 = `${(light * 15).toFixed(1)}%`;      // gold ring spreads outward as light → 1
  // stop3 clamps at 65% so the bloom never fills the whole screen
  const stop3 = light > 0.01 ? `${Math.min(light * 35 + 20, 65).toFixed(1)}%` : '100%';
  return [
    `radial-gradient(ellipse at ${x}px ${y}px, rgba(255,248,220,${gA}) 0%, rgba(255,200,87,${gB}) ${stop2}, transparent ${stop3})`,
    `radial-gradient(ellipse at 60% 20%, #1e2d6e 0%, #1A1F4B 45%, #0d1235 100%)`,
  ].join(', ');
}

// ── Star Canvas ───────────────────────────────────────────────────────────────

interface CanvasStar {
  x: number; y: number;
  r: number;
  baseOpacity: number;
  opacity: number;
  speed: number;      // twinkle speed (radians per frame)
  phase: number;      // twinkle phase offset
  /** 0=white 1=iceBlue 2=softBlue 3=gold */
  kind: number;
}

const STAR_COLORS = [
  '#FFFFFF',   // white
  '#C8DCFF',   // ice blue
  '#A8C8FF',   // soft blue
  '#FFC857',   // gold accent
];
const STAR_GLOWS: [number,number,number][] = [
  [255, 255, 255],
  [180, 210, 255],
  [140, 190, 255],
  [255, 200,  87],
];

function StarCanvas({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef  = useRef<CanvasStar[]>([]);
  const rafRef    = useRef<number>(0);

  // Build star list sized to canvas
  const buildStars = (w: number, h: number) => {
    const count = Math.round((w * h) / 3000);   // ~1 star per 3000px²
    starsRef.current = Array.from({ length: Math.max(count, 160) }, () => {
      const isGold = Math.random() < 0.15;
      const isMid  = Math.random() < 0.25;
      const kind   = isGold ? 3 : isMid ? 2 : Math.random() < 0.5 ? 0 : 1;
      const base   = 0.45 + Math.random() * 0.55;
      return {
        x:           Math.random() * w,
        y:           Math.random() * h,
        r:           Math.random() * 1.6 + 0.4,   // 0.4 – 2 px radius
        baseOpacity: base,
        opacity:     base,
        speed:       0.003 + Math.random() * 0.012,
        phase:       Math.random() * Math.PI * 2,
        kind,
      };
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      buildStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // RAF draw loop — runs every frame at 60fps
    const draw = () => {
      if (!visible) { rafRef.current = requestAnimationFrame(draw); return; }
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const s of starsRef.current) {
        // Twinkle: sine wave on opacity
        s.phase  += s.speed;
        s.opacity = s.baseOpacity * (0.55 + 0.45 * Math.sin(s.phase));

        const [gr, gg, gb] = STAR_GLOWS[s.kind];
        const glow = s.r * 5;           // glow radius scales with star size

        // Radial glow halo
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glow);
        grad.addColorStop(0,   `rgba(${gr},${gg},${gb},${(s.opacity * 0.9).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(${gr},${gg},${gb},${(s.opacity * 0.3).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${gr},${gg},${gb},0)`);

        ctx.beginPath();
        ctx.arc(s.x, s.y, glow, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = STAR_COLORS[s.kind];
        ctx.globalAlpha = s.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Cross-sparkle for larger stars
        if (s.r > 1.2) {
          ctx.save();
          ctx.globalAlpha = s.opacity * 0.5;
          ctx.strokeStyle = STAR_COLORS[s.kind];
          ctx.lineWidth   = 0.5;
          const arm = s.r * 4;
          ctx.beginPath();
          ctx.moveTo(s.x - arm, s.y); ctx.lineTo(s.x + arm, s.y);
          ctx.moveTo(s.x, s.y - arm); ctx.lineTo(s.x, s.y + arm);
          ctx.stroke();
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:     'absolute',
        inset:        0,
        width:        '100%',
        height:       '100%',
        pointerEvents:'none',
        zIndex:       1,
      }}
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VaultPage() {
  const [isDragging,        setIsDragging]        = useState(false);
  const [hasTransformed,    setHasTransformed]    = useState(false);
  const [showVaultText,     setShowVaultText]     = useState(false);
  const [showGallery,       setShowGallery]       = useState(false);

  // Refs hold mutable values that callbacks read — avoids stale closures
  const containerRef        = useRef<HTMLDivElement>(null);
  const hasTransformedRef   = useRef(false);
  const showGalleryRef      = useRef(false);
  const isDraggingRef       = useRef(false);
  const dragStartRef        = useRef({ x: 0, y: 0 });
  const moonOffsetRef       = useRef({ x: 0, y: 0 });
  const lightRef            = useRef(0);
  const rafRef              = useRef<number>(0);

  // Motion values — start at safe off-screen defaults, corrected in useEffect after mount
  const moonX = useMotionValue(120);
  const moonY = useMotionValue(300);

  // ── Snap orb to correct position after DOM is ready ──────────────────────
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Random X: left half only — east side is where the vault unlocks
    const minX = ORB_RADIUS + 20;
    const maxX = w * 0.45;
    // Random Y: below the nav, above the bottom edge
    const minY = NAV_HEIGHT + ORB_RADIUS + 20;
    const maxY = h - ORB_RADIUS - 20;
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    moonX.set(x);
    moonY.set(y);
  }, [moonX, moonY]);

  // ── Background ───────────────────────────────────────────────────────────

  const applyBackground = useCallback(() => {
    if (!containerRef.current || showGalleryRef.current) return;
    containerRef.current.style.background = buildGradient(
      moonX.get(),
      moonY.get(),
      lightRef.current,
    );
  }, [moonX, moonY]);

  // Set initial background on mount
  useEffect(() => {
    if (containerRef.current) {
      // Rich deep-blue night sky gradient — clearly indigo/blue, not grey
      containerRef.current.style.background =
        'radial-gradient(ellipse at 60% 20%, #1e2d6e 0%, #1A1F4B 45%, #0d1235 100%)';
    }
  }, []);

  // ── Transformation Sequence ───────────────────────────────────────────────

  const triggerTransformation = useCallback(() => {
    if (hasTransformedRef.current) return;
    hasTransformedRef.current = true;
    setHasTransformed(true);

    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / LIGHT_REVEAL_MS, 1);
      lightRef.current = easeInOutCubic(progress);
      applyBackground();

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShowVaultText(true), 400);
        setTimeout(() => {
          showGalleryRef.current = true;
          setShowGallery(true);
          // Reset background to flat indigo — no glow in the open vault
          if (containerRef.current) {
            containerRef.current.style.background = '#1A1F4B';
          }
        }, 1900);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [applyBackground]);

  // ── Drag Logic ────────────────────────────────────────────────────────────

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current  = true;
    dragStartRef.current   = { x: clientX, y: clientY };
    moonOffsetRef.current  = { x: moonX.get(), y: moonY.get() };
    setIsDragging(true);
  }, [moonX, moonY]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    const rawX = moonOffsetRef.current.x + (clientX - dragStartRef.current.x);
    const rawY = moonOffsetRef.current.y + (clientY - dragStartRef.current.y);

    // Clamp: prevent orb from going under nav or off any edge
    const x = Math.max(ORB_RADIUS, Math.min(width  - ORB_RADIUS, rawX));
    const y = Math.max(NAV_HEIGHT + ORB_RADIUS, Math.min(height - ORB_RADIUS, rawY));

    moonX.set(x);
    moonY.set(y);
    applyBackground();

    if (x > width * EAST_THRESHOLD) triggerTransformation();
  }, [moonX, moonY, applyBackground, triggerTransformation]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // Mouse handlers (attached inline on the orb)
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY);

  // Touch handlers (attached inline on the orb)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    handleDragStart(t.clientX, t.clientY);
  };

  // Global pointer listeners — registered once, stable via useCallback
  useEffect(() => {
    const onMouseMove  = (e: MouseEvent)  => handleDragMove(e.clientX, e.clientY);
    const onTouchMove  = (e: TouchEvent)  => {
      e.preventDefault(); // block page scroll while dragging the orb
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };

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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      style={{
        position:   'relative',
        width:      '100%',
        minHeight:  '100vh',
        background: '#1A1F4B', // replaced by applyBackground() on mount + every drag frame
        overflow:   'hidden',
        cursor:     isDragging ? 'grabbing' : 'default',
        touchAction:'none',
      }}
    >

      {/* ── Star canvas ──────────────────────────────────────────────────────── */}
      <StarCanvas visible={!showGallery} />

      {/* ── Main stage ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position:       'relative',
          maxWidth:       '1920px',
          margin:         '0 auto',
          width:          '100%',
          height:         '100vh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '0 clamp(20px, 5vw, 80px)',
        }}
      >

        {/* ── Draggable Orb (Moon → Sun) ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {!showGallery && (
            <motion.div
              key="celestial"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1,   scale: 1   }}
              exit={{ opacity: 0,      scale: 2   }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              style={{
                position:   'absolute',
                left:       moonX,
                top:        moonY,
                translateX: '-50%',
                translateY: '-50%',
                cursor:     isDragging ? 'grabbing' : 'grab',
                zIndex:     30,
                touchAction:'none',
                userSelect: 'none',
              }}
            >
              {/* Pulsing ring — makes the orb impossible to miss */}
              {!hasTransformed && (
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position:     'absolute',
                    inset:        '-20px',
                    borderRadius: '50%',
                    border:       '2px solid rgba(255,200,87,0.7)',
                    pointerEvents:'none',
                  }}
                />
              )}
              <motion.div
                animate={{
                  rotate: hasTransformed ? 360     : 0,
                  scale:  hasTransformed ? [1, 1.3, 1.5] : 1,
                }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width:    'clamp(72px, 16vw, 120px)',
                  height:   'clamp(72px, 16vw, 120px)',
                  position: 'relative',
                }}
              >
                {/* Orb */}
                <div
                  style={{
                    width:        '100%',
                    height:       '100%',
                    borderRadius: '50%',
                    background:   hasTransformed
                      ? 'radial-gradient(circle, #FFF8DC 0%, #FFC857 50%, #FFB347 100%)'
                      : 'radial-gradient(circle at 30% 30%, #F0F0F0 0%, #D8D7DB 50%, #A0A0A0 100%)',
                    boxShadow: hasTransformed
                      ? '0 0 30px rgba(255,200,87,0.55), 0 0 60px rgba(255,200,87,0.25)'
                      : '0 0 20px rgba(216,215,219,0.4), inset -10px -10px 30px rgba(0,0,0,0.2)',
                    transition: 'background 1s ease-out, box-shadow 1s ease-out',
                  }}
                />

                {/* Sun rays — appear after transformation */}
                {hasTransformed && Array.from({ length: 12 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: [0.6, 0.3, 0.6] }}
                    transition={{
                      scale:   { duration: 0.6, delay: i * 0.05 },
                      opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    style={{
                      position:        'absolute',
                      top:             '50%',
                      left:            '50%',
                      width:           'clamp(50px, 10vw, 80px)',
                      height:          '3px',
                      background:      'linear-gradient(90deg, #FFC857, transparent)',
                      transformOrigin: '0 50%',
                      transform:       `rotate(${i * 30}deg)`,
                      filter:          'blur(1px)',
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Compass ────────────────────────────────────────────────────── */}
        {!showGallery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: hasTransformed ? 0 : 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              zIndex:          10,
              display:         'flex',
              flexDirection:   'column',
              alignItems:      'center',
              pointerEvents:   'none',
            }}
          >
            {/* Compass SVG — scales fluidly via viewBox */}
            <svg
              viewBox="0 0 200 200"
              style={{
                width:  'clamp(140px, 40vw, 200px)',
                height: 'clamp(140px, 40vw, 200px)',
                filter: 'drop-shadow(0 4px 20px rgba(255,200,87,0.4))',
              }}
            >
              {/* Outer ring */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#FFC857" strokeWidth="2" opacity="0.3" />

              {/* Cardinal tick marks */}
              <line x1="100" y1="20"  x2="100" y2="30"  stroke="#FFC857" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="170" x2="100" y2="180" stroke="#FFC857" strokeWidth="2" opacity="0.6" />
              <line x1="20"  y1="100" x2="30"  y2="100" stroke="#FFC857" strokeWidth="2" opacity="0.6" />
              <line x1="170" y1="100" x2="180" y2="100" stroke="#FFC857" strokeWidth="2" opacity="0.6" />

              {/* N — full opacity */}
              <text x="100" y="14"  textAnchor="middle" fill="#FFC857" fontSize="15" fontWeight="bold" fontFamily="'Space Mono', monospace" opacity="1">N</text>
              {/* S */}
              <text x="100" y="198" textAnchor="middle" fill="#FFC857" fontSize="15" fontWeight="bold" fontFamily="'Space Mono', monospace" opacity="0.75">S</text>
              {/* W */}
              <text x="10"  y="104" textAnchor="middle" fill="#FFC857" fontSize="15" fontWeight="bold" fontFamily="'Space Mono', monospace" opacity="0.75">W</text>
              {/* E — destination, pulses */}
              <motion.text
                x="192" y="104"
                textAnchor="middle"
                fill="#FFC857"
                fontSize="16"
                fontWeight="bold"
                fontFamily="'Space Mono', monospace"
                animate={{ opacity: [1, 0.55, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >E</motion.text>

              {/* Compass arms — gentle breathing animation */}
              <motion.line
                x1="100" y1="100" x2="100" y2="30"
                stroke="#FFC857" strokeWidth="3" strokeLinecap="round"
                animate={{ rotate: [-15, -12, -15] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 100px' }}
              />
              <motion.line
                x1="100" y1="100" x2="100" y2="30"
                stroke="#FFC857" strokeWidth="3" strokeLinecap="round"
                animate={{ rotate: [15, 18, 15] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 100px' }}
              />

              {/* Centre pivot */}
              <circle cx="100" cy="100" r="5" fill="#FFC857" />

              {/* Pencil-tip bob */}
              <motion.polygon
                points="100,25 95,20 105,20"
                fill="#FFC857"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>

            {/* Hint quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              style={{
                marginTop:  '32px',
                textAlign:  'center',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize:   'clamp(1.05rem, 2.8vw, 1.35rem)',
                fontStyle:  'italic',
                fontWeight: 600,
                color:      '#FFC857',
                letterSpacing: '0.07em',
              }}
            >
              "The sun rises in the east."
            </motion.p>

            {/* Mobile drag hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 2, duration: 1 }}
              className="md:hidden"
              style={{
                marginTop:  '12px',
                textAlign:  'center',
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize:   '0.75rem',
                color:      '#FFC857',
                letterSpacing: '0.08em',
              }}
            >
              Drag the orb east to open the vault
            </motion.p>
          </motion.div>
        )}

        {/* ── "The Vault Awaits" reveal text ─────────────────────────────── */}
        <AnimatePresence>
          {showVaultText && !showGallery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1,   scale: 1   }}
              exit={{   opacity: 0,    scale: 1.1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position:  'absolute',
                top:       '50%',
                left:      '50%',
                translateX: '-50%',
                translateY: '-50%',
                textAlign: 'center',
                zIndex:    30,
                width:     '100%',
                padding:   '0 24px',
              }}
            >
              <h1
                style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:      'clamp(2.5rem, 8vw, 5rem)',
                  fontWeight:    300,
                  color:         '#FFF8DC',
                  letterSpacing: '0.15em',
                  textShadow:    '0 4px 40px rgba(255,200,87,0.6), 0 0 80px rgba(255,248,220,0.4)',
                  margin:        0,
                }}
              >
                The Vault Awaits
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Gallery ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              style={{
                position:  'absolute',
                inset:     0,
                padding:   'clamp(24px, 5vw, 80px)',
                overflowY: 'auto',
              }}
            >
              {/* Gallery header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1,  y: 0   }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 60px)' }}
              >
                <h2
                  style={{
                    fontFamily:    "'Cormorant Garamond', serif",
                    fontSize:      'clamp(2rem, 6vw, 3.5rem)',
                    fontWeight:    300,
                    color:         '#FFC857',
                    letterSpacing: '0.12em',
                    marginBottom:  '16px',
                    textShadow:    '0 2px 20px rgba(255,200,87,0.3)',
                  }}
                >
                  The Vault
                </h2>
                <p
                  style={{
                    fontFamily:    "'Source Sans 3', sans-serif",
                    fontSize:      'clamp(0.9rem, 2vw, 1.125rem)',
                    color:         'rgba(255,255,255,0.7)',
                    letterSpacing: '0.04em',
                    maxWidth:      '560px',
                    margin:        '0 auto',
                  }}
                >
                  A curated collection of experimental design work, hidden away until the light reveals its secrets.
                </p>
              </motion.div>

              {/* Gallery grid */}
              <div
                style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                  gap:                 'clamp(16px, 3vw, 32px)',
                  maxWidth:            '1400px',
                  margin:              '0 auto',
                }}
              >
                {GALLERY_DATA.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1,  y: 0  }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                    style={{
                      background:     'rgba(255,255,255,0.03)',
                      border:         '1px solid rgba(255,200,87,0.2)',
                      borderRadius:   '12px',
                      overflow:       'hidden',
                      cursor:         'pointer',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {/* Image */}
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width:      '100%',
                          height:     '100%',
                          objectFit:  'cover',
                          transition: 'transform 0.6s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)';    }}
                      />
                      <div
                        style={{
                          position:     'absolute',
                          inset:        0,
                          background:   'linear-gradient(to top, rgba(26,31,75,0.9) 0%, transparent 50%)',
                          pointerEvents:'none',
                        }}
                      />
                    </div>

                    {/* Meta */}
                    <div style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                      <div
                        style={{
                          fontFamily:    "'Space Mono', monospace",
                          fontSize:      '0.7rem',
                          color:         '#FFC857',
                          letterSpacing: '0.1em',
                          marginBottom:  '8px',
                          opacity:       0.7,
                        }}
                      >
                        {item.category.toUpperCase()}
                      </div>
                      <h3
                        style={{
                          fontFamily:    "'Cormorant Garamond', serif",
                          fontSize:      'clamp(1.4rem, 3vw, 1.75rem)',
                          color:         '#F6E6B4',
                          margin:        0,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}