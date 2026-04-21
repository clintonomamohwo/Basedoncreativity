import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './SEO';
import { ChronicleSectionBlock, FilterSidebar, GlitchCard, HeritagePattern, ModeToggle, MoonSvg, RippleCard, SunSvg } from './LibraryPageSections';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type LibraryMode    = 'reflection' | 'expression';
type MediumFilter   = 'all' | 'animation' | 'writing' | 'design';
type StatusFilter   = 'all' | 'active' | 'archived';

interface LibraryItem {
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

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────
const REFLECTION_ITEMS: LibraryItem[] = [
  {
    id: 'r1', mode: 'reflection', section: 'Folklore Studies',
    title: 'Oral Archive Vol. I',
    subtitle: 'Folklore Studies',
    medium: 'writing', status: 'archived', year: '2021',
    tools: ['Obsidian', 'Notion', 'Field Recorder'],
    description: 'A deep lexical excavation of West African oral traditions, transcribed, annotated, and cross-referenced across 40+ source texts.',
    imageUrl: 'https://images.unsplash.com/photo-1720701575003-51dafcf39cb4?w=600&q=80',
  },
  {
    id: 'r2', mode: 'reflection', section: 'Folklore Studies',
    title: 'Moon Glyph Studies',
    subtitle: 'Celestial Semiotics',
    medium: 'design', status: 'active', year: '2022',
    tools: ['Figma', 'Illustrator', 'Obsidian'],
    description: 'Mapping lunar symbolism across four civilisations (Akan, Mesopotamian, Maya, and Norse) into a unified visual grammar system.',
    imageUrl: 'https://images.unsplash.com/photo-1762385070022-c393b1e7272f?w=600&q=80',
  },
  {
    id: 'r3', mode: 'reflection', section: 'Character Design',
    title: 'Phantom Sketch Series',
    subtitle: 'Character Design',
    medium: 'design', status: 'archived', year: '2022',
    tools: ['Procreate', 'Maya', 'ZBrush'],
    description: 'Raw concept sketches for an animated mythology series, exploring liminal spirit characters between worlds of the living and ancestral.',
    imageUrl: 'https://images.unsplash.com/photo-1588411404261-6052062cb881?w=600&q=80',
  },
  {
    id: 'r4', mode: 'reflection', section: 'Character Design',
    title: 'Celestial Motion Lab',
    subtitle: 'Process & Research',
    medium: 'animation', status: 'active', year: '2023',
    tools: ['After Effects', 'Maya', 'UiPath'],
    description: 'Experimental motion studies exploring how celestial body physics can be translated into character movement and emotional timing.',
    imageUrl: 'https://images.unsplash.com/photo-1562869323-d3d7be3e88a6?w=600&q=80',
  },
  {
    id: 'r5', mode: 'reflection', section: 'Published Novellas',
    title: 'Manuscript: Dust & Thread',
    subtitle: 'Draft Archive',
    medium: 'writing', status: 'archived', year: '2021',
    tools: ['Scrivener', 'Final Draft', 'Grammarly'],
    description: 'The complete 7-draft evolution of the short fiction piece "Dust & Thread", annotated with editorial feedback across each iteration.',
    imageUrl: 'https://images.unsplash.com/photo-1677104165819-2e5ab9a0821f?w=600&q=80',
  },
  {
    id: 'r6', mode: 'reflection', section: 'Motion & Animation',
    title: 'UiPath Flow Diagrams',
    subtitle: 'Systems Research',
    medium: 'animation', status: 'active', year: '2023',
    tools: ['UiPath Studio', 'Visio', 'Lucidchart'],
    description: 'Automation workflow mapping for the creative production pipeline, bridging RPA logic with non-linear creative decision trees.',
    imageUrl: 'https://images.unsplash.com/photo-1737629917867-81fcadfe21cd?w=600&q=80',
  },
];

const EXPRESSION_ITEMS: LibraryItem[] = [
  {
    id: 'e1', mode: 'expression', section: 'Folklore Studies',
    title: 'Solstice Animations Vol. 1',
    subtitle: 'Published Animation',
    medium: 'animation', status: 'active', year: '2022',
    tools: ['After Effects', 'Cinema 4D'],
    description: 'An award-recognised 4-minute animated short portraying the solstice myth of the Akan people through fluid motion typography and particle systems.',
    imageUrl: 'https://images.unsplash.com/photo-1744528659009-2570248323f2?w=600&q=80',
  },
  {
    id: 'e2', mode: 'expression', section: 'Published Novellas',
    title: 'The Golden Hour',
    subtitle: 'Published Novella',
    medium: 'writing', status: 'active', year: '2023',
    tools: ['InDesign', 'Scrivener', 'Vellum'],
    description: 'A 92-page novella weaving Afrofuturist mythology with near-future speculative fiction. Shortlisted for the Nommo Award 2024.',
    imageUrl: 'https://images.unsplash.com/photo-1639014953962-1b965b50f352?w=600&q=80',
  },
  {
    id: 'e3', mode: 'expression', section: 'Character Design',
    title: 'Heritage Brand Identity',
    subtitle: 'Design System',
    medium: 'design', status: 'active', year: '2023',
    tools: ['Figma', 'Illustrator', 'Tokens Studio'],
    description: 'A complete visual identity system for a Pan-African luxury brand, marrying Adinkra symbolism with contemporary typographic architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1773024245335-2463a95dc54e?w=600&q=80',
  },
  {
    id: 'e4', mode: 'expression', section: 'Motion & Animation',
    title: 'Motion Reel 2024',
    subtitle: 'Showreel',
    medium: 'animation', status: 'active', year: '2024',
    tools: ['After Effects', 'Premiere Pro', 'DaVinci Resolve'],
    description: 'A 3-minute curated showreel demonstrating the full spectrum of motion work, from micro-interactions to full cinematic compositions.',
    imageUrl: 'https://images.unsplash.com/photo-1562869323-d3d7be3e88a6?w=600&q=80',
  },
  {
    id: 'e5', mode: 'expression', section: 'Published Novellas',
    title: 'Editorial: Celestial',
    subtitle: 'Print Publication',
    medium: 'writing', status: 'archived', year: '2022',
    tools: ['InDesign', 'Photoshop', 'Lightroom'],
    description: 'A limited-run editorial magazine dedicated to celestial aesthetics in African creative practice: 64 pages, hand-numbered, 500 copies.',
    imageUrl: 'https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?w=600&q=80',
  },
  {
    id: 'e6', mode: 'expression', section: 'Motion & Animation',
    title: 'Constellation Web Experience',
    subtitle: 'Interactive Installation',
    medium: 'design', status: 'active', year: '2024',
    tools: ['React', 'Three.js', 'GSAP', 'WebGL'],
    description: 'An immersive browser-based installation mapping 88 constellations onto 88 creative works, navigable via a real-time star chart interface.',
    imageUrl: 'https://images.unsplash.com/photo-1657812159077-90649115008c?w=600&q=80',
  },
];

const CHRONICLE_SECTIONS = ['Folklore Studies', 'Character Design', 'Published Novellas', 'Motion & Animation'];

// ─────────────────────────────────────────────────────────────────────────────
// CSS Animations (injected once)
// ─────────────────────────────────────────────────────────────────────────────
const CSS_ANIMATIONS = `
  @keyframes glitch-clip-a {
    0%,100%{clip-path:inset(3% 0 88% 0);transform:translateX(-5px) skewX(-2deg)}
    20%{clip-path:inset(24% 0 56% 0);transform:translateX(5px) skewX(2deg)}
    40%{clip-path:inset(56% 0 28% 0);transform:translateX(-4px) skewX(-1deg)}
    60%{clip-path:inset(76% 0 7% 0);transform:translateX(4px) skewX(1deg)}
    80%{clip-path:inset(40% 0 44% 0);transform:translateX(-5px) skewX(-2deg)}
  }
  @keyframes glitch-clip-b {
    0%,100%{clip-path:inset(50% 0 38% 0);transform:translateX(4px) skewX(2deg)}
    20%{clip-path:inset(70% 0 12% 0);transform:translateX(-4px) skewX(-2deg)}
    40%{clip-path:inset(16% 0 68% 0);transform:translateX(4px) skewX(1deg)}
    60%{clip-path:inset(1% 0 91% 0);transform:translateX(-4px) skewX(-1deg)}
    80%{clip-path:inset(86% 0 2% 0);transform:translateX(4px) skewX(2deg)}
  }
  @keyframes chromatic-rgb {
    0%,100%{filter:drop-shadow(3px 0 0 rgba(255,0,80,0.8)) drop-shadow(-3px 0 0 rgba(0,180,255,0.8))}
    33%{filter:drop-shadow(-3px 0 0 rgba(255,0,80,0.8)) drop-shadow(3px 0 0 rgba(0,180,255,0.8))}
    66%{filter:drop-shadow(0 3px 0 rgba(255,0,80,0.8)) drop-shadow(0 -3px 0 rgba(0,180,255,0.8))}
  }
  @keyframes scan-pass {
    0%{top:-4px;opacity:0.9}100%{top:100%;opacity:0.3}
  }
  @keyframes ripple-expand {
    0%{transform:scale(0.5);opacity:0.8}
    100%{transform:scale(3);opacity:0}
  }
  @keyframes chronicle-pulse {
    0%,100%{box-shadow:0 0 0 0 rgba(255,200,87,0.7)}
    50%{box-shadow:0 0 0 12px rgba(255,200,87,0)}
  }
  @keyframes chronicle-fill {
    from{transform:scaleY(0);transform-origin:top}
    to{transform:scaleY(1);transform-origin:top}
  }
  @keyframes mode-bg-shimmer {
    0%,100%{opacity:0.06}50%{opacity:0.12}
  }
  @keyframes grain-drift {
    0%,100%{transform:translate(0,0)}
    25%{transform:translate(-1%,1%)}
    50%{transform:translate(1%,-1%)}
    75%{transform:translate(-1%,-1%)}
  }
  .glitch-card:hover .glitch-layer-red {
    animation: glitch-clip-a 0.22s steps(1) infinite;
    opacity: 0.75 !important;
  }
  .glitch-card:hover .glitch-layer-blue {
    animation: glitch-clip-b 0.22s steps(1) infinite;
    opacity: 0.75 !important;
  }
  .glitch-card:hover .glitch-img-base {
    animation: chromatic-rgb 0.3s steps(1) infinite;
  }
  .glitch-card:hover .glitch-scan {
    animation: scan-pass 1s linear infinite;
  }
  .ripple-card:hover .ripple-r1 { animation: ripple-expand 1.8s ease-out infinite; }
  .ripple-card:hover .ripple-r2 { animation: ripple-expand 1.8s ease-out 0.6s infinite; }
  .ripple-card:hover .ripple-r3 { animation: ripple-expand 1.8s ease-out 1.2s infinite; }
  .chronicle-node-on { animation: chronicle-pulse 2s ease-in-out infinite; }
  .grain-overlay { animation: grain-drift 8s ease-in-out infinite; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Main Library Page
// ─────────────────────────────────────────────────────────────────────────────
export function LibraryPage() {
  const [mode, setMode]             = useState<LibraryMode>('reflection');
  const [medium, setMedium]         = useState<MediumFilter>('all');
  const [status, setStatus]         = useState<StatusFilter>('all');
  const [sidebarOpen, setSidebar]   = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [activeSection, setSection] = useState<string>(CHRONICLE_SECTIONS[0]);
  const [scrollPct, setScrollPct]   = useState(0);

  const isMoon = mode === 'reflection';

  // Track window scroll for the chronicle fill
  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) { setScrollPct(0); return; }
      setScrollPct(Math.min(1, Math.max(0, window.scrollY / total)));
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSectionVisible = useCallback((name: string) => {
    setSection(name);
  }, []);

  // Filter items
  const allItems = isMoon ? REFLECTION_ITEMS : EXPRESSION_ITEMS;
  const filtered = allItems.filter(item => {
    if (medium !== 'all' && item.medium !== medium) return false;
    if (status  !== 'all' && item.status !== status)  return false;
    return true;
  });

  // Group filtered items by section
  const grouped = CHRONICLE_SECTIONS.reduce<Record<string, LibraryItem[]>>((acc, sec) => {
    acc[sec] = filtered.filter(item => item.section === sec);
    return acc;
  }, {});

  // Theme tokens
  const pageBg = isMoon
    ? 'linear-gradient(160deg, #0a0e1a 0%, #0d1117 40%, #111827 100%)'
    : 'linear-gradient(160deg, #FFF9E8 0%, #F6E6B4 40%, #FFF3CC 100%)';
  const headerBg = isMoon
    ? 'rgba(10,14,26,0.88)'
    : 'rgba(254,253,246,0.88)';
  const headerBorder = isMoon
    ? 'rgba(255,200,87,0.2)'
    : 'rgba(26,31,75,0.15)';
  const textPrimary = isMoon ? '#D8D7DB' : '#1A1F4B';
  const textMuted   = isMoon ? '#717182' : '#8a8890';
  const accentColor = isMoon ? '#FFC857' : '#B8860B';
  const chronicleBg = isMoon ? 'rgba(255,200,87,0.1)' : 'rgba(26,31,75,0.1)';
  const chronicleFill = isMoon
    ? 'linear-gradient(to bottom, #FFC857, #FFD88A)'
    : 'linear-gradient(to bottom, #B8860B, #FFC857)';

  return (
    <>
      <SEO title="Library | Based on Creativity" description="Explore the Based on Creativity library of reflections, expressions, and curated creative work across mediums and themes." path="/library" />
      {/* Inject animations once */}
      <style dangerouslySetInnerHTML={{ __html: CSS_ANIMATIONS }} />

      <div
        className="relative w-full"
        style={{
          minHeight: '100vh',
          background: pageBg,
          transition: 'background 0.7s ease',
          paddingTop: '64px', // offset for the fixed navigation bar
        }}
      >
        {/* Heritage pattern background */}
        <HeritagePattern mode={mode} />

        {/* ── STICKY HEADER ─────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-40 backdrop-blur-xl"
          style={{
            background: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
            transition: 'background 0.5s ease, border-color 0.5s ease',
          }}
        >
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4 justify-between">
            {/* Left: sidebar toggle + title */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setSidebar(p => !p)}
                className="flex flex-col gap-1.5 p-2 rounded-lg"
                style={{
                  background: sidebarOpen ? `${accentColor}18` : 'transparent',
                  border: `1px solid ${sidebarOpen ? accentColor + '40' : 'transparent'}`,
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.94 }}
                title="Toggle sidebar"
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    style={{ height: 1.5, background: accentColor, borderRadius: 2 }}
                    animate={{ width: i === 1 ? (sidebarOpen ? 14 : 20) : 20 }}
                    transition={{ duration: 0.25 }}
                  />
                ))}
              </motion.button>

              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: textMuted, letterSpacing: '0.16em', marginBottom: 1 }}>
                  BASED ON CREATIVITY: ARCHIVE
                </p>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: textPrimary, lineHeight: 1 }}>
                  {isMoon ? 'The Reflection Library' : 'The Expression Library'}
                </h1>
              </div>
            </div>

            {/* Centre: Chronicle progress */}
            <div className="hidden md:flex items-center gap-3">
              {CHRONICLE_SECTIONS.map(sec => (
                <motion.button
                  key={sec}
                  onClick={() => {
                    const el = document.getElementById(`section-${sec.replace(/\s/g, '-').toLowerCase()}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    color: activeSection === sec ? accentColor : textMuted,
                    background: activeSection === sec ? `${accentColor}14` : 'transparent',
                    border: `1px solid ${activeSection === sec ? accentColor + '40' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {sec}
                </motion.button>
              ))}
            </div>

            {/* Right: mode toggle + count */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: accentColor, lineHeight: 1 }}>
                  {filtered.length}
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: textMuted, letterSpacing: '0.1em' }}>WORKS</p>
              </div>
              <ModeToggle mode={mode} onToggle={() => setMode(m => m === 'reflection' ? 'expression' : 'reflection')} />
            </div>
          </div>
        </header>

        {/* ── PAGE HERO BAND ─────────────────────────────────────────────── */}
        <motion.div
          className="relative z-10 overflow-hidden"
          style={{ borderBottom: `1px solid ${headerBorder}` }}
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10 md:py-16 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
            {/* Mode icon + text */}
            <div className="flex items-center gap-6">
              <motion.div
                className="flex-shrink-0 rounded-full flex items-center justify-center"
                style={{
                  width: 80, height: 80,
                  background: isMoon
                    ? 'radial-gradient(circle at 30% 30%, #1e2a4a, #0a0e1a)'
                    : 'radial-gradient(circle at 70% 30%, #FFF3CC, #F6E6B4)',
                  border: `2px solid ${accentColor}40`,
                  boxShadow: isMoon
                    ? `0 0 30px rgba(255,200,87,0.2), inset 0 0 20px rgba(255,200,87,0.05)`
                    : `0 0 30px rgba(255,200,87,0.4), inset 0 0 20px rgba(255,200,87,0.1)`,
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              >
                {isMoon
                  ? <MoonSvg size={36} active />
                  : <SunSvg size={36} active />
                }
              </motion.div>
              <div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  color: textPrimary,
                  lineHeight: 1.1,
                  fontStyle: 'italic',
                }}>
                  {isMoon ? '"The Reflection"' : '"The Expression"'}
                </h2>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: textMuted, fontSize: '0.9rem', marginTop: 6, maxWidth: 380 }}>
                  {isMoon
                    ? 'Research sketches, raw ideas, process documentation, and the archaeology of making: the unfinished world beneath the work.'
                    : 'Finished animations, published novellas, completed design systems, and the full expression of creative vision brought into the world.'
                  }
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-6 md:gap-10">
              {[
                { label: 'SECTIONS', value: CHRONICLE_SECTIONS.length },
                { label: 'WORKS', value: allItems.length },
                { label: isMoon ? 'ARCHIVED' : 'ACTIVE', value: allItems.filter(i => i.status === (isMoon ? 'archived' : 'active')).length },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: accentColor, lineHeight: 1 }}>
                    {stat.value}
                  </p>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: textMuted, letterSpacing: '0.14em', marginTop: 2 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── MAIN LAYOUT: SIDEBAR + CONTENT ─────────────────────────────── */}
        <div className="relative z-10 flex max-w-screen-2xl mx-auto">

          {/* Filter Sidebar */}
          <FilterSidebar
            mode={mode}
            medium={medium}
            status={status}
            onMedium={setMedium}
            onStatus={setStatus}
            isOpen={sidebarOpen}
            totalItems={allItems.length}
            filteredCount={filtered.length}
          />

          {/* ── CONTENT AREA ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 relative">
            <div className="relative flex">

              {/* ── CHRONICLE VERTICAL LINE ─────────────────────────────── */}
              <div
                className="hidden lg:block flex-shrink-0 relative"
                style={{ width: 40, marginLeft: 16, marginRight: 8 }}
              >
                <div className="sticky top-[64px] flex justify-center" style={{ height: 'calc(100vh - 64px)' }}>
                  <div className="relative flex flex-col items-center h-full py-8">
                    {/* Track (unfilled) */}
                    <div
                      className="absolute inset-x-0 top-8 bottom-8 mx-auto rounded-full"
                      style={{ width: 2, background: chronicleBg }}
                    />
                    {/* Filled portion */}
                    <motion.div
                      className="absolute top-8 mx-auto rounded-full"
                      style={{
                        width: 2,
                        background: chronicleFill,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        boxShadow: `0 0 8px ${accentColor}60`,
                      }}
                      animate={{ height: `${Math.min(95, scrollPct * 100)}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    {/* Section node dots */}
                    {CHRONICLE_SECTIONS.map((sec, i) => {
                      const pct = (i / (CHRONICLE_SECTIONS.length - 1));
                      const isActive = activeSection === sec;
                      return (
                        <motion.button
                          key={sec}
                          title={sec}
                          className={`absolute rounded-full border-2 transition-all duration-500 ${isActive ? 'chronicle-node-on' : ''}`}
                          style={{
                            width: isActive ? 12 : 8,
                            height: isActive ? 12 : 8,
                            top: `calc(2rem + ${pct * (100 - 4)}%)`,
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: isActive ? accentColor : chronicleBg,
                            borderColor: isActive ? accentColor : `${accentColor}40`,
                            cursor: 'pointer',
                            zIndex: 10,
                          }}
                          onClick={() => {
                            const el = document.getElementById(`section-${sec.replace(/\s/g, '-').toLowerCase()}`);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          whileHover={{ scale: 1.5 }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── SECTIONS & CARDS ────────────────────────────────────── */}
              <div className="flex-1 min-w-0 px-4 md:px-6 lg:px-4 py-10 space-y-16">

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-16"
                  >
                    {CHRONICLE_SECTIONS.map((sec, idx) => {
                      const sectionItems = grouped[sec] ?? [];
                      if (sectionItems.length === 0 && (medium !== 'all' || status !== 'all')) return null;
                      return (
                        <ChronicleSectionBlock
                          key={sec}
                          sectionName={sec}
                          sectionIndex={idx}
                          totalSections={CHRONICLE_SECTIONS.length}
                          mode={mode}
                          onVisible={handleSectionVisible}
                        >
                          {sectionItems.length === 0 ? (
                            <motion.div
                              className="rounded-xl py-12 text-center"
                              style={{
                                border: `1px dashed ${accentColor}30`,
                                background: `${accentColor}06`,
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: textMuted, fontStyle: 'italic' }}>
                                No works match the current filters in this section.
                              </p>
                            </motion.div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                              {sectionItems.map(item =>
                                isMoon
                                  ? <GlitchCard key={item.id} item={item} />
                                  : <RippleCard key={item.id} item={item} />
                              )}
                            </div>
                          )}
                        </ChronicleSectionBlock>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* ── BOTTOM QUOTE ──────────────────────────────────────── */}
                <motion.div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: isMoon
                      ? 'linear-gradient(135deg, rgba(26,31,75,0.4) 0%, rgba(45,45,45,0.3) 100%)'
                      : 'linear-gradient(135deg, rgba(246,230,180,0.6) 0%, rgba(255,243,204,0.5) 100%)',
                    border: `1px solid ${accentColor}25`,
                    padding: '3rem 2rem',
                  }}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {/* Large background quotation mark */}
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute', top: '-0.5rem', left: '1.5rem',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '10rem',
                      color: accentColor,
                      opacity: 0.08,
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >"</span>

                  <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                      fontStyle: 'italic',
                      color: textPrimary,
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                    }}>
                      {isMoon
                        ? 'The archive is not a grave; it is a living library of becoming, where every sketch holds the seed of a world not yet made.'
                        : 'What is expressed is not finished; it is released into the world to take root, grow, and become something beyond its maker.'
                      }
                    </p>
                    <div style={{ height: 1, width: 60, background: accentColor, margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: textMuted, letterSpacing: '0.14em' }}>
                      BASED ON CREATIVITY, {isMoon ? 'THE REFLECTION CODEX' : 'THE EXPRESSION CODEX'}
                    </p>
                  </div>
                </motion.div>

                <div className="h-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
