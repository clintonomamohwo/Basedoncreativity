import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { CloudinaryImage } from './CloudinaryImage';

// Story content data
const storyData: Record<string, any> = {
  'the-moon-listener': {
    title: 'The Moon Listener',
    subtitle: 'A tale of silence and connection',
    author: 'Based on Creativity',
    heroImage: 'stories/moon-listener-hero',
    sections: [
      {
        type: 'text',
        content: `In a village where everyone spoke constantly, there lived a girl who preferred to listen. While others filled the air with words, she filled her heart with the quiet songs of the world.`,
      },
      {
        type: 'image',
        publicId: 'stories/moon-listener-1',
        caption: 'She spent her evenings on the hill, listening.',
      },
      {
        type: 'text',
        content: `Each night, she climbed the hill beyond the village and sat beneath the vast sky. She listened to the wind's whispers, the rustle of leaves, and the distant calls of night birds. But most of all, she listened to the moon.`,
      },
      {
        type: 'text',
        content: `The villagers thought her strange. "What could the moon possibly say?" they asked. But she knew better. The moon spoke in silvery silence, in the gentle pull of tides, in the way shadows danced across meadows.`,
      },
      {
        type: 'image',
        publicId: 'stories/moon-listener-2',
        caption: "The moon's light painted stories across the land.",
      },
      {
        type: 'text',
        content: `One night, as she sat in her usual spot, the moon seemed brighter than ever. Its light fell upon her like a benediction, and in that moment, she understood: the moon had been listening to her, too.`,
      },
      {
        type: 'text',
        content: `Silence, she realized, was not emptiness. It was the space where understanding lived, where hearts could hear each other across impossible distances. The moon had taught her the oldest lesson: true connection requires not just speaking, but the courage to be still.`,
      },
      {
        type: 'image',
        publicId: 'stories/moon-listener-3',
        caption: 'And so she listened, and the world spoke back.',
      },
    ],
  },
  'the-compass-dream': {
    title: 'The Compass Dream',
    subtitle: 'Finding true north within',
    author: 'Based on Creativity',
    heroImage: 'stories/compass-dream-hero',
    sections: [
      {
        type: 'text',
        content: `The compass arrived on a Tuesday, wrapped in brown paper and tied with twine. No return address. No note. Just the compass, its brass surface worn smooth by time and touch.`,
      },
      {
        type: 'image',
        publicId: 'stories/compass-dream-1',
        caption: 'A compass that pointed to something more than north.',
      },
      {
        type: 'text',
        content: `At first, Marcus thought it was broken. The needle spun wildly, never settling, never pointing true north. But each night, in his dreams, he saw where it led: a path through forests he'd never walked, across rivers he'd never crossed, to a horizon he couldn't name.`,
      },
      {
        type: 'text',
        content: `"Follow it," the dreams whispered. But how do you follow a compass that refuses to point anywhere?`,
      },
      {
        type: 'image',
        publicId: 'stories/compass-dream-2',
        caption: 'The journey began with a single step.',
      },
      {
        type: 'text',
        content: `One morning, Marcus packed a small bag and left. He didn't know where he was going, but the compass felt warm in his pocket, and the dreams felt true in his heart. He walked without maps, trusting the pull of something he couldn't explain.`,
      },
      {
        type: 'text',
        content: `Days became weeks. The compass never steadied, but Marcus began to understand: it wasn't pointing to a place. It was pointing to a feeling — the feeling of moving toward his truest self, the self he'd been too afraid to become.`,
      },
      {
        type: 'image',
        publicId: 'stories/compass-dream-3',
        caption: 'True north was inside him all along.',
      },
      {
        type: 'text',
        content: `When he finally stopped walking, the compass stopped spinning. It pointed directly at his heart. And Marcus understood: the journey wasn't about finding a destination. It was about finding the courage to trust his own direction.`,
      },
    ],
  },
  'a-quiet-spark': {
    title: 'A Quiet Spark',
    subtitle: 'Small beginnings, infinite potential',
    author: 'Based on Creativity',
    heroImage: 'stories/quiet-spark-hero',
    sections: [
      {
        type: 'text',
        content: `It began as the smallest thing: a thought, barely a whisper, in the back of her mind. Elena almost ignored it. Almost.`,
      },
      {
        type: 'image',
        publicId: 'stories/quiet-spark-1',
        caption: 'Every great thing begins with a spark.',
      },
      {
        type: 'text',
        content: `The thought was simple: "What if I tried?" Four words that changed everything. What if she tried to paint again? What if she tried to create the art she'd dreamed of but never dared to make?`,
      },
      {
        type: 'text',
        content: `The first stroke of paint was terrifying. Her hand shook. The color seemed wrong. But she kept going, because the spark had become a flame, and flames need fuel to burn.`,
      },
      {
        type: 'image',
        publicId: 'stories/quiet-spark-2',
        caption: 'Small steps, brave hearts.',
      },
      {
        type: 'text',
        content: `Days turned into weeks of painting. Some pieces were beautiful. Some were disasters. But each one taught her something, and the quiet spark that had started in her mind now blazed in her studio, illuminating corners of herself she'd forgotten existed.`,
      },
      {
        type: 'text',
        content: `A year later, her first exhibition opened. Friends and strangers stood before her work, moved by what they saw. But Elena knew the truth: the paintings weren't the miracle. The miracle was the spark — and the courage to let it grow.`,
      },
      {
        type: 'image',
        publicId: 'stories/quiet-spark-3',
        caption: 'From spark to flame to light for others.',
      },
    ],
  },
  'fragments-of-light': {
    title: 'Fragments of Light',
    subtitle: 'Stories from the in-between',
    author: 'Based on Creativity',
    heroImage: 'stories/fragments-hero',
    sections: [
      {
        type: 'text',
        content: `There are moments that slip between the seconds — brief, luminous, easily missed. This is a collection of those moments: fragments of light caught in the ordinary hours of living.`,
      },
      {
        type: 'image',
        publicId: 'stories/fragments-1',
        caption: 'Light finds its way through the cracks.',
      },
      {
        type: 'text',
        content: `Fragment One: The way coffee steams in morning light, spiraling upward like tiny galaxies being born. You've seen it a thousand times, but this morning, you really see it. The universe in a cup.`,
      },
      {
        type: 'text',
        content: `Fragment Two: A stranger's smile on the subway. No words exchanged, just recognition — two humans acknowledging each other in the midst of the crowd. It lasts three seconds and fills your whole day.`,
      },
      {
        type: 'image',
        publicId: 'stories/fragments-2',
        caption: 'Beauty lives in the pauses.',
      },
      {
        type: 'text',
        content: `Fragment Three: The pause between exhale and inhale, where everything stops and nothing hurts. You discover it during meditation, but it exists in every breath you've ever taken. Peace was always this close.`,
      },
      {
        type: 'text',
        content: `Fragment Four: Your grandmother's laughter, caught on an old recording. She's been gone for years, but here she is, alive in sound waves, her joy still echoing through time.`,
      },
      {
        type: 'image',
        publicId: 'stories/fragments-3',
        caption: 'We are made of these moments.',
      },
      {
        type: 'text',
        content: `These fragments don't change the world. They change you. And maybe that's the same thing.`,
      },
    ],
  },
  'the-clockmakers-tale': {
    title: "The Clockmaker's Tale",
    subtitle: 'Time, craft, and patience',
    author: 'Based on Creativity',
    heroImage: 'stories/clockmaker-hero',
    sections: [
      {
        type: 'text',
        content: `Old Heinrich had been making clocks for sixty years. Each one took months to complete — gears cut by hand, springs wound with precision, faces painted with infinite care.`,
      },
      {
        type: 'image',
        publicId: 'stories/clockmaker-1',
        caption: 'Each gear, a testament to patience.',
      },
      {
        type: 'text',
        content: `People often asked why he didn't use machines, why he didn't speed things up. Heinrich would smile and say, "A clock measures time. Shouldn't its creation be worthy of what it measures?"`,
      },
      {
        type: 'text',
        content: `His workshop smelled of oil and old wood. Sunlight streamed through windows, catching on brass gears and making them glow like small suns. This was his cathedral, his meditation, his prayer.`,
      },
      {
        type: 'image',
        publicId: 'stories/clockmaker-2',
        caption: 'Craftsmanship is love made visible.',
      },
      {
        type: 'text',
        content: `One day, a young woman entered his shop. "Teach me," she said. Heinrich saw the hurry in her eyes, the impatience of youth. But he also saw something else: hunger. Not for speed, but for meaning.`,
      },
      {
        type: 'text',
        content: `They worked side by side for three years. He taught her that the first virtue of craft is patience. The second is attention. The third is love. Everything else follows from these.`,
      },
      {
        type: 'image',
        publicId: 'stories/clockmaker-3',
        caption: 'Time teaches those who listen.',
      },
      {
        type: 'text',
        content: `When her first clock was complete, she understood: she hadn't just made a timepiece. She had learned to value time itself, to see the sacred in the slow, careful work of making something true.`,
      },
    ],
  },
  'the-last-voyage': {
    title: 'The Last Voyage',
    subtitle: 'An ending is just a beginning',
    author: 'Based on Creativity',
    heroImage: 'stories/last-voyage-hero',
    sections: [
      {
        type: 'text',
        content: `The ship was called the Evening Star, and it had sailed every ocean, survived every storm. Now, after fifty years of service, it would make its final voyage.`,
      },
      {
        type: 'image',
        publicId: 'stories/last-voyage-1',
        caption: 'Every ending carries its own grace.',
      },
      {
        type: 'text',
        content: `Captain Sarah stood at the wheel, feeling the familiar weight of wood beneath her palms. She had grown old with this ship, learned the sea's moods through its creaking boards and singing rigging.`,
      },
      {
        type: 'text',
        content: `The crew had planned a final journey: one last crossing to the island where the Evening Star was born. They would sail her home, then watch as she was carefully dismantled, her wood repurposed for new vessels, new dreams.`,
      },
      {
        type: 'image',
        publicId: 'stories/last-voyage-2',
        caption: 'The sea remembers all who sail her.',
      },
      {
        type: 'text',
        content: `As they approached the island, Sarah felt not sadness but gratitude. The ship had carried them safely through countless journeys. It had been their home, their sanctuary, their companion in solitude and storm.`,
      },
      {
        type: 'text',
        content: `"Nothing truly ends," the old shipwright said when they arrived. "The Evening Star will live in every vessel built from her timbers. She'll sail on, just in new forms, on new seas."`,
      },
      {
        type: 'image',
        publicId: 'stories/last-voyage-3',
        caption: 'Transformation, not termination.',
      },
      {
        type: 'text',
        content: `That night, Sarah dreamed of ships. Dozens of them, hundreds, all carrying a piece of the Evening Star. And she understood: endings are illusions. Everything we love continues, transformed, becoming part of new stories yet to be told.`,
      },
    ],
  },
};

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

export function StoryDetail() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [storybookMode, setStorybookMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const story = storyId ? storyData[storyId] : null;

  if (!story) {
    return (
      <div className="min-h-screen bg-[#1A1F4B] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Story not found</h2>
          <button
            onClick={() => navigate('/stories')}
            className="text-[#FFC857] hover:underline"
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  const totalPages = story.sections.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        className="fixed top-24 left-6 z-50 flex items-center gap-2 text-white/60 hover:text-[#FFC857] transition-colors"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
        }}
      >
        <ArrowLeft size={16} />
        BACK TO LIBRARY
      </motion.button>

      {/* Storybook mode toggle */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setStorybookMode(!storybookMode)}
        className="fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border transition-all"
        style={{
          borderColor: storybookMode ? '#FFC857' : 'rgba(255,200,87,0.3)',
          background: storybookMode ? 'rgba(255,200,87,0.15)' : 'rgba(255,200,87,0.05)',
          color: storybookMode ? '#FFC857' : 'rgba(255,255,255,0.6)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
        }}
      >
        <BookOpen size={14} />
        {storybookMode ? 'READING MODE' : 'STORYBOOK MODE'}
      </motion.button>

      {/* Content */}
      {!storybookMode ? (
        // Regular reading mode
        <div ref={contentRef} className="relative z-20 max-w-[800px] mx-auto px-6 pt-32 pb-32">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
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
            className="mb-16 text-center"
          >
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '12px',
              }}
            >
              {story.title}
            </h1>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '1.125rem',
                color: 'rgba(255,200,87,0.7)',
                fontStyle: 'italic',
                marginBottom: '8px',
              }}
            >
              {story.subtitle}
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              by {story.author.toUpperCase()}
            </p>
          </motion.div>

          {/* Story sections */}
          <div className="space-y-12">
            {story.sections.map((section: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                {section.type === 'text' ? (
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                      color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.8,
                      textAlign: 'justify',
                    }}
                  >
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
                      <p
                        className="text-center"
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: '0.9rem',
                          color: 'rgba(255,200,87,0.5)',
                          fontStyle: 'italic',
                        }}
                      >
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
            <div
              style={{
                width: '40px',
                height: '1px',
                background: 'rgba(255,200,87,0.3)',
                margin: '0 auto',
              }}
            />
          </motion.div>
        </div>
      ) : (
        // Storybook mode (two pages side by side)
        <div className="relative z-20 flex items-center justify-center min-h-screen px-6 py-32">
          <div className="max-w-[1400px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex gap-8 items-start"
              >
                {/* Left page */}
                <div
                  className="flex-1 rounded-2xl p-12 flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    minHeight: '600px',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {story.sections[currentPage]?.type === 'image' ? (
                    <div className="w-full">
                      <CloudinaryImage
                        publicId={story.sections[currentPage].publicId}
                        alt={story.sections[currentPage].caption}
                        cloudinaryOptions={{ width: 800, fit: 'fill' }}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <p
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                        color: 'rgba(255,255,255,0.75)',
                        lineHeight: 1.8,
                      }}
                    >
                      {story.sections[currentPage]?.content}
                    </p>
                  )}
                </div>

                {/* Right page */}
                <div
                  className="flex-1 rounded-2xl p-12 flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    minHeight: '600px',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {currentPage + 1 < totalPages ? (
                    story.sections[currentPage + 1]?.type === 'image' ? (
                      <div className="w-full">
                        <CloudinaryImage
                          publicId={story.sections[currentPage + 1].publicId}
                          alt={story.sections[currentPage + 1].caption}
                          cloudinaryOptions={{ width: 800, fit: 'fill' }}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    ) : (
                      <p
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                          color: 'rgba(255,255,255,0.75)',
                          lineHeight: 1.8,
                        }}
                      >
                        {story.sections[currentPage + 1]?.content}
                      </p>
                    )
                  ) : (
                    <div className="text-center">
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '1.5rem',
                          color: 'rgba(255,200,87,0.4)',
                          fontStyle: 'italic',
                        }}
                      >
                        The End
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-8 mt-8"
            >
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-full transition-all disabled:opacity-30"
                style={{
                  border: '1px solid rgba(255,200,87,0.3)',
                  background: 'rgba(255,200,87,0.05)',
                  color: '#FFC857',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                }}
              >
                <ChevronLeft size={16} />
                PREVIOUS
              </button>

              <span
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-full transition-all disabled:opacity-30"
                style={{
                  border: '1px solid rgba(255,200,87,0.3)',
                  background: 'rgba(255,200,87,0.05)',
                  color: '#FFC857',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                }}
              >
                NEXT
                <ChevronRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
