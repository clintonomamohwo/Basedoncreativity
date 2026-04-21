import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Film, Image as ImageIcon } from 'lucide-react';

export type MediaType = 'image' | 'video' | 'writing';

interface CanvasStar {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  opacity: number;
  speed: number;
  phase: number;
  kind: number;
}
const STAR_COLORS = [
  "#FFFFFF",
  "#C8DCFF",
  "#A8C8FF",
  "#FFC857",
];
const STAR_GLOWS: [number, number, number][] = [
  [255, 255, 255],
  [180, 210, 255],
  [140, 190, 255],
  [255, 200, 87],
];

export function StarCanvas({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<CanvasStar[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const buildStars = (w: number, h: number) => {
      const count = Math.round((w * h) / 3000);
      starsRef.current = Array.from(
        { length: Math.max(count, 160) },
        () => {
          const isGold = Math.random() < 0.15;
          const isMid = Math.random() < 0.25;
          const kind = isGold
            ? 3
            : isMid
              ? 2
              : Math.random() < 0.5
                ? 0
                : 1;
          const base = 0.45 + Math.random() * 0.55;
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.4,
            baseOpacity: base,
            opacity: base,
            speed: 0.003 + Math.random() * 0.012,
            phase: Math.random() * Math.PI * 2,
            kind,
          };
        },
      );
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      if (!visible) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      for (const s of starsRef.current) {
        s.phase += s.speed;
        s.opacity =
          s.baseOpacity * (0.55 + 0.45 * Math.sin(s.phase));
        const [gr, gg, gb] = STAR_GLOWS[s.kind];
        const glow = s.r * 5;
        const grad = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          glow,
        );
        grad.addColorStop(
          0,
          `rgba(${gr},${gg},${gb},${(s.opacity * 0.9).toFixed(3)})`,
        );
        grad.addColorStop(
          0.4,
          `rgba(${gr},${gg},${gb},${(s.opacity * 0.3).toFixed(3)})`,
        );
        grad.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, glow, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = STAR_COLORS[s.kind];
        ctx.globalAlpha = s.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        if (s.r > 1.2) {
          ctx.save();
          ctx.globalAlpha = s.opacity * 0.5;
          ctx.strokeStyle = STAR_COLORS[s.kind];
          ctx.lineWidth = 0.5;
          const arm = s.r * 4;
          ctx.beginPath();
          ctx.moveTo(s.x - arm, s.y);
          ctx.lineTo(s.x + arm, s.y);
          ctx.moveTo(s.x, s.y - arm);
          ctx.lineTo(s.x, s.y + arm);
          ctx.stroke();
          ctx.restore();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER BAR
═══════════════════════════════════════════════════════════════════════════ */

const TYPE_FILTERS: {
  value: MediaType | "all";
  label: string;
  Icon: React.ElementType;
}[] = [
  {
    value: "all",
    label: "All",
    Icon: () => <span style={{ fontSize: "0.8rem" }}>✦</span>,
  },
  { value: "image", label: "Images", Icon: ImageIcon },
  { value: "video", label: "Video", Icon: Film },
  { value: "writing", label: "Writing", Icon: FileText },
];

interface FilterBarProps {
  activeType: MediaType | "all";
  activeYear: number | "all";
  years: number[];
  onTypeChange: (t: MediaType | "all") => void;
  onYearChange: (y: number | "all") => void;
}

export function FilterBar({
  activeType,
  activeYear,
  years,
  onTypeChange,
  onYearChange,
}: FilterBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "stretch",
        marginBottom: 32,
        paddingInlineStart: "max(16px, env(safe-area-inset-left))",
        paddingInlineEnd: "max(16px, env(safe-area-inset-right))",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Type tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "flex-start",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 999,
          padding: "5px 6px",
          border: "1px solid rgba(255,200,87,0.1)",
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        {TYPE_FILTERS.map(({ value, label, Icon }) => {
          const active = activeType === value;
          return (
            <motion.button
              key={value}
              onClick={() => onTypeChange(value)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 14px",
                flexShrink: 0,
                whiteSpace: "nowrap" as const,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: active ? "#FFC857" : "transparent",
                color: active
                  ? "#1A1F4B"
                  : "rgba(255,255,255,0.45)",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.08em",
                transition: "all 0.22s ease",
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
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {(["all", ...years] as (number | "all")[]).map(
            (y) => {
              const active = activeYear === y;
              return (
                <motion.button
                  key={y}
                  onClick={() => onYearChange(y)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "4px 14px",
                    borderRadius: 999,
                    border: active
                      ? "1px solid rgba(255,200,87,0.7)"
                      : "1px solid rgba(255,200,87,0.18)",
                    background: active
                      ? "rgba(255,200,87,0.12)"
                      : "transparent",
                    color: active
                      ? "#FFC857"
                      : "rgba(255,255,255,0.38)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {y === "all" ? "ALL YEARS" : y}
                </motion.button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}
