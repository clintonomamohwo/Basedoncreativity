import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { ArrowDown, ArrowRight, Layers, Lightbulb, PenTool } from 'lucide-react';
import { Link } from 'react-router';
import './CreativeHero.css';

const processSteps = [
  { number: '01', label: 'Imagine', description: 'Find the spark.', Icon: Lightbulb },
  { number: '02', label: 'Design', description: 'Give it a form.', Icon: PenTool },
  { number: '03', label: 'Build', description: 'Bring it to life.', Icon: Layers },
];

const paletteSwatches = [
  { name: 'Navy', className: 'boc-creative-hero__swatch--navy' },
  { name: 'Gold', className: 'boc-creative-hero__swatch--gold' },
  { name: 'Cream', className: 'boc-creative-hero__swatch--cream' },
  { name: 'Blue', className: 'boc-creative-hero__swatch--blue' },
];

const identitySample = {
  id: 'boc-identity',
  label: '04 / Finished BOC identity',
  meta: 'Brand system · 2025',
  image: '/creative-studio/boc-brand-system-board.jpg',
  alt: 'A public excerpt from BOC’s brand system, showing logo variations, colour palette, typography, and card styles.',
  width: 1200,
  height: 650,
  caption: 'Logo · Colour · Type · Card styles',
};

const clientSample = {
  id: 'modern-cosmos',
  label: 'Client project / Modern Cosmos',
  meta: 'Website redesign · 2026',
  image: '/case-studies/modern-cosmos-homepage-comparison.webp',
  alt: 'Modern Cosmos homepage before-and-after comparison, showing desktop and mobile views of the website redesign.',
  width: 2400,
  height: 1810,
  caption: 'Responsive redesign · Desktop + mobile',
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [showClientWork, setShowClientWork] = useState(false);
  const clientTransitionTimer = useRef<number | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const wallX = useSpring(pointerX, { stiffness: 95, damping: 22, mass: 0.55 });
  const wallY = useSpring(pointerY, { stiffness: 95, damping: 22, mass: 0.55 });

  useEffect(() => {
    const clientImage = new Image();
    clientImage.src = clientSample.image;

    if (reduceMotion) return undefined;

    const timer = window.setTimeout(() => setShowClientWork(true), 7200);
    clientTransitionTimer.current = timer;
    return () => {
      window.clearTimeout(timer);
      if (clientTransitionTimer.current === timer) clientTransitionTimer.current = null;
    };
  }, [reduceMotion]);

  const handleWallPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(horizontal * 7);
    pointerY.set(vertical * 5);
  };

  const resetWallPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleSampleToggle = () => {
    if (clientTransitionTimer.current !== null) {
      window.clearTimeout(clientTransitionTimer.current);
      clientTransitionTimer.current = null;
    }
    setShowClientWork((current) => !current);
  };

  const handleWorkJump = (targetId: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    window.history.replaceState(window.history.state, '', `#${targetId}`);
    target.scrollIntoView({
      behavior: reduceMotion ? 'instant' : 'smooth',
      block: 'start',
    });
  };

  const timing = (delay: number) => ({
    duration: reduceMotion ? 0 : 0.72,
    delay: reduceMotion ? 0 : delay,
    ease: easeOut,
  });

  const crossfade = {
    duration: reduceMotion ? 0 : 0.48,
    ease: easeOut,
  };
  const activeWork = showClientWork ? clientSample : identitySample;

  return (
    <section className="boc-creative-hero" aria-labelledby="home-hero-title">
      <div className="boc-creative-hero__texture" aria-hidden="true" />

      <div className="boc-creative-hero__inner">
        <div className="boc-creative-hero__copy">
          <motion.p
            className="boc-creative-hero__eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={timing(0.08)}
          >
            <span className="boc-creative-hero__eyebrow-rule" aria-hidden="true" />
            Based on Creativity · Toronto studio
          </motion.p>

          <motion.h1
            id="home-hero-title"
            className="boc-creative-hero__title"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={timing(0.14)}
          >
            <span>Ideas made</span>
            <span className="boc-creative-hero__title-accent">visible.</span>
          </motion.h1>

          <motion.p
            className="boc-creative-hero__tagline"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={timing(0.23)}
          >
            Built in the quiet. Born in the light.
          </motion.p>

          <motion.p
            className="boc-creative-hero__description"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={timing(0.31)}
          >
            We shape ideas into brand identities, digital experiences, and stories, from the first spark to the final detail.
          </motion.p>

          <motion.div
            className="boc-creative-hero__actions"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={timing(0.39)}
          >
            <a
              href="#selected-work"
              onClick={handleWorkJump('selected-work')}
              className="boc-creative-hero__button boc-creative-hero__button--primary"
            >
              Explore selected work <ArrowRight size={17} aria-hidden="true" />
            </a>
            <Link to="/contact" className="boc-creative-hero__button boc-creative-hero__button--secondary">
              Start a conversation
            </Link>
          </motion.div>

          <motion.div
            className="boc-creative-hero__process"
            role="group"
            aria-label="Our creative process"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={timing(0.47)}
          >
            <p className="boc-creative-hero__process-label">A simple creative process</p>
            <ol className="boc-creative-hero__process-list">
              {processSteps.map(({ number, label, description, Icon }) => (
                <li className="boc-creative-hero__process-step" key={number}>
                  <span className="boc-creative-hero__process-number">{number}</span>
                  <div className="boc-creative-hero__process-copy">
                    <span className="boc-creative-hero__process-heading">
                      <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                      {label}
                    </span>
                    <span className="boc-creative-hero__process-description">{description}</span>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        <motion.div
          className="boc-creative-hero__studio"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={timing(0.18)}
        >
          <div className="boc-creative-hero__studio-topline">
            <span>The studio wall</span>
            {showClientWork ? (
              <a
                className="boc-creative-hero__studio-project-link"
                href="#modern-cosmos-feature"
                onClick={handleWorkJump('modern-cosmos-feature')}
                aria-label="Continue to the Modern Cosmos feature in Selected Work"
              >
                Selected Work <ArrowDown size={12} aria-hidden="true" />
              </a>
            ) : (
              <span>From sketch to finish</span>
            )}
          </div>

          <motion.div
            className="boc-creative-hero__wall"
            role="group"
            aria-label="A studio wall showing an idea become BOC identity work and a Modern Cosmos client project"
            style={{ x: wallX, y: wallY }}
            onPointerMove={handleWallPointerMove}
            onPointerLeave={resetWallPointer}
          >
            <motion.figure
              className="boc-creative-hero__wall-board"
              initial={reduceMotion ? false : { opacity: 0, y: 20, rotate: -5, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, rotate: -1.4, scale: 1 }}
              transition={timing(1.5)}
              whileHover={reduceMotion ? undefined : { y: -3, rotate: -0.7 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="boc-creative-hero__wall-board-heading"
                  key={`${activeWork.id}-heading`}
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={crossfade}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span>{activeWork.label}</span>
                  <span>{activeWork.meta}</span>
                </motion.div>
              </AnimatePresence>

              <div className="boc-creative-hero__wall-board-frame">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    className="boc-creative-hero__wall-board-image"
                    key={activeWork.id}
                    src={activeWork.image}
                    alt={activeWork.alt}
                    width={activeWork.width}
                    height={activeWork.height}
                    fetchPriority={showClientWork ? 'auto' : 'high'}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 1.015 }}
                    transition={crossfade}
                  />
                </AnimatePresence>
              </div>

              <figcaption className="boc-creative-hero__wall-board-caption">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    className="boc-creative-hero__wall-board-caption-copy"
                    key={`${activeWork.id}-caption`}
                    initial={reduceMotion ? false : { opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -3 }}
                    transition={crossfade}
                  >
                    {activeWork.caption}
                  </motion.span>
                </AnimatePresence>
                <button
                  className="boc-creative-hero__wall-board-toggle"
                  type="button"
                  onClick={handleSampleToggle}
                  aria-pressed={showClientWork}
                  aria-label={showClientWork ? 'Switch to the BOC identity sample' : 'Preview the Modern Cosmos client project'}
                >
                  {showClientWork ? 'BOC identity' : 'See client work'}
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              </figcaption>
            </motion.figure>

            <motion.div
              className="boc-creative-hero__wall-sketch"
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, x: 22, y: -14, rotate: 10, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 5.5, scale: 1 }}
              transition={timing(0.14)}
              whileHover={reduceMotion ? undefined : { y: -5, rotate: 3.5 }}
            >
              <span className="boc-creative-hero__wall-card-label">01 / Sketch</span>
              <svg className="boc-creative-hero__wireframe" viewBox="0 0 220 118" fill="none">
                <motion.path
                  d="M13 14L205 8L211 101L18 108Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0.2 }}
                  animate={{ pathLength: 1, opacity: 0.62 }}
                  transition={{ duration: reduceMotion ? 0 : 0.88, delay: reduceMotion ? 0 : 0.28, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M30 34H108M30 43H91M126 29L190 31M126 41L179 42M30 61H188M30 70H150M30 82L77 81L78 96L30 98Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0.16 }}
                  animate={{ pathLength: 1, opacity: 0.58 }}
                  transition={{ duration: reduceMotion ? 0 : 1.05, delay: reduceMotion ? 0 : 0.36, ease: 'easeInOut' }}
                />
              </svg>
              <span className="boc-creative-hero__wall-card-foot">What could this become?</span>
            </motion.div>

            <motion.div
              className="boc-creative-hero__wall-type"
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, x: -18, y: 18, rotate: -8, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -3.5, scale: 1 }}
              transition={timing(0.68)}
              whileHover={reduceMotion ? undefined : { y: -5, rotate: -1.5 }}
            >
              <span className="boc-creative-hero__wall-card-label">02 / Type study</span>
              <span className="boc-creative-hero__type-sample">Aa</span>
              <span className="boc-creative-hero__type-name">Space Mono<br />Cormorant Garamond</span>
            </motion.div>

            <motion.div
              className="boc-creative-hero__wall-palette"
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, x: 18, y: 20, rotate: 7, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 2.2, scale: 1 }}
              transition={timing(1.08)}
              whileHover={reduceMotion ? undefined : { y: -5, rotate: 0.5 }}
            >
              <span className="boc-creative-hero__wall-card-label">03 / Colour study</span>
              <span className="boc-creative-hero__palette-swatches">
                {paletteSwatches.map(({ name, className }, index) => (
                  <motion.i
                    className={`boc-creative-hero__swatch ${className}`}
                    key={name}
                    title={name}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.5, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : 1.14 + index * 0.07 }}
                  />
                ))}
              </span>
              <span className="boc-creative-hero__palette-name">Navy · Gold · Cream · Blue</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
