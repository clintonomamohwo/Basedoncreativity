import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
} from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  FileText,
  Film,
} from "lucide-react";
import { FilterBar, StarCanvas } from './VaultPageChrome';
import { CloudinaryImage } from "./CloudinaryImage";
import { cloudinaryVideoUrl } from "../../lib/cloudinary";
import { fetchPortfolioProjects, fetchVaultItems, resolveMediaAlt, resolveMediaUrl, SanityVaultItem, type SanityPortfolioProject } from '../../lib/sanityContent';
import { SEO } from './SEO';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

type MediaType = "image" | "video" | "writing";

interface GalleryItem {
  id: string | number;
  title: string;
  category: string;
  year: number;
  type: MediaType;
  // Image / Video
  publicId?: string;
  imageUrl?: string;
  imageAlt?: string;
  aspect?: "landscape" | "portrait" | "square";
  // Writing
  excerpt?: string;
  body?: string;
  heroPublicId?: string; // optional hero image for writing card
  // Bento size hint
  size?: "sm" | "md" | "lg";
}

/* ═══════════════════════════════════════════════════════════════════════════
   GALLERY DATA
   Add images, videos and writing pieces here.
   Videos: set type:'video' and provide a Cloudinary video publicId.
   Writing: set type:'writing' and provide excerpt + body text.
═══════════════════════════════════════════════════════════════════════════ */

const FALLBACK_GALLERY_DATA: GalleryItem[] = [
  // ── Images ──────────────────────────────────────────────────────────────
  {
    id: 1,
    year: 2025,
    type: "image",
    title: "Royal Dog",
    category: "Illustration",
    publicId: "Royal_Dog_dpz0gl",
    aspect: "portrait",
  },
  {
    id: 2,
    year: 2020,
    type: "image",
    title: "Trevor J",
    category: "Portrait",
    publicId: "TrevorJ1_de3b13",
    aspect: "landscape",
  },
  {
    id: 3,
    year: 2020,
    type: "image",
    title: "NBA",
    category: "Illustration",
    publicId: "NBA_yc2yyg",
    aspect: "landscape",
  },
  {
    id: 4,
    year: 2020,
    type: "image",
    title: "Work The Dream",
    category: "Illustration",
    publicId: "Work_The_Dream_po2wzn",
    aspect: "landscape",
  },
  {
    id: 5,
    year: 2021,
    type: "image",
    title: "Glow Penguin",
    category: "Illustration",
    publicId: "Glow_Penguin_g8hzna",
    aspect: "landscape",
  },
  {
    id: 6,
    year: 2021,
    type: "image",
    title: "Music Cosmo",
    category: "Illustration",
    publicId: "MusicCosmo_jv8rlb",
    aspect: "square",
  },
  {
    id: 7,
    year: 2021,
    type: "image",
    title: "The Tiger Queen",
    category: "Illustration",
    publicId: "The_Tiger_Queen_rhpere",
    aspect: "landscape",
  },
  {
    id: 8,
    year: 2021,
    type: "image",
    title: "Golden Fox",
    category: "Illustration",
    publicId: "Golden_Fox_f0mdvp",
    aspect: "landscape",
  },
  {
    id: 9,
    year: 2021,
    type: "image",
    title: "Avatar Creation",
    category: "Illustration",
    publicId: "Avatar_creation_gqdfew",
    aspect: "square",
  },
  {
    id: 10,
    year: 2024,
    type: "video",
    title: "Universal Unison",
    category: "Animation",
    publicId: "Universal_Unison_xh0wnp",
    aspect: "landscape",
  },
  {
    id: 11,
    year: 2024,
    type: "video",
    title: "SafeSpace",
    category: "Animation",
    publicId: "SafeSpace_npkink",
    aspect: "landscape",
  },
  {
    id: 12,
    year: 2024,
    type: "video",
    title: "Basketball Animation",
    category: "Animation",
    publicId: "Basketball_Animation_elg8be",
    aspect: "landscape",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS  (orb reveal mechanic — unchanged)
═══════════════════════════════════════════════════════════════════════════ */

const EAST_THRESHOLD = 0.75;
const LIGHT_REVEAL_MS = 2500;
const ORB_RADIUS = 64;
const NAV_HEIGHT = 80;

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════════════════ */

function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function buildGradient(
  x: number,
  y: number,
  light: number,
): string {
  const gA = (light * 0.45).toFixed(3);
  const gB = (light * 0.18).toFixed(3);
  const stop2 = `${(light * 15).toFixed(1)}%`;
  const stop3 =
    light > 0.01
      ? `${Math.min(light * 35 + 20, 65).toFixed(1)}%`
      : "100%";
  return [
    `radial-gradient(ellipse at ${x}px ${y}px, rgba(255,248,220,${gA}) 0%, rgba(255,200,87,${gB}) ${stop2}, transparent ${stop3})`,
    `radial-gradient(ellipse at 60% 20%, #1e2d6e 0%, #1A1F4B 45%, #0d1235 100%)`,
  ].join(", ");
}

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function formatVaultYear(date?: string) {
  if (!date) return new Date().getFullYear();
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date().getFullYear() : parsed.getFullYear();
}

function mapSanityVaultItem(item: SanityVaultItem, index: number): GalleryItem {
  const fallback = FALLBACK_GALLERY_DATA[index % FALLBACK_GALLERY_DATA.length];
  const imageUrl = resolveMediaUrl(item.image, 1600);

  return {
    id: item.slug || item._id,
    title: item.title,
    category: item.category || fallback.category,
    year: formatVaultYear(item.date),
    type: 'image',
    publicId: imageUrl ? undefined : fallback.publicId,
    imageUrl: imageUrl || undefined,
    imageAlt: resolveMediaAlt(item.image, `${item.title} artwork`),
    aspect: fallback.aspect || 'landscape',
    excerpt: item.description || undefined,
    size: item.featured ? 'lg' : fallback.size,
  };
}

function VaultImage({
  item,
  alt,
  cloudinaryOptions,
  className,
  style,
}: {
  item: GalleryItem;
  alt: string;
  cloudinaryOptions?: React.ComponentProps<typeof CloudinaryImage>['cloudinaryOptions'];
  className?: string;
  style?: React.CSSProperties;
}) {
  if (item.imageUrl) {
    return <img src={item.imageUrl} alt={alt} className={className} style={style} loading="lazy" decoding="async" />;
  }

  if (item.publicId) {
    return (
      <CloudinaryImage
        publicId={item.publicId}
        alt={alt}
        cloudinaryOptions={cloudinaryOptions}
        className={className}
        style={style}
      />
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAR CANVAS  (unchanged)
═══════════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════════
   BENTO CARDS
═══════════════════════════════════════════════════════════════════════════ */

const TYPE_ACCENT: Record<MediaType, string> = {
  image: "#FFC857",
  video: "#7B9CFF",
  writing: "#C9B89A",
};

interface BentoCardProps {
  item: GalleryItem;
  onClick: () => void;
  index: number;
  colSpan: number; // calculated by parent
}

function ImageBentoCard({
  item,
  onClick,
  index,
}: Omit<BentoCardProps, "colSpan">) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        background: "#0d1235",
        minHeight: 280,
        border: hovered
          ? "1px solid rgba(255,200,87,0.5)"
          : "1px solid rgba(255,200,87,0.1)",
        transition: "border-color 0.25s ease",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {(item.imageUrl || item.publicId) && (
        <VaultImage
          item={item}
          alt={item.imageAlt || item.title}
          cloudinaryOptions={{
            width: 700,
            format: "auto",
            quality: "auto",
            fit: "fill",
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.55s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            position: "absolute",
            inset: 0,
          }}
        />
      )}
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(10,13,40,0.92) 0%, rgba(10,13,40,0.2) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Type badge */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 10px",
          borderRadius: 999,
          background: "rgba(10,13,40,0.7)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${TYPE_ACCENT.image}33`,
        }}
      >
        <ImageIcon
          size={10}
          style={{ color: TYPE_ACCENT.image }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            color: TYPE_ACCENT.image,
            letterSpacing: "0.1em",
          }}
        >
          IMAGE
        </span>
      </div>
      {/* Meta */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "18px 18px 16px",
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            color: "rgba(255,200,87,0.55)",
            letterSpacing: "0.1em",
            margin: "0 0 5px",
          }}
        >
          {item.category.toUpperCase()} · {item.year}
        </p>
        <h4
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.2rem",
            color: "#F6E6B4",
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          {item.title}
        </h4>
      </div>
    </motion.div>
  );
}

function VideoBentoCard({
  item,
  onClick,
  index,
}: Omit<BentoCardProps, "colSpan">) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        background: "#080d22",
        minHeight: 300,
        border: hovered
          ? "1px solid rgba(123,156,255,0.5)"
          : "1px solid rgba(123,156,255,0.12)",
        transition:
          "border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.55)"
          : "0 4px 20px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Thumbnail or gradient bg */}
      {item.heroPublicId ? (
        <CloudinaryImage
          publicId={item.heroPublicId}
          alt={item.title}
          cloudinaryOptions={{
            width: 900,
            format: "auto",
            quality: "auto",
            fit: "fill",
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: 0.55,
            transition: "opacity 0.3s ease",
            filter: "blur(2px)",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 40% 50%, #1a2a6c 0%, #0a0e22 100%)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(8,13,34,0.95) 0%, rgba(8,13,34,0.3) 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Play button */}
      <motion.div
        animate={{ scale: hovered ? 1.12 : 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "relative",
          zIndex: 2,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: hovered
            ? "rgba(123,156,255,0.25)"
            : "rgba(123,156,255,0.12)",
          border: "2px solid rgba(123,156,255,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          transition: "background 0.25s ease",
        }}
      >
        <Play
          size={22}
          style={{ color: "#7B9CFF", marginLeft: 4 }}
          fill="#7B9CFF"
        />
      </motion.div>

      {/* Type badge */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 10px",
          borderRadius: 999,
          background: "rgba(8,13,34,0.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(123,156,255,0.25)",
        }}
      >
        <Film size={10} style={{ color: TYPE_ACCENT.video }} />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            color: TYPE_ACCENT.video,
            letterSpacing: "0.1em",
          }}
        >
          VIDEO
        </span>
      </div>

      {/* Meta */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "18px 18px 16px",
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            color: "rgba(123,156,255,0.6)",
            letterSpacing: "0.1em",
            margin: "0 0 5px",
          }}
        >
          {item.category.toUpperCase()} · {item.year}
        </p>
        <h4
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.2rem",
            color: "#E8EEFF",
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          {item.title}
        </h4>
      </div>
    </motion.div>
  );
}

function WritingBentoCard({
  item,
  onClick,
  index,
}: Omit<BentoCardProps, "colSpan">) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        background: hovered ? "#2a2218" : "#1e1a14",
        minHeight: 280,
        padding: "28px 26px 22px",
        border: hovered
          ? "1px solid rgba(201,184,154,0.45)"
          : "1px solid rgba(201,184,154,0.15)",
        transition: "all 0.25s ease",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Decorative ruled lines */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${30 + i * 36}px`,
            height: 1,
            background: "rgba(201,184,154,0.06)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Type badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginBottom: 18,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(201,184,154,0.1)",
            border: "1px solid rgba(201,184,154,0.2)",
          }}
        >
          <FileText
            size={10}
            style={{ color: TYPE_ACCENT.writing }}
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              color: TYPE_ACCENT.writing,
              letterSpacing: "0.1em",
            }}
          >
            WRITING
          </span>
        </div>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            color: "rgba(201,184,154,0.4)",
            letterSpacing: "0.1em",
          }}
        >
          {item.year}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        {/* Opening quote mark */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "4rem",
            color: "rgba(201,184,154,0.15)",
            lineHeight: 1,
            marginBottom: -16,
            userSelect: "none",
          }}
        >
          "
        </div>
        {item.excerpt && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.1rem",
              fontStyle: "italic",
              color: "#D4C5A9",
              lineHeight: 1.65,
              margin: "0 0 20px",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.excerpt}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(201,184,154,0.1)",
          paddingTop: 14,
        }}
      >
        <h4
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#C9B89A",
            margin: "0 0 4px",
            letterSpacing: "0.06em",
          }}
        >
          {item.title}
        </h4>
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.7rem",
            color: "rgba(201,184,154,0.45)",
            margin: 0,
          }}
        >
          {item.category}
        </p>
      </div>

      {/* Read CTA */}
      <motion.div
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 6,
        }}
        style={{
          position: "absolute",
          bottom: 18,
          right: 18,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            color: "#C9B89A",
            letterSpacing: "0.1em",
          }}
        >
          READ
        </span>
        <ChevronRight size={12} style={{ color: "#C9B89A" }} />
      </motion.div>
    </motion.div>
  );
}

const BentoCard = React.forwardRef<
  HTMLDivElement,
  BentoCardProps
>(function BentoCard({ item, onClick, index, colSpan }, ref) {
  const props = { item, onClick, index };
  const card =
    item.type === "image" ? (
      <ImageBentoCard {...props} />
    ) : item.type === "video" ? (
      <VideoBentoCard {...props} />
    ) : (
      <WritingBentoCard {...props} />
    );
  return (
    <div ref={ref} style={{ gridColumn: `span ${colSpan}` }}>
      {card}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   FULL-SCREEN DECK VIEWS
═══════════════════════════════════════════════════════════════════════════ */

function DeckImageView({ item }: { item: GalleryItem }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blurred bg */}
      {(item.imageUrl || item.publicId) && (
        <div
          style={{
            position: "absolute",
            inset: "-40px",
            filter: "blur(40px)",
            opacity: 0.35,
          }}
        >
          <VaultImage
            item={item}
            alt=""
            cloudinaryOptions={{
              width: 400,
              format: "auto",
              quality: 30,
              fit: "fill",
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}
      {/* Main image */}
      {(item.imageUrl || item.publicId) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: "relative",
            zIndex: 1,
            maxHeight: "78vh",
            maxWidth: "90%",
          }}
        >
          <VaultImage
            item={item}
            alt={item.imageAlt || item.title}
            cloudinaryOptions={{
              width: 1400,
              format: "auto",
              quality: "auto",
            }}
            style={{
              maxHeight: "78vh",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
              borderRadius: 4,
              boxShadow: "0 32px 100px rgba(0,0,0,0.8)",
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

function DeckVideoView({ item }: { item: GalleryItem }) {
  const src = item.publicId
    ? cloudinaryVideoUrl(item.publicId, {
        format: "auto",
        quality: "auto",
      })
    : "";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <motion.video
        key={src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        controls
        autoPlay
        playsInline
        style={{
          maxWidth: "100%",
          maxHeight: "82vh",
          outline: "none",
          borderRadius: 4,
          boxShadow: "0 32px 100px rgba(0,0,0,0.8)",
        }}
      >
        <source src={src} type="video/mp4" />
        <source
          src={cloudinaryVideoUrl(item.publicId ?? "", {
            format: "webm",
            quality: "auto",
          })}
          type="video/webm"
        />
      </motion.video>
    </div>
  );
}

function DeckWritingView({ item }: { item: GalleryItem }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 680, width: "100%" }}
      >
        {/* Category + year */}
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem",
            color: "rgba(201,184,154,0.6)",
            letterSpacing: "0.14em",
            marginBottom: 16,
          }}
        >
          {item.category.toUpperCase()} · {item.year}
        </p>
        {/* Title */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 400,
            color: "#F6E6B4",
            marginBottom: 32,
            lineHeight: 1.2,
            letterSpacing: "0.04em",
          }}
        >
          {item.title}
        </h2>
        {/* Gold rule */}
        <div
          style={{
            width: 60,
            height: 2,
            background:
              "linear-gradient(90deg, #FFC857, transparent)",
            marginBottom: 36,
          }}
        />
        {/* Body */}
        {item.body ? (
          item.body.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              {para}
            </p>
          ))
        ) : item.excerpt ? (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem",
              fontStyle: "italic",
              color: "#D4C5A9",
              lineHeight: 1.65,
            }}
          >
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

function FullScreenDeck({
  items,
  startIndex,
  onClose,
}: DeckProps) {
  const [current, setCurrent] = useState(startIndex);
  const [direction, setDirection] = useState(0); // −1 prev, +1 next
  const item = items[current];

  const go = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((c) =>
        Math.max(0, Math.min(items.length - 1, c + dir)),
      );
    },
    [items.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, go]);

  const accent = TYPE_ACCENT[item.type];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background:
          item.type === "writing"
            ? "#100e0a"
            : "rgba(4,5,18,0.97)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          flexShrink: 0,
          borderBottom: `1px solid ${accent}18`,
          background: "rgba(0,0,0,0.3)",
        }}
      >
        {/* Left: type + title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 999,
              border: `1px solid ${accent}44`,
              flexShrink: 0,
            }}
          >
            {item.type === "image" && (
              <ImageIcon size={11} style={{ color: accent }} />
            )}
            {item.type === "video" && (
              <Film size={11} style={{ color: accent }} />
            )}
            {item.type === "writing" && (
              <FileText size={11} style={{ color: accent }} />
            )}
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.58rem",
                color: accent,
                letterSpacing: "0.1em",
              }}
            >
              {item.type.toUpperCase()}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.1rem",
                color: "#F6E6B4",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.57rem",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.08em",
                margin: "2px 0 0",
              }}
            >
              {item.category} · {item.year}
            </p>
          </div>
        </div>

        {/* Right: counter + close */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            {current + 1} / {items.length}
          </span>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "rgba(255,255,255,0.14)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "rgba(255,255,255,0.07)")
            }
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={item.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ position: "absolute", inset: 0 }}
          >
            {item.type === "image" && (
              <DeckImageView item={item} />
            )}
            {item.type === "video" && (
              <DeckVideoView item={item} />
            )}
            {item.type === "writing" && (
              <DeckWritingView item={item} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Prev arrow */}
        {current > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => go(-1)}
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
              zIndex: 10,
              transition: "background 0.2s ease",
            }}
            whileHover={
              {
                scale: 1.08,
                background: "rgba(255,255,255,0.14)",
              } as never
            }
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
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
              zIndex: 10,
              transition: "background 0.2s ease",
            }}
            whileHover={
              {
                scale: 1.08,
                background: "rgba(255,255,255,0.14)",
              } as never
            }
            whileTap={{ scale: 0.94 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </div>

      {/* ── Progress dots ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          padding: "14px 24px",
          flexShrink: 0,
        }}
      >
        {items.map((it, i) => (
          <motion.button
            key={it.id}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            animate={{
              width: i === current ? 24 : 6,
              background:
                i === current
                  ? accent
                  : "rgba(255,255,255,0.2)",
            }}
            transition={{ duration: 0.25 }}
            style={{
              height: 6,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              padding: 0,
              outline: "none",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BENTO VAULT  (grid + deck combined)
═══════════════════════════════════════════════════════════════════════════ */

function BentoVault({ items }: { items: GalleryItem[] }) {
  const [activeType, setActiveType] = useState<
    MediaType | "all"
  >("all");
  const [activeYear, setActiveYear] = useState<number | "all">(
    "all",
  );
  const [deckIndex, setDeckIndex] = useState<number | null>(
    null,
  );
  const windowWidth = useWindowWidth();

  const years = useMemo(
    () =>
      [...new Set(items.map((i) => i.year))].sort(
        (a, b) => b - a,
      ),
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const typeMatch =
          activeType === "all" || item.type === activeType;
        const yearMatch =
          activeYear === "all" || item.year === activeYear;
        return typeMatch && yearMatch;
      }),
    [activeType, activeYear, items],
  );

  // Column spans based on viewport
  const getColSpan = (item: GalleryItem): number => {
    if (windowWidth < 640) return 6; // full on mobile
    if (windowWidth < 1024) {
      if (item.type === "video") return 6;
      return 3;
    }
    // desktop
    if (item.type === "video") return 3; // span 3 of 6
    return 2; // span 2 of 6
  };

  const handleOpen = useCallback(
    (item: GalleryItem) => {
      const idx = filtered.findIndex((f) => f.id === item.id);
      if (idx !== -1) setDeckIndex(idx);
    },
    [filtered],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        zIndex: 10,
      }}
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          textAlign: "center",
          padding:
            "clamp(80px, 7vw, 96px) clamp(24px, 5vw, 80px) 0",
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: 300,
            color: "#FFC857",
            letterSpacing: "0.12em",
            marginBottom: 10,
            textShadow: "0 2px 20px rgba(255,200,87,0.3)",
          }}
        >
          The Vault
        </h2>
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            color: "rgba(255,255,255,0.45)",
            maxWidth: 480,
            margin: "0 auto 32px",
            lineHeight: 1.65,
          }}
        >
          A curated archive: images, video, and writing,
          organised by year.
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
      <div
        style={{
          padding:
            "clamp(16px, 3vw, 40px) clamp(20px, 4vw, 64px) 80px",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "80px 24px",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.4rem",
                fontStyle: "italic",
                color: "rgba(255,200,87,0.4)",
              }}
            >
              Nothing in the vault for this filter yet.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "clamp(10px, 1.8vw, 20px)",
              alignItems: "start",
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
  const [cmsItems, setCmsItems] = useState<GalleryItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [hasTransformed, setHasTransformed] = useState(false);
  const [showVaultText, setShowVaultText] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [eastProgress, setEastProgress] = useState(0);
  const [trailDots, setTrailDots] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const trailIdRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasTransformedRef = useRef(false);
  const showGalleryRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const moonOffsetRef = useRef({ x: 0, y: 0 });
  const lightRef = useRef(0);
  const rafRef = useRef<number>(0);

   const moonX = useMotionValue(120);
  const moonY = useMotionValue(300);

  useEffect(() => {
    let cancelled = false;

    fetchVaultItems()
      .then((items) => {
        if (cancelled || !items?.length) return;
        setCmsItems(items.map(mapSanityVaultItem));
      })
      .catch(() => {
        if (!cancelled) {
          setCmsItems([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayItems = useMemo(
    () => (cmsItems.length ? cmsItems : FALLBACK_GALLERY_DATA),
    [cmsItems],
  );

  useEffect(() => {
    const w = window.innerWidth,
      h = window.innerHeight;
    moonX.set(
      ORB_RADIUS +
        20 +
        Math.random() * (w * 0.32 - ORB_RADIUS - 20),
    );
    moonY.set(
      NAV_HEIGHT +
        ORB_RADIUS +
        20 +
        Math.random() * (h - NAV_HEIGHT - ORB_RADIUS * 2 - 40),
    );
  }, [moonX, moonY]);

  const applyBackground = useCallback(() => {
    if (!containerRef.current || showGalleryRef.current) return;
    containerRef.current.style.background = buildGradient(
      moonX.get(),
      moonY.get(),
      lightRef.current,
    );
  }, [moonX, moonY]);

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.style.background =
        "radial-gradient(ellipse at 60% 20%, #1e2d6e 0%, #1A1F4B 45%, #0d1235 100%)";
  }, []);

  const triggerTransformation = useCallback(() => {
    if (hasTransformedRef.current) return;
    hasTransformedRef.current = true;
    setHasTransformed(true);
    setTrailDots([]);
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(
        (now - startTime) / LIGHT_REVEAL_MS,
        1,
      );
      lightRef.current = easeInOutCubic(progress);
      applyBackground();
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShowVaultText(true), 400);
        setTimeout(() => {
          showGalleryRef.current = true;
          setShowGallery(true);
          if (containerRef.current)
            containerRef.current.style.background = "#0d1235";
        }, 1900);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [applyBackground]);

  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      dragStartRef.current = { x: clientX, y: clientY };
      moonOffsetRef.current = {
        x: moonX.get(),
        y: moonY.get(),
      };
      setIsDragging(true);
    },
    [moonX, moonY],
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDraggingRef.current || !containerRef.current)
        return;
      const { width, height } =
        containerRef.current.getBoundingClientRect();
      const x = Math.max(
        ORB_RADIUS,
        Math.min(
          width - ORB_RADIUS,
          moonOffsetRef.current.x +
            (clientX - dragStartRef.current.x),
        ),
      );
      const y = Math.max(
        NAV_HEIGHT + ORB_RADIUS,
        Math.min(
          height - ORB_RADIUS,
          moonOffsetRef.current.y +
            (clientY - dragStartRef.current.y),
        ),
      );
      moonX.set(x);
      moonY.set(y);
      applyBackground();
      // East progress 0→1
      setEastProgress(
        Math.min(x / (width * EAST_THRESHOLD), 1),
      );
      // Motion trail — last 12 positions
      setTrailDots((prev) => [
        ...prev.slice(-11),
        { id: trailIdRef.current++, x, y },
      ]);
      if (x > width * EAST_THRESHOLD) triggerTransformation();
    },
    [moonX, moonY, applyBackground, triggerTransformation],
  );

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setTimeout(() => setTrailDots([]), 350);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) =>
      handleDragMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (
        !isDraggingRef.current ||
        showGalleryRef.current ||
        e.touches.length === 0
      ) {
        return;
      }
      e.preventDefault();
      handleDragMove(
        e.touches[0].clientX,
        e.touches[0].clientY,
      );
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    window.addEventListener("touchend", handleDragEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleDragMove, handleDragEnd]);

  return (
    <>
      <SEO title="The Vault | Based on Creativity" description="Enter The Vault to explore an experimental gallery of moving images, visual studies, and creative artifacts from Based on Creativity." path="/vault" />
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#1A1F4B",
        overflow: showGallery ? "visible" : "hidden",
        cursor: isDragging ? "grabbing" : "default",
        touchAction: showGallery ? "auto" : "none",
      }}
    >
      <StarCanvas visible={!showGallery} />

      <div
        style={{
          position: "relative",
          maxWidth: 1920,
          margin: "0 auto",
          width: "100%",
          height: showGallery ? "0" : "100vh",
          display: showGallery ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 clamp(20px, 5vw, 80px)",
        }}
      >
        {/* ── Motion trail ── */}
        {trailDots.map((dot, i) => {
          const ageFraction =
            i / Math.max(trailDots.length - 1, 1);
          const size =
            ORB_RADIUS * 2 * (0.08 + ageFraction * 0.42);
          const opacity = 0.03 + ageFraction * 0.16;
          return (
            <div
              key={dot.id}
              style={{
                position: "absolute",
                left: dot.x,
                top: dot.y,
                transform: "translate(-50%, -50%)",
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(255,200,87,${opacity.toFixed(3)}), transparent 70%)`,
                pointerEvents: "none",
                zIndex: 25,
              }}
            />
          );
        })}

        {/* ── East threshold glow line ── */}
        {!showGallery && !hasTransformed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isDragging
                ? 0.1 + eastProgress * 0.5
                : 0.06,
            }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute",
              right: `${(1 - EAST_THRESHOLD) * 100}%`,
              top: 0,
              bottom: 0,
              width: "1px",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,200,87,0.75) 25%, rgba(255,200,87,0.75) 75%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}

        {/* ── East directional cue — right-edge column ── */}
        {!showGallery && !hasTransformed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isDragging ? 0 : 1 }}
            transition={{
              duration: 0.5,
              delay: isDragging ? 0 : 0,
            }}
            style={{
              position: "absolute",
              right: "clamp(16px, 3vw, 40px)",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                color: "rgba(255,200,87,0.5)",
                marginBottom: "2px",
              }}
            >
              E
            </span>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.2, 0.7, 0.2],
                  x: [0, 4, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.22,
                }}
                style={{
                  width: "9px",
                  height: "9px",
                  borderTop:
                    "1.5px solid rgba(255,200,87,0.55)",
                  borderRight:
                    "1.5px solid rgba(255,200,87,0.55)",
                  transform: "rotate(45deg)",
                }}
              />
            ))}
            <motion.span
              animate={{ opacity: [0.25, 0.6, 0.25] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              style={{
                marginTop: "6px",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.52rem",
                letterSpacing: "0.14em",
                color: "rgba(255,200,87,0.38)",
                textTransform: "uppercase",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              open vault
            </motion.span>
          </motion.div>
        )}

        {/* ── Draggable Orb ── */}
        <AnimatePresence mode="wait">
          {!showGallery && (
            <motion.div
              key="celestial"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseDown={(e) =>
                handleDragStart(e.clientX, e.clientY)
              }
              onTouchStart={(e) =>
                handleDragStart(
                  e.touches[0].clientX,
                  e.touches[0].clientY,
                )
              }
              style={{
                position: "absolute",
                left: moonX,
                top: moonY,
                translateX: "-50%",
                translateY: "-50%",
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: 30,
                touchAction: "none",
                userSelect: "none",
              }}
            >
              {/* Magnetic glow — expands and brightens as orb approaches east */}
              {!hasTransformed && (
                <div
                  style={{
                    position: "absolute",
                    inset: `${-18 - eastProgress * 52}px`,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(255,200,87,${(0.06 + eastProgress * 0.36).toFixed(3)}), transparent 65%)`,
                    pointerEvents: "none",
                    transition: "inset 0.06s ease",
                  }}
                />
              )}

              {/* Primary ripple pulse */}
              {!hasTransformed && (
                <motion.div
                  animate={{
                    scale: [1, 1.85, 1],
                    opacity: [0.55, 0, 0.55],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    inset: "-20px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,200,87,0.7)",
                    pointerEvents: "none",
                  }}
                />
              )}
              {/* Slow outer ripple */}
              {!hasTransformed && (
                <motion.div
                  animate={{
                    scale: [1, 2.5, 1],
                    opacity: [0.22, 0, 0.22],
                  }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.9,
                  }}
                  style={{
                    position: "absolute",
                    inset: "-20px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,200,87,0.35)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* "DRAG EAST" label above orb (idle only) */}
              {!hasTransformed && !isDragging && (
                <motion.div
                  animate={{ opacity: [0.45, 0.85, 0.45] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  }}
                  style={{
                    position: "absolute",
                    top: "-30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.48rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: "rgba(255,200,87,0.7)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  DRAG EAST →
                </motion.div>
              )}

              {/* Idle nudge chevrons — three stacked pointing east, appear beside orb */}
              {!hasTransformed && !isDragging && (
                <motion.div
                  animate={{
                    x: [0, 8, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    right: "-44px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    pointerEvents: "none",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderTop:
                          "1.5px solid rgba(255,200,87,0.9)",
                        borderRight:
                          "1.5px solid rgba(255,200,87,0.9)",
                        transform: "rotate(45deg)",
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* East progress arc — thin gold ring fills as orb moves east */}
              {!hasTransformed &&
                isDragging &&
                eastProgress > 0.04 && (
                  <svg
                    viewBox="0 0 128 128"
                    style={{
                      position: "absolute",
                      inset: "-6px",
                      width: "calc(100% + 12px)",
                      height: "calc(100% + 12px)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke={`rgba(255,200,87,${0.25 + eastProgress * 0.55})`}
                      strokeWidth="2"
                      strokeDasharray={`${eastProgress * 376.99} 376.99`}
                      strokeLinecap="round"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                )}

              <motion.div
                animate={{
                  rotate: hasTransformed ? 360 : 0,
                  scale: hasTransformed ? [1, 1.3, 1.5] : 1,
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  width: "clamp(72px, 16vw, 120px)",
                  height: "clamp(72px, 16vw, 120px)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: hasTransformed
                      ? "radial-gradient(circle, #FFF8DC 0%, #FFC857 50%, #FFB347 100%)"
                      : "radial-gradient(circle at 30% 30%, #F0F0F0 0%, #D8D7DB 50%, #A0A0A0 100%)",
                    boxShadow: hasTransformed
                      ? "0 0 30px rgba(255,200,87,0.55), 0 0 60px rgba(255,200,87,0.25)"
                      : `0 0 ${20 + eastProgress * 44}px rgba(216,215,219,${(0.3 + eastProgress * 0.5).toFixed(2)}), inset -10px -10px 30px rgba(0,0,0,0.2)`,
                    transition:
                      "background 1s ease-out, box-shadow 0.1s ease-out",
                  }}
                />
                {hasTransformed &&
                  Array.from({ length: 12 }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: [0.6, 0.3, 0.6],
                      }}
                      transition={{
                        scale: {
                          duration: 0.6,
                          delay: i * 0.05,
                        },
                        opacity: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "clamp(50px, 10vw, 80px)",
                        height: 3,
                        background:
                          "linear-gradient(90deg, #FFC857, transparent)",
                        transformOrigin: "0 50%",
                        transform: `rotate(${i * 30}deg)`,
                        filter: "blur(1px)",
                      }}
                    />
                  ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Compass + onboarding ── */}
        {!showGallery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: hasTransformed ? 0 : 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
              maxWidth: "440px",
              textAlign: "center",
            }}
          >
            <svg
              viewBox="0 0 200 200"
              style={{
                width: "clamp(140px, 40vw, 200px)",
                height: "clamp(140px, 40vw, 200px)",
                filter:
                  "drop-shadow(0 4px 20px rgba(255,200,87,0.4))",
              }}
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#FFC857"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="100"
                y1="20"
                x2="100"
                y2="30"
                stroke="#FFC857"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="100"
                y1="170"
                x2="100"
                y2="180"
                stroke="#FFC857"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="20"
                y1="100"
                x2="30"
                y2="100"
                stroke="#FFC857"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="170"
                y1="100"
                x2="180"
                y2="100"
                stroke="#FFC857"
                strokeWidth="2"
                opacity="0.6"
              />
              <text
                x="100"
                y="14"
                textAnchor="middle"
                fill="#FFC857"
                fontSize="15"
                fontWeight="bold"
                fontFamily="'Space Mono', monospace"
              >
                N
              </text>
              <text
                x="100"
                y="198"
                textAnchor="middle"
                fill="#FFC857"
                fontSize="15"
                fontWeight="bold"
                fontFamily="'Space Mono', monospace"
                opacity="0.75"
              >
                S
              </text>
              <text
                x="10"
                y="104"
                textAnchor="middle"
                fill="#FFC857"
                fontSize="15"
                fontWeight="bold"
                fontFamily="'Space Mono', monospace"
                opacity="0.75"
              >
                W
              </text>
              <motion.text
                x="192"
                y="104"
                textAnchor="middle"
                fill="#FFC857"
                fontSize="16"
                fontWeight="bold"
                fontFamily="'Space Mono', monospace"
                animate={{ opacity: [1, 0.45, 1] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                E
              </motion.text>
              <motion.line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke="#FFC857"
                strokeWidth="3"
                strokeLinecap="round"
                animate={{ rotate: [-15, -12, -15] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "100px 100px" }}
              />
              <motion.line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke="#FFC857"
                strokeWidth="3"
                strokeLinecap="round"
                animate={{ rotate: [15, 18, 15] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "100px 100px" }}
              />
              <circle cx="100" cy="100" r="5" fill="#FFC857" />
              <motion.polygon
                points="100,25 95,20 105,20"
                fill="#FFC857"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              style={{
                marginTop: 28,
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.05rem, 2.8vw, 1.35rem)",
                fontStyle: "italic",
                fontWeight: 600,
                color: "#FFC857",
                letterSpacing: "0.07em",
              }}
            >
              "The sun rises in the east."
            </motion.p>

            {/* Primary drag instruction */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ delay: 2, duration: 1 }}
              style={{
                marginTop: 10,
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.78rem",
                color: "#FFC857",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Drag the orb east to open the vault
            </motion.p>

            {/* Onboarding description — what the vault actually contains */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.8,
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                marginTop: 18,
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)",
                color: "rgba(255,255,255,0.36)",
                lineHeight: 1.7,
                letterSpacing: "0.02em",
                padding: "0 12px",
              }}
            >
              The vault holds rare fragments, early previews,
              and hidden material from BOC's developing worlds —
              things not yet ready to be announced, but too
              alive to remain entirely unseen.
            </motion.p>

            {/* Content type chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.6, duration: 1 }}
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              {["Images", "Writing", "Video"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.52rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,200,87,0.42)",
                    border: "1px solid rgba(255,200,87,0.14)",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "rgba(255,200,87,0.04)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── Vault text flash ── */}
        <AnimatePresence>
          {showVaultText && !showGallery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                translateX: "-50%",
                translateY: "-50%",
                textAlign: "center",
                zIndex: 30,
                width: "100%",
                padding: "0 24px",
              }}
            >
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.5rem, 8vw, 5rem)",
                  fontWeight: 300,
                  color: "#FFF8DC",
                  letterSpacing: "0.15em",
                  textShadow:
                    "0 4px 40px rgba(255,200,87,0.6), 0 0 80px rgba(255,248,220,0.4)",
                  margin: 0,
                }}
              >
                The Vault Awaits
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Bento Vault (outside the fixed-height orb wrapper) ── */}
      <AnimatePresence>
        {showGallery && <BentoVault items={displayItems} />}
      </AnimatePresence>
    </div>
    </>
  );
}
