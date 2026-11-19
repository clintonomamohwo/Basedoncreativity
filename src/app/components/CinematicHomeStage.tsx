import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { HeroSection } from './HeroSection';
import { PortfolioSection } from './PortfolioSection';
import './CinematicHomeStage.css';

export function CinematicHomeStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });
  const lightY = useTransform(
    scrollY,
    (value) => value + (typeof window === 'undefined' ? 160 : window.innerHeight * 0.22),
  );
  const lightOpacity = useTransform(scrollYProgress, [0, 0.52, 0.86, 1], [0.82, 0.72, 0.42, 0]);

  return (
    <div
      ref={stageRef}
      className="boc-home-cinematic-stage"
      data-reduced-motion={reduceMotion ? 'true' : undefined}
    >
      <motion.div
        className="boc-home-cinematic-stage__light"
        aria-hidden="true"
        style={{ y: reduceMotion ? 0 : lightY, opacity: reduceMotion ? 0.7 : lightOpacity }}
      >
        <div className="boc-home-cinematic-stage__light-drift" />
      </motion.div>
      <div className="boc-home-cinematic-stage__content">
        <HeroSection />
        <PortfolioSection />
      </div>
    </div>
  );
}
