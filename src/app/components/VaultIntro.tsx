import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FONTS } from "../../lib/constants";
import "./VaultIntro.css";

interface VaultIntroProps {
  onEnter: () => void;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface ActivePointer {
  id: number;
  startClientX: number;
  grabOffsetX: number;
  grabOffsetY: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const fract = (value: number) => value - Math.floor(value);

export function VaultIntro({ onEnter }: VaultIntroProps) {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activePointerRef = useRef<ActivePointer | null>(null);
  const positionRef = useRef({ x: 50, y: 50 });
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 125 }, (_, index) => {
        const x = fract(Math.sin((index + 1) * 12.9898) * 43758.5453);
        const y = fract(Math.sin((index + 1) * 78.233) * 24634.6345);
        const size = index % 23 === 0 ? 3 : index % 5 === 0 ? 2 : 1;
        const opacity =
          0.28 + fract(Math.sin((index + 7) * 39.425) * 8463.127) * 0.58;
        return { x: 3 + x * 94, y: 5 + y * 90, size, opacity };
      }),
    [],
  );

  const getBounds = useCallback(() => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) {
      return { minX: 8, maxX: 92, minY: 10, maxY: 90 };
    }
    const marginX = Math.min(30, (54 / rect.width) * 100);
    const marginY = Math.min(30, (54 / rect.height) * 100);
    return {
      minX: Math.max(6, marginX),
      maxX: Math.min(94, 100 - marginX),
      minY: Math.max(8, marginY),
      maxY: Math.min(92, 100 - marginY),
    };
  }, []);

  const moveStars = useCallback(
    (xPercent: number, yPercent: number) => {
      if (reducedMotion) return;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect?.width || !rect.height) return;
      const lightX = (xPercent / 100) * rect.width;
      const lightY = (yPercent / 100) * rect.height;
      const radius = Math.min(165, Math.max(105, rect.width * 0.2));

      stars.forEach((star, index) => {
        const node = starRefs.current[index];
        if (!node) return;
        const dx = (star.x / 100) * rect.width - lightX;
        const dy = (star.y / 100) * rect.height - lightY;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / radius);
        const ux = distance ? dx / distance : 1;
        const uy = distance ? dy / distance : 0;
        const push = influence * 92;
        node.style.transform = `translate3d(${(ux * push).toFixed(1)}px, ${(uy * push).toFixed(1)}px, 0) scale(${(1 + influence * 0.75).toFixed(2)})`;
        node.style.opacity = String(Math.min(1, star.opacity + influence * 0.32));
      });
    },
    [reducedMotion, stars],
  );

  const setOrbPosition = useCallback(
    (x: number, y: number) => {
      const bounds = getBounds();
      const next = {
        x: clamp(Number(x), bounds.minX, bounds.maxX),
        y: clamp(Number(y), bounds.minY, bounds.maxY),
      };
      positionRef.current = next;
      setPosition(next);
      moveStars(next.x, next.y);
      return next;
    },
    [getBounds, moveStars],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    moveStars(positionRef.current.x, positionRef.current.y);
    const handleResize = () =>
      moveStars(positionRef.current.x, positionRef.current.y);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", handleResize);
    };
  }, [moveStars]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || activePointerRef.current) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return;
    const current = positionRef.current;
    activePointerRef.current = {
      id: event.pointerId,
      startClientX: event.clientX,
      grabOffsetX: event.clientX - (rect.left + (current.x / 100) * rect.width),
      grabOffsetY: event.clientY - (rect.top + (current.y / 100) * rect.height),
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional in older browsers.
    }
    event.preventDefault();
  };

  const finishPointer = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (activePointerRef.current?.id !== event.pointerId) return;
    activePointerRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const activePointer = activePointerRef.current;
    const rect = stageRef.current?.getBoundingClientRect();
    if (
      !activePointer ||
      activePointer.id !== event.pointerId ||
      !rect?.width ||
      !rect.height
    ) {
      return;
    }
    event.preventDefault();
    const next = setOrbPosition(
      ((event.clientX - activePointer.grabOffsetX - rect.left) / rect.width) * 100,
      ((event.clientY - activePointer.grabOffsetY - rect.top) / rect.height) * 100,
    );
    const bounds = getBounds();
    if (event.clientX > activePointer.startClientX && next.x >= bounds.maxX - 2) {
      finishPointer(event);
      onEnter();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onEnter();
      return;
    }

    const bounds = getBounds();
    const step = event.shiftKey ? 10 : 4;
    const previousX = positionRef.current.x;
    let nextX = previousX;
    let nextY = positionRef.current.y;

    if (event.key === "ArrowRight") nextX = Math.min(bounds.maxX, previousX + step);
    else if (event.key === "ArrowLeft") nextX = Math.max(bounds.minX, previousX - step);
    else if (event.key === "ArrowDown") nextY = Math.min(bounds.maxY, nextY + step);
    else if (event.key === "ArrowUp") nextY = Math.max(bounds.minY, nextY - step);
    else if (event.key === "Home") {
      nextX = bounds.minX;
      nextY = 50;
    } else if (event.key === "End") nextX = bounds.maxX;
    else return;

    event.preventDefault();
    const next = setOrbPosition(nextX, nextY);
    if (nextX > previousX && next.x >= bounds.maxX - 2) onEnter();
  };

  const bounds = getBounds();
  const eastProgress = clamp((position.x - 50) / Math.max(1, bounds.maxX - 50), 0, 1);
  const sunPhase =
    position.x >= 90
      ? "Sun · East"
      : position.x > 62
        ? "Sunrise · Drifting"
        : position.x < 15
          ? "Moon · West"
          : "Moon · Drifting";
  const introStyle = {
    "--orb-x": `${position.x.toFixed(2)}%`,
    "--orb-y": `${position.y.toFixed(2)}%`,
    "--halo-opacity": (0.18 + eastProgress * 0.72).toFixed(3),
    "--orb-size": `${Math.round(148 + eastProgress * 42)}px`,
    "--halo-size": `${Math.round(118 + eastProgress * 242)}px`,
    "--shadow-shift": `${(-27 - (position.x / 100) * 53).toFixed(2)}%`,
    "--shadow-opacity": `${(1 - position.x / 100).toFixed(3)}`,
  } as React.CSSProperties;

  return (
    <motion.section
      className="vault-intro"
      style={introStyle}
      aria-label="The Vault entrance"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.72,
        ease: [0.72, 0, 0.2, 1],
      }}
    >
      <div className="vault-intro__stage" ref={stageRef}>
        <div className="vault-intro__starfield" aria-hidden="true">
          {stars.map((star, index) => (
            <span
              key={index}
              ref={(node) => {
                starRefs.current[index] = node;
              }}
              className="vault-intro__star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        <svg
          className="vault-intro__constellations"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g>
            <path d="M790 191 L840 161 L887 182 L924 132 L975 149 L1018 119" />
            <circle cx="790" cy="191" r="2" />
            <circle cx="840" cy="161" r="2.2" />
            <circle cx="887" cy="182" r="1.8" />
            <circle cx="924" cy="132" r="2.1" />
            <circle cx="975" cy="149" r="1.8" />
            <circle cx="1018" cy="119" r="2.2" />
            <path d="M1124 683 L1169 649 L1215 666 L1254 615 L1307 632 L1350 593" />
            <circle cx="1124" cy="683" r="1.9" />
            <circle cx="1169" cy="649" r="2.1" />
            <circle cx="1215" cy="666" r="1.8" />
            <circle cx="1254" cy="615" r="2.2" />
            <circle cx="1307" cy="632" r="1.9" />
            <circle cx="1350" cy="593" r="2.1" />
            <path d="M520 744 L559 714 L597 726 L628 689" />
            <circle cx="520" cy="744" r="1.7" />
            <circle cx="559" cy="714" r="2" />
            <circle cx="597" cy="726" r="1.6" />
            <circle cx="628" cy="689" r="1.9" />
          </g>
        </svg>

        <div className="vault-intro__orb-halo" aria-hidden="true" />
        <div className="vault-intro__wordmark" aria-hidden="true">
          <strong>THE BOC VAULT</strong>
          <span>Rare fragments. Hidden worlds.</span>
        </div>
        <div className="vault-intro__direction vault-intro__direction--north" aria-hidden="true">NORTH</div>
        <div className="vault-intro__direction vault-intro__direction--west" aria-hidden="true">WEST</div>
        <div className="vault-intro__direction vault-intro__direction--south" aria-hidden="true">SOUTH</div>
        <div className="vault-intro__direction vault-intro__direction--east" aria-hidden="true">
          <strong>EAST</strong>
          <span>DRAG EAST TO OPEN</span>
        </div>

        <button
          className="vault-intro__orb"
          type="button"
          role="slider"
          aria-label="Moon and orbit handle. Drag east to reveal the Vault. Use arrow keys to move, or press Enter to open the Vault."
          aria-valuemin={Math.round(bounds.minX)}
          aria-valuemax={Math.round(bounds.maxX)}
          aria-valuenow={Math.round(position.x)}
          aria-valuetext={`Moon and orbit at ${Math.round(position.x)} percent across and ${Math.round(position.y)} percent down`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
          onKeyDown={handleKeyDown}
        >
          <span className="vault-intro__orbit vault-intro__orbit--one" aria-hidden="true" />
          <span className="vault-intro__orbit vault-intro__orbit--two" aria-hidden="true" />
          <span className="vault-intro__orb-core" aria-hidden="true" />
        </button>

        <div className="vault-intro__top-note" aria-hidden="true">
          <span>FOLLOW THE LIGHT</span>
          <strong>{sunPhase}</strong>
        </div>
        <p className="vault-intro__copy">
          <span className="vault-intro__eyebrow">BEHIND THE WORK</span>
          <strong id="vault-intro-title" style={{ fontFamily: FONTS.accent }}>The Vault</strong>
          <span>Rare fragments, early previews, and hidden worlds from BOC.</span>
        </p>
        <p className="vault-intro__caption" aria-hidden="true">
          <span>WEST · MOONLIGHT</span>
          <span>DRAG THE ORBIT · PULL EAST TO REVEAL</span>
          <span>EAST · DAWN</span>
        </p>
        <div className="vault-intro__actions">
          <button className="vault-intro__enter" type="button" onClick={onEnter}>
            Enter the Vault <span aria-hidden="true">→</span>
          </button>
          <span className="vault-intro__instruction">Or guide the moon east to open the gate.</span>
        </div>
        <p className="vault-intro__status" role="status" aria-live="polite">
          Drag the moon and orbit east, or choose Enter the Vault.
        </p>
      </div>
    </motion.section>
  );
}
