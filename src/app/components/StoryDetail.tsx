import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { CloudinaryImage } from './CloudinaryImage';

// ─── Story Data ────────────────────────────────────────────────────────────────

// Typed interfaces replace `any` for full type safety
interface StorySection {
  type: 'text' | 'image';
  content?: string;
  publicId?: string;
  caption?: string;
}

interface Story {
  title: string;
  subtitle: string;
  author: string;
  heroImage: string;
  sections: StorySection[];
}

const storyData: Record<string, Story> = {
  'the-moon-listener': {
    title: 'The Moon Listener',
    subtitle: 'A tale of silence and connection',
    author: 'Based on Creativity',
    heroImage: 'stories/moon-listener-hero',
    sections: [
      { type: 'text', content: `In a village where everyone spoke constantly, there lived a girl who preferred to listen. While others filled the air with words, she filled her heart with the quiet songs of the world.` },
      { type: 'image', publicId: 'stories/moon-listener-1', caption: 'She spent her evenings on the hill, listening.' },
      { type: 'text', content: `Each night, she climbed the hill beyond the village and sat beneath the vast sky. She listened to the wind's whispers, the rustle of leaves, and the distant calls of night birds. But most of all, she listened to the moon.` },
      { type: 'text', content: `The villagers thought her strange. "What could the moon possibly say?" they asked. But she knew better. The moon spoke in silvery silence, in the gentle pull of tides, in the way shadows danced across meadows.` },
      { type: 'image', publicId: 'stories/moon-listener-2', caption: "The moon's light painted stories across the land." },
      { type: 'text', content: `One night, as she sat in her usual spot, the moon seemed brighter than ever. Its light fell upon her like a benediction, and in that moment, she understood: the moon had been listening to her, too.` },
      { type: 'text', content: `Silence, she realized, was not emptiness. It was the space where understanding lived, where hearts could hear each other across impossible distances. The moon had taught her the oldest lesson: true connection requires not just speaking, but the courage to be still.` },
      { type: 'image', publicId: 'stories/moon-listener-3', caption: 'And so she listened, and the world spoke back.' },
    ],
  },
  'the-compass-dream': {
    title: 'The Compass Dream',
    subtitle: 'Finding true north within',
    author: 'Based on Creativity',
    heroImage: 'stories/compass-dream-hero',
    sections: [
      { type: 'text', content: `The compass arrived on a Tuesday, wrapped in brown paper and tied with twine. No return address. No note. Just the compass, its brass surface worn smooth by time and touch.` },
      { type: 'image', publicId: 'stories/compass-dream-1', caption: 'A compass that pointed to something more than north.' },
      { type: 'text', content: `At first, Marcus thought it was broken. The needle spun wildly, never settling, never pointing true north. But each night, in his dreams, he saw where it led: a path through forests he'd never walked, across rivers he'd never crossed, to a horizon he couldn't name.` },
      { type: 'text', content: `"Follow it," the dreams whispered. But how do you follow a compass that refuses to point anywhere?` },
      { type: 'image', publicId: 'stories/compass-dream-2', caption: 'The journey began with a single step.' },
      { type: 'text', content: `One morning, Marcus packed a small bag and left. He didn't know where he was going, but the compass felt warm in his pocket, and the dreams felt true in his heart. He walked without maps, trusting the pull of something he couldn't explain.` },
      { type: 'text', content: `Days became weeks. The compass never steadied, but Marcus began to understand: it wasn't pointing to a place. It was pointing to a feeling, the feeling of moving toward his truest self, the self he'd been too afraid to become.` },
      { type: 'image', publicId: 'stories/compass-dream-3', caption: 'True north was inside him all along.' },
      { type: 'text', content: `When he finally stopped walking, the compass stopped spinning. It pointed directly at his heart. And Marcus understood: the journey wasn't about finding a destination. It was about finding the courage to trust his own direction.` },
    ],
  },
  'a-quiet-spark': {
    title: 'A Quiet Spark',
    subtitle: 'Small beginnings, infinite potential',
    author: 'Based on Creativity',
    heroImage: 'stories/quiet-spark-hero',
    sections: [
      { type: 'text', content: `It began as the smallest thing: a thought, barely a whisper, in the back of her mind. Elena almost ignored it. Almost.` },
      { type: 'image', publicId: 'stories/quiet-spark-1', caption: 'Every great thing begins with a spark.' },
      { type: 'text', content: `The thought was simple: "What if I tried?" Four words that changed everything. What if she tried to paint again? What if she tried to create the art she'd dreamed of but never dared to make?` },
      { type: 'text', content: `The first stroke of paint was terrifying. Her hand shook. The color seemed wrong. But she kept going, because the spark had become a flame, and flames need fuel to burn.` },
      { type: 'image', publicId: 'stories/quiet-spark-2', caption: 'Small steps, brave hearts.' },
      { type: 'text', content: `Days turned into weeks of painting. Some pieces were beautiful. Some were disasters. But each one taught her something, and the quiet spark that had started in her mind now blazed in her studio, illuminating corners of herself she'd forgotten existed.` },
      { type: 'text', content: `A year later, her first exhibition opened. Friends and strangers stood before her work, moved by what they saw. But Elena knew the truth: the paintings weren't the miracle. The miracle was the spark, and the courage to let it grow.` },
      { type: 'image', publicId: 'stories/quiet-spark-3', caption: 'From spark to flame to light for others.' },
    ],
  },
  'fragments-of-light': {
    title: 'Fragments of Light',
    subtitle: 'Stories from the in-between',
    author: 'Based on Creativity',
    heroImage: 'stories/fragments-hero',
    sections: [
      { type: 'text', content: `There are moments that slip between the seconds, brief, luminous, easily missed. This is a collection of those moments: fragments of light caught in the ordinary hours of living.` },
      { type: 'image', publicId: 'stories/fragments-1', caption: 'Light finds its way through the cracks.' },
      { type: 'text', content: `Fragment One: The way coffee steams in morning light, spiraling upward like tiny galaxies being born. You've seen it a thousand times, but this morning, you really see it. The universe in a cup.` },
      { type: 'text', content: `Fragment Two: A stranger's smile on the subway. No words exchanged, just recognition, two humans acknowledging each other in the midst of the crowd. It lasts three seconds and fills your whole day.` },
      { type: 'image', publicId: 'stories/fragments-2', caption: 'Beauty lives in the pauses.' },
      { type: 'text', content: `Fragment Three: The pause between exhale and inhale, where everything stops and nothing hurts. You discover it during meditation, but it exists in every breath you've ever taken. Peace was always this close.` },
      { type: 'text', content: `Fragment Four: Your grandmother's laughter, caught on an old recording. She's been gone for years, but here she is, alive in sound waves, her joy still echoing through time.` },
      { type: 'image', publicId: 'stories/fragments-3', caption: 'We are made of these moments.' },
    ],
  },
  'the-clockmakers-tale': {
    title: "The Clockmaker's Tale",
    subtitle: 'Time, craft, and patience',
    author: 'Based on Creativity',
    heroImage: 'stories/clockmaker-hero',
    sections: [
      { type: 'text', content: `Old Heinrich had been making clocks for sixty years. Each one took months to complete, gears cut by hand, springs wound with precision, faces painted with infinite care.` },
      { type: 'image', publicId: 'stories/clockmaker-1', caption: 'Each gear, a testament to patience.' },
      { type: 'text', content: `People often asked why he didn't use machines, why he didn't speed things up. Heinrich would smile and say, "A clock measures time. Shouldn't its creation be worthy of what it measures?"` },
      { type: 'text', content: `His workshop smelled of oil and old wood. Sunlight streamed through windows, catching on brass gears and making them glow like small suns. This was his cathedral, his meditation, his prayer.` },
      { type: 'image', publicId: 'stories/clockmaker-2', caption: 'Craftsmanship is love made visible.' },
      { type: 'text', content: `One day, a young woman entered his shop. "Teach me," she said. Heinrich saw the hurry in her eyes, the impatience of youth. But he also saw something else: hunger. Not for speed, but for meaning.` },
      { type: 'text', content: `They worked side by side for three years. He taught her that the first virtue of craft is patience. The second is attention. The third is love. Everything else follows from these.` },
      { type: 'image', publicId: 'stories/clockmaker-3', caption: 'Time teaches those who listen.' },
      { type: 'text', content: `When her first clock was complete, she understood: she hadn't just made a timepiece. She had learned to value time itself, to see the sacred in the slow, careful work of making something true.` },
    ],
  },
  'the-last-voyage': {
    title: 'The Last Voyage',
    subtitle: 'An ending is just a beginning',
    author: 'Based on Creativity',
    heroImage: 'stories/last-voyage-hero',
    sections: [
      { type: 'text', content: `The ship was called the Evening Star, and it had sailed every ocean, survived every storm. Now, after fifty years of service, it would make its final voyage.` },
      { type: 'image', publicId: 'stories/last-voyage-1', caption: 'Every ending carries its own grace.' },
      { type: 'text', content: `Captain Sarah stood at the wheel, feeling the familiar weight of wood beneath her palms. She had grown old with this ship, learned the sea's moods through its creaking boards and singing rigging.` },
      { type: 'text', content: `The crew had planned a final journey: one last crossing to the island where the Evening Star was born. They would sail her home, then watch as she was carefully dismantled, her wood repurposed for new vessels, new dreams.` },
      { type: 'image', publicId: 'stories/last-voyage-2', caption: 'The sea remembers all who sail her.' },
      { type: 'text', content: `As they approached the island, Sarah felt not sadness but gratitude. The ship had carried them safely through countless journeys. It had been their home, their sanctuary, their companion in solitude and storm.` },
      { type: 'text', content: `"Nothing truly ends," the old shipwright said when they arrived. "The Evening Star will live in every vessel built from her timbers. She'll sail on, just in new forms, on new seas."` },
      { type: 'image', publicId: 'stories/last-voyage-3', caption: 'Transformation, not termination.' },
      { type: 'text', content: `That night, Sarah dreamed of ships. Dozens of them, hundreds, all carrying a piece of the Evening Star. And she understood: endings are illusions. Everything we love continues, transformed, becoming part of new stories yet to be told.` },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Renders the content of a single section (text or image) inside a book page
function PageContent({ section }: { section: StorySection | null }) {
  if (!section) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '1px', background: 'rgba(139,115,85,0.5)', margin: '0 auto 1.5rem' }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontStyle: 'italic', color: '#8B7355' }}>
            The End
          </p>
          <div style={{ width: '48px', height: '1px', background: 'rgba(139,115,85,0.5)', margin: '1.5rem auto 0' }} />
        </div>
      </div>
    );
  }

  if (section.type === 'image') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
        <div style={{ flex: 1, width: '100%', overflow: 'hidden', borderRadius: '4px', maxHeight: '82%' }}>
          <CloudinaryImage
            publicId={section.publicId}
            alt={section.caption || ''}
            cloudinaryOptions={{ width: 600, fit: 'fill' }}
            className="w-full h-full object-cover"
          />
        </div>
        {section.caption && (
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.78rem',
            color: '#8B7355',
            fontStyle: 'italic',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            {section.caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', overflow: 'auto' }}>
      <p style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
        color: '#2D2D2D',
        lineHeight: 1.85,
        textAlign: 'justify',
        margin: 0,
      }}>
        {section.content}
      </p>
    </div>
  );
}

// A full book page with decorative border, header line, page number
function BookPage({
  section,
  pageNum,
  isLeft,
}: {
  section: StorySection | null;
  pageNum: number;
  isLeft: boolean;
}) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: isLeft ? '#FFF6D8' : '#F6E6B4',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 2rem 3rem',
    }}>
      {/* Inset decorative border */}
      <div style={{
        position: 'absolute',
        top: '10px',
        bottom: '10px',
        left: '10px',
        right: '10px',
        border: '1px solid rgba(139,115,85,0.13)',
        pointerEvents: 'none',
        borderRadius: '2px',
      }} />

      {/* Top ornament line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(139,115,85,0.35), transparent)',
        marginBottom: '1.25rem',
        flexShrink: 0,
      }} />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <PageContent section={section} />
      </div>

      {/* Bottom ornament line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(139,115,85,0.25), transparent)',
        marginTop: '1rem',
        flexShrink: 0,
      }} />

      {/* Page number */}
      <div style={{
        position: 'absolute',
        bottom: '0.75rem',
        ...(isLeft ? { left: '50%', transform: 'translateX(-50%)' } : { right: '50%', transform: 'translateX(50%)' }),
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '0.75rem',
        color: '#8B7355',
        fontStyle: 'italic',
        zIndex: 1,
        userSelect: 'none',
      }}>
        {pageNum}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StoryDetail() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [storybookMode, setStorybookMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Desktop spread state
  const [spreadIdx, setSpreadIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next');
  const [targetSpreadIdx, setTargetSpreadIdx] = useState(0);

  // Mobile single-page state
  const [mobilePageIdx, setMobilePageIdx] = useState(0);
  const [targetMobileIdx, setTargetMobileIdx] = useState(0);

  // Responsive
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Touch tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const story = storyId ? storyData[storyId] : null;

  // Group sections into two-page spreads
  const spreads = useMemo(() => {
    if (!story) return [];
    const result: [StorySection | null, StorySection | null][] = [];
    for (let i = 0; i < story.sections.length; i += 2) {
      result.push([story.sections[i], story.sections[i + 1] ?? null]);
    }
    return result;
  }, [story]);

  const totalMobilePages = story?.sections.length ?? 0;

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    if (isMobile) {
      if (mobilePageIdx < totalMobilePages - 1) {
        setFlipDir('next');
        setTargetMobileIdx(mobilePageIdx + 1);
        setIsAnimating(true);
      }
    } else {
      if (spreadIdx < spreads.length - 1) {
        setFlipDir('next');
        setTargetSpreadIdx(spreadIdx + 1);
        setIsAnimating(true);
      }
    }
  }, [isAnimating, isMobile, mobilePageIdx, totalMobilePages, spreadIdx, spreads.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    if (isMobile) {
      if (mobilePageIdx > 0) {
        setFlipDir('prev');
        setTargetMobileIdx(mobilePageIdx - 1);
        setIsAnimating(true);
      }
    } else {
      if (spreadIdx > 0) {
        setFlipDir('prev');
        setTargetSpreadIdx(spreadIdx - 1);
        setIsAnimating(true);
      }
    }
  }, [isAnimating, isMobile, mobilePageIdx, spreadIdx]);

  const handleFlipComplete = useCallback(() => {
    if (isMobile) {
      setMobilePageIdx(targetMobileIdx);
    } else {
      setSpreadIdx(targetSpreadIdx);
    }
    setIsAnimating(false);
  }, [isMobile, targetMobileIdx, targetSpreadIdx]);

  // Keyboard navigation — dependency array prevents listener accumulation on re-renders
  useEffect(() => {
    if (!storybookMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [storybookMode, handleNext, handlePrev]);

  // Touch / swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 48 && dy < 80) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
  };

  // Reset on mode toggle
  const toggleStorybook = () => {
    setStorybookMode(v => !v);
    setSpreadIdx(0);
    setMobilePageIdx(0);
    setIsAnimating(false);
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-[#1A1F4B] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Story not found</h2>
          <button onClick={() => navigate('/stories')} className="text-[#FFC857] hover:underline">
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  // ── Derived values for desktop spread flip ────────────────────────────────

  // Static page content (instantly swaps to target content, hidden under flip)
  const leftSection = isAnimating && flipDir === 'prev'
    ? spreads[targetSpreadIdx]?.[0]
    : spreads[spreadIdx]?.[0];

  const rightSection = isAnimating && flipDir === 'next'
    ? spreads[targetSpreadIdx]?.[1]
    : spreads[spreadIdx]?.[1];

  // Flipping page faces
  const flipFrontSection = flipDir === 'next'
    ? spreads[spreadIdx]?.[1]   // current right page
    : spreads[spreadIdx]?.[0];  // current left page

  const flipBackSection = flipDir === 'next'
    ? spreads[targetSpreadIdx]?.[0]   // next left page (on back)
    : spreads[targetSpreadIdx]?.[1];  // prev right page (on back)

  // Page numbers
  const leftPageNum = spreadIdx * 2 + 1;
  const rightPageNum = spreadIdx * 2 + 2;
  const flipFrontPageNum = flipDir === 'next' ? spreadIdx * 2 + 2 : spreadIdx * 2 + 1;
  const flipBackPageNum = flipDir === 'next' ? targetSpreadIdx * 2 + 1 : targetSpreadIdx * 2 + 2;

  // Mobile page content
  const mobileCurrent = story.sections[mobilePageIdx];
  const mobileTarget = story.sections[targetMobileIdx];
  const mobileStaticSection = isAnimating ? mobileTarget : mobileCurrent;

  // ── Navigation helpers ────────────────────────────────────────────────────

  const canGoPrev = isMobile ? mobilePageIdx > 0 : spreadIdx > 0;
  const canGoNext = isMobile
    ? mobilePageIdx < totalMobilePages - 1
    : spreadIdx < spreads.length - 1;

  const pageLabel = isMobile
    ? `Page ${mobilePageIdx + 1} of ${totalMobilePages}`
    : `${spreadIdx * 2 + 1}-${Math.min(spreadIdx * 2 + 2, story.sections.length)} of ${story.sections.length}`;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-[#1A1F4B] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F4B] via-[#0f1228] to-[#1A1F4B]" />
        <GrainOverlay />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/stories')}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 transition-colors"
        style={{
          color: 'rgba(255,255,255,0.6)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FFC857')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
      >
        <ArrowLeft size={16} />
        BACK TO LIBRARY
      </motion.button>

      {/* Storybook mode toggle */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={toggleStorybook}
        className="fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border transition-all"
        style={{
          borderColor: storybookMode ? '#FFC857' : 'rgba(255,200,87,0.3)',
          background: storybookMode ? 'rgba(255,200,87,0.15)' : 'rgba(255,200,87,0.05)',
          color: storybookMode ? '#FFC857' : 'rgba(255,255,255,0.6)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          cursor: 'pointer',
        }}
      >
        <BookOpen size={14} />
        {storybookMode ? 'READING MODE' : 'STORYBOOK MODE'}
      </motion.button>

      {/* ── Regular reading mode ── */}
      {!storybookMode ? (
        <div ref={contentRef} className="relative z-20 max-w-[800px] mx-auto px-4 md:px-6 pt-28 pb-24 md:pt-32 md:pb-32">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 md:mb-12 rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
          >
            <CloudinaryImage
              publicId={story.heroImage}
              alt={story.title}
              cloudinaryOptions={{ width: 1200, height: 600, fit: 'fill' }}
              className="w-full h-auto"
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 md:mb-16 text-center"
          >
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.75rem, 6vw, 4rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.2, marginBottom: '12px' }}>
              {story.title}
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(0.9375rem, 3vw, 1.125rem)', color: 'rgba(255,200,87,0.7)', fontStyle: 'italic', marginBottom: '8px' }}>
              {story.subtitle}
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
              by {story.author.toUpperCase()}
            </p>
          </motion.div>

          {/* Story sections */}
          <div className="space-y-12">
            {story.sections.map((section: StorySection, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
              >
                {section.type === 'text' ? (
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(0.9375rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, textAlign: 'justify' }}>
                    {section.content}
                  </p>
                ) : (
                  <div className="my-16">
                    <div className="rounded-xl overflow-hidden mb-4">
                      <CloudinaryImage
                        publicId={section.publicId}
                        alt={section.caption}
                        cloudinaryOptions={{ width: 1000, fit: 'fill' }}
                        className="w-full h-auto"
                      />
                    </div>
                    {section.caption && (
                      <p className="text-center" style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.9rem', color: 'rgba(255,200,87,0.5)', fontStyle: 'italic' }}>
                        {section.caption}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* End decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-20 text-center"
          >
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,200,87,0.3)', margin: '0 auto' }} />
          </motion.div>
        </div>

      ) : (
        // ── Storybook mode ──
        <div
          className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-28 md:py-24"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Story title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8"
          >
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
              {story.title}
            </p>
          </motion.div>

          {/* ── MOBILE: Single-page card flip ── */}
          {isMobile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[420px]"
            >
              <div style={{
                perspective: '1200px',
                position: 'relative',
                minHeight: '60vh',
              }}>
                {/* Static page (shows target content, revealed by flip) */}
                <div style={{
                  position: 'relative',
                  minHeight: '60vh',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
                }}>
                  <div style={{
                    background: (isAnimating ? targetMobileIdx : mobilePageIdx) % 2 === 0 ? '#FFF6D8' : '#F6E6B4',
                    minHeight: '60vh',
                    padding: '2rem 1.75rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}>
                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,115,85,0.35), transparent)', marginBottom: '1.25rem' }} />
                    <div style={{ flex: 1 }}>
                      <PageContent section={mobileStaticSection} />
                    </div>
                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,115,85,0.25), transparent)', marginTop: '1rem' }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '0.75rem',
                      color: '#8B7355',
                      fontStyle: 'italic',
                      userSelect: 'none',
                    }}>
                      {(isAnimating ? targetMobileIdx : mobilePageIdx) + 1}
                    </div>
                  </div>
                </div>

                {/* Flipping page (covers static, animates away) */}
                {isAnimating && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transformStyle: 'preserve-3d',
                      transformOrigin: flipDir === 'next' ? 'left center' : 'right center',
                      zIndex: 20,
                      borderRadius: '12px',
                    }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: flipDir === 'next' ? -180 : 180 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    onAnimationComplete={handleFlipComplete}
                  >
                    {/* Front face: current page */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      background: mobilePageIdx % 2 === 0 ? '#FFF6D8' : '#F6E6B4',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      padding: '2rem 1.75rem 3rem',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,115,85,0.35), transparent)', marginBottom: '1.25rem' }} />
                      <div style={{ flex: 1 }}>
                        <PageContent section={mobileCurrent} />
                      </div>
                      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,115,85,0.25), transparent)', marginTop: '1rem' }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '0.75rem',
                        color: '#8B7355',
                        fontStyle: 'italic',
                        userSelect: 'none',
                      }}>
                        {mobilePageIdx + 1}
                      </div>
                      {/* Shadow on turning edge */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: flipDir === 'next'
                          ? 'linear-gradient(to left, rgba(0,0,0,0.08) 0%, transparent 40%)'
                          : 'linear-gradient(to right, rgba(0,0,0,0.08) 0%, transparent 40%)',
                        pointerEvents: 'none',
                        borderRadius: '12px',
                      }} />
                    </div>

                    {/* Back face: target page (shown as flip completes) */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: targetMobileIdx % 2 === 0 ? '#FFF6D8' : '#F6E6B4',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      padding: '2rem 1.75rem 3rem',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,115,85,0.35), transparent)', marginBottom: '1.25rem' }} />
                      <div style={{ flex: 1 }}>
                        <PageContent section={mobileTarget} />
                      </div>
                      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,115,85,0.25), transparent)', marginTop: '1rem' }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '0.75rem',
                        color: '#8B7355',
                        fontStyle: 'italic',
                        userSelect: 'none',
                      }}>
                        {targetMobileIdx + 1}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

          ) : (
            // ── DESKTOP: Two-page spread with 3D page flip ──
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-[1200px]"
            >
              {/* Perspective container */}
              <div style={{ perspective: '2800px', perspectiveOrigin: '50% 50%' }}>
                {/* Book container */}
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    height: 'min(68vh, 660px)',
                    minHeight: '480px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 12px 40px rgba(0,0,0,0.45)',
                  }}
                >
                  {/* Left page */}
                  <div style={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '4px 0 0 4px',
                  }}>
                    <BookPage
                      section={leftSection}
                      pageNum={leftPageNum}
                      isLeft={true}
                    />
                    {/* Spine shadow on right edge of left page */}
                    <div style={{
                      position: 'absolute',
                      top: 0, bottom: 0, right: 0,
                      width: '32px',
                      background: 'linear-gradient(to left, rgba(0,0,0,0.12), transparent)',
                      pointerEvents: 'none',
                    }} />
                  </div>

                  {/* Book spine */}
                  <div style={{
                    width: '24px',
                    flexShrink: 0,
                    background: 'linear-gradient(to right, #0b0f22, #1A1F4B, #0b0f22)',
                    position: 'relative',
                    zIndex: 10,
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '12%',
                      bottom: '12%',
                      left: '50%',
                      width: '1px',
                      transform: 'translateX(-50%)',
                      background: 'rgba(255,200,87,0.2)',
                    }} />
                  </div>

                  {/* Right page */}
                  <div style={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '0 4px 4px 0',
                  }}>
                    <BookPage
                      section={rightSection}
                      pageNum={rightPageNum}
                      isLeft={false}
                    />
                    {/* Spine shadow on left edge of right page */}
                    <div style={{
                      position: 'absolute',
                      top: 0, bottom: 0, left: 0,
                      width: '28px',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)',
                      pointerEvents: 'none',
                    }} />
                  </div>

                  {/* ── Flipping page (absolutely positioned over left or right half) ── */}
                  {isAnimating && (
                    <motion.div
                      key={`flip-${targetSpreadIdx}-${flipDir}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        // Cover the appropriate half
                        ...(flipDir === 'next'
                          ? { left: 'calc(50% + 12px)', right: 0 }
                          : { left: 0, right: 'calc(50% + 12px)' }),
                        transformOrigin: flipDir === 'next' ? 'left center' : 'right center',
                        transformStyle: 'preserve-3d',
                        zIndex: 30,
                      }}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: flipDir === 'next' ? -180 : 180 }}
                      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                      onAnimationComplete={handleFlipComplete}
                    >
                      {/* Front face (page being turned) */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        overflow: 'hidden',
                        borderRadius: flipDir === 'next' ? '0 4px 4px 0' : '4px 0 0 4px',
                      }}>
                        <BookPage
                          section={flipFrontSection}
                          pageNum={flipFrontPageNum}
                          isLeft={flipDir !== 'next'}
                        />
                        {/* Curl shadow */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: flipDir === 'next'
                            ? 'linear-gradient(to left, rgba(0,0,0,0.18) 0%, transparent 50%)'
                            : 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 50%)',
                          pointerEvents: 'none',
                        }} />
                      </div>

                      {/* Back face (new page revealed) */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        overflow: 'hidden',
                        borderRadius: flipDir === 'next' ? '4px 0 0 4px' : '0 4px 4px 0',
                      }}>
                        <BookPage
                          section={flipBackSection}
                          pageNum={flipBackPageNum}
                          isLeft={flipDir === 'next'}
                        />
                        {/* Shadow on landing edge */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: flipDir === 'next'
                            ? 'linear-gradient(to right, rgba(0,0,0,0.12) 0%, transparent 40%)'
                            : 'linear-gradient(to left, rgba(0,0,0,0.12) 0%, transparent 40%)',
                          pointerEvents: 'none',
                        }} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Navigation controls ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-6 mt-8"
          >
            <button
              onClick={handlePrev}
              disabled={isAnimating || !canGoPrev}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255,200,87,0.3)',
                background: 'rgba(255,200,87,0.05)',
                color: '#FFC857',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                opacity: (isAnimating || !canGoPrev) ? 0.3 : 1,
                transition: 'opacity 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { if (canGoPrev && !isAnimating) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,200,87,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,200,87,0.05)'; }}
            >
              <ChevronLeft size={15} />
              PREV
            </button>

            <span style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.45)',
              minWidth: '100px',
              textAlign: 'center',
            }}>
              {pageLabel}
            </span>

            <button
              onClick={handleNext}
              disabled={isAnimating || !canGoNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255,200,87,0.3)',
                background: 'rgba(255,200,87,0.05)',
                color: '#FFC857',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                opacity: (isAnimating || !canGoNext) ? 0.3 : 1,
                transition: 'opacity 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { if (canGoNext && !isAnimating) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,200,87,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,200,87,0.05)'; }}
            >
              NEXT
              <ChevronRight size={15} />
            </button>
          </motion.div>

          {/* Swipe hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.2)',
              marginTop: '1rem',
              letterSpacing: '0.05em',
            }}
          >
            {isMobile ? 'Swipe left or right to turn pages' : 'Use arrow keys or buttons to turn pages'}
          </motion.p>
        </div>
      )}
    </div>
  );
}