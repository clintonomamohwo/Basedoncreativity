import { useEffect, useRef, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { TrailingStar } from './NavigationSections';
import type { Star } from './NavigationSections';
import bocLogo from '../../assets/boc_logo.png';

const MAX_TRANSITION_STARS = 16;

function getTransitionStarLifetime(star: Star) {
  const duration = star.duration ?? 0.85;
  return Math.ceil(((star.delay ?? 0) + duration + 0.1) * 1000);
}

function useFavicon() {
  useEffect(() => {
    // Favicon
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = bocLogo;

    // Apple touch icon
    let appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (!appleLink) {
      appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleLink);
    }
    appleLink.href = bocLogo;
  }, []);
}

export function Root() {
  useFavicon();

  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [transitionStars, setTransitionStars] = useState<Star[]>([]);
  const [transitionSweepKey, setTransitionSweepKey] = useState(0);

  const previousPathRef = useRef(location.pathname);
  const starCounterRef = useRef(0);
  const transitionStarRemovalTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      transitionStarRemovalTimersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      transitionStarRemovalTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;

    if (reduceMotion || typeof window === 'undefined') return;

    setTransitionSweepKey((key) => key + 1);

    const queueTransitionStar = (star: Star) => {
      setTransitionStars((prev) => [
        ...prev.slice(-(MAX_TRANSITION_STARS - 1)),
        star,
      ]);

      const removalTimer = window.setTimeout(() => {
        setTransitionStars((prev) =>
          prev.filter((item) => item.id !== star.id),
        );
        transitionStarRemovalTimersRef.current =
          transitionStarRemovalTimersRef.current.filter(
            (timerId) => timerId !== removalTimer,
          );
      }, getTransitionStarLifetime(star));

      transitionStarRemovalTimersRef.current.push(removalTimer);
    };

    const width = window.innerWidth;
    const count = 12;
    const startX = Math.max(64, width * 0.08);
    const usableWidth = Math.max(width * 0.78, 240);
    const yPattern = [96, 122, 148, 136] as const;

    Array.from({ length: count }).forEach((_, index) => {
      const progress = index / Math.max(count - 1, 1);

      queueTransitionStar({
        id: starCounterRef.current++,
        x: startX + usableWidth * progress,
        y: yPattern[index % yPattern.length] + Math.sin(index * 0.9) * 10,
        size: 11 + (index % 3) * 2 + Math.random() * 1.5,
        rotation: Math.random() * 360,
        variant: 'transition',
        delay: progress * 0.32 + (index % 2) * 0.04,
        duration: 0.62 + (index % 4) * 0.05,
        driftX: 64 + Math.cos(index * 0.8) * 14,
        driftY: index % 2 === 0 ? -10 : 10,
      });
    });
  }, [location.pathname, reduceMotion]);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
      <ScrollRestoration />
      <Navigation />

      <AnimatePresence>
        {!reduceMotion && transitionSweepKey > 0 && (
          <motion.div
            key={`route-sweep-${transitionSweepKey}`}
            initial={{ opacity: 0, x: '-18%' }}
            animate={{ opacity: [0, 0.45, 0], x: '108%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 68,
              left: 0,
              width: '28rem',
              maxWidth: '72vw',
              height: 132,
              pointerEvents: 'none',
              zIndex: 45,
              borderRadius: 999,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255, 200, 87, 0.12) 28%, rgba(255, 200, 87, 0.3) 50%, rgba(250, 243, 224, 0.18) 64%, transparent 100%)',
              filter: 'blur(10px)',
              transform: 'skewX(-18deg)',
              mixBlendMode: 'screen',
            }}
          />
        )}
      </AnimatePresence>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 46,
        }}
      >
        <AnimatePresence>
          {transitionStars.map((star) => (
            <TrailingStar key={star.id} star={star} />
          ))}
        </AnimatePresence>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
