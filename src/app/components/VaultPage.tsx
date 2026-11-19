import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
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
import { FilterBar } from './VaultPageChrome';
import { VaultIntro } from './VaultIntro';
import { CloudinaryImage } from "./CloudinaryImage";
import { cloudinaryVideoUrl, CLOUDINARY_CLOUD_NAME } from "../../lib/cloudinary";
import { fetchPortfolioProjects, fetchVaultItems, resolveMediaAlt, resolveMediaUrl, SanityVaultItem, type SanityPortfolioProject } from '../../lib/sanityContent';
import { SEO } from './SEO';
import { FONTS } from '../../lib/constants';

const VAULT_UNLOCK_SESSION_KEY = "boc:vault-unlocked";
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function hasVaultSessionUnlock() {
  try {
    return window.sessionStorage.getItem(VAULT_UNLOCK_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberVaultSessionUnlock() {
  try {
    window.sessionStorage.setItem(VAULT_UNLOCK_SESSION_KEY, "true");
  } catch {
    // The Vault remains usable if this browser blocks session storage.
  }
}

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
  thumbnailUrl?: string; // optional thumbnail for videos
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
   CONSTANTS  (orb reveal mechanic - unchanged)
═══════════════════════════════════════════════════════════════════════════ */

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

function generateVideoThumbnail(videoUrl: string): string | undefined {
  // Only works for Cloudinary videos
  if (!videoUrl.includes('res.cloudinary.com')) {
    return undefined;
  }

  // Extract public_id from video URL
  // Format: https://res.cloudinary.com/cloud_name/video/upload/public_id.ext
  const match = videoUrl.match(/\/video\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  if (!match) {
    return undefined;
  }

  const publicId = match[1].replace(/\.\w+$/, ''); // Remove extension if present

  // Generate thumbnail URL using first frame of video
  const thumbnailUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0,w_900,f_jpg,q_auto/${publicId}.jpg`;

  return thumbnailUrl;
}

function mapSanityVaultItem(item: SanityVaultItem, index: number): GalleryItem {
  const fallback = FALLBACK_GALLERY_DATA[index % FALLBACK_GALLERY_DATA.length];
  const imageUrl = resolveMediaUrl(item.image, 1600);
  let thumbnailUrl = item.thumbnail ? resolveMediaUrl(item.thumbnail, 900) : undefined;

  // Map category to type (video, writing, design, photography all map to 'image' in GalleryItem)
  // But we keep 'video' as 'video' for filtering purposes
  const itemType = item.category === 'video' ? 'video' : 'image';

  // For videos from Sanity, we need either imageUrl (video file) or cloudinaryUrl with a publicId
  if (itemType === 'video' && !imageUrl) {
    console.warn(`Video item "${item.title}" has no video URL. Please upload a video file or add a Cloudinary URL in Sanity.`);
  }

  // Auto-generate thumbnail from first frame of video if no manual thumbnail provided
  if (itemType === 'video' && !thumbnailUrl && imageUrl) {
    thumbnailUrl = generateVideoThumbnail(imageUrl);
  }

  return {
    id: item.slug || item._id,
    title: item.title,
    category: item.category || fallback.category,
    year: formatVaultYear(item.date),
    type: itemType,
    publicId: imageUrl ? undefined : fallback.publicId,
    imageUrl: imageUrl || undefined,
    thumbnailUrl: thumbnailUrl,
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
            fontFamily: FONTS.heading,
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
            fontFamily: FONTS.heading,
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
            fontFamily: FONTS.accent,
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
      {item.thumbnailUrl ? (
        <img
          src={item.thumbnailUrl}
          alt={`${item.title} thumbnail`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: 0.7,
            transition: "opacity 0.3s ease",
            filter: "blur(0px)",
          }}
        />
      ) : item.heroPublicId ? (
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
      ) : item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
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
            fontFamily: FONTS.heading,
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
            fontFamily: FONTS.heading,
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
            fontFamily: FONTS.accent,
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
              fontFamily: FONTS.heading,
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
            fontFamily: FONTS.heading,
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
            fontFamily: FONTS.accent,
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
              fontFamily: FONTS.accent,
              fontSize: "1.1rem",
              fontStyle: "italic",
              color: "#F6E6B4",
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
            fontFamily: FONTS.heading,
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
            fontFamily: FONTS.body,
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
            fontFamily: FONTS.heading,
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
      {item.excerpt && (
        <p
          title={item.excerpt}
          style={{
            margin: "12px 3px 0",
            color: "rgba(246,240,225,0.76)",
            fontFamily: FONTS.body,
            fontSize: "0.86rem",
            lineHeight: 1.55,
          }}
        >
          {item.excerpt}
        </p>
      )}
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
  // Handle Sanity videos (imageUrl) vs Cloudinary videos (publicId)
  const hasCloudinaryVideo = Boolean(item.publicId);
  const hasSanityVideo = Boolean(item.imageUrl && !item.publicId);

  if (!hasCloudinaryVideo && !hasSanityVideo) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#FFF",
          fontFamily: "'Space Mono', monospace",
        }}
      >
        <p>Video not available</p>
      </div>
    );
  }

  // Use Sanity video URL if available, otherwise Cloudinary
  const videoSrc = hasSanityVideo
    ? item.imageUrl
    : cloudinaryVideoUrl(item.publicId!, {
        format: "auto",
        quality: "auto",
      });

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
        key={videoSrc}
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
        <source src={videoSrc} type="video/mp4" />
        {hasCloudinaryVideo && (
          <source
            src={cloudinaryVideoUrl(item.publicId!, {
              format: "webm",
              quality: "auto",
            })}
            type="video/webm"
          />
        )}
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
            fontFamily: FONTS.heading,
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
            fontFamily: FONTS.accent,
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
                fontFamily: FONTS.body,
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
              fontFamily: FONTS.accent,
              fontSize: "1.4rem",
              fontStyle: "italic",
              color: "#F6E6B4",
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
  const [direction, setDirection] = useState(0); // -1 previous, +1 next
  const item = items[current];
  const swipeStartRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const go = useCallback(
    (dir: number) => {
      if (items.length < 2) return;
      setDirection(dir);
      setCurrent((index) => (index + dir + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, go]);

  const handleStagePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("button, video, a, input, textarea, select")
    ) {
      return;
    }
    swipeStartRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handleStagePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start || start.id !== event.pointerId) return;
    swipeStartRef.current = null;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    event.preventDefault();
    go(deltaX < 0 ? 1 : -1);
  };

  const accent = TYPE_ACCENT[item.type];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  return createPortal(
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
          padding: "12px clamp(12px, 4vw, 24px)",
          paddingTop: "max(12px, env(safe-area-inset-top))",
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
                fontFamily: FONTS.heading,
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
                fontFamily: FONTS.accent,
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
                fontFamily: FONTS.heading,
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
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.heading,
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            {current + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            style={{
              width: 48,
              height: 48,
              minWidth: 48,
              minHeight: 48,
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
            aria-label="Close viewer and return to gallery"
            title="Return to gallery"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        onPointerDown={handleStagePointerDown}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={() => { swipeStartRef.current = null; }}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          touchAction: "pan-y",
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
        {items.length > 1 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous asset"
            aria-keyshortcuts="ArrowLeft"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
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
            <ChevronLeft size={20} aria-hidden="true" />
          </motion.button>
        )}

        {/* Next arrow */}
        {items.length > 1 && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            type="button"
            onClick={() => go(1)}
            aria-label="Next asset"
            aria-keyshortcuts="ArrowRight"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
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
            <ChevronRight size={20} aria-hidden="true" />
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
    </motion.div>,
    document.body,
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
            fontFamily: FONTS.accent,
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
            fontFamily: FONTS.body,
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
                fontFamily: FONTS.accent,
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
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchVaultItems()
      .then((items) => {
        if (cancelled || !items?.length) return;
        setCmsItems(items.map(mapSanityVaultItem));
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error("Error fetching vault items:", error);
        }
        if (!cancelled) setCmsItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayItems = useMemo(
    () => (cmsItems.length ? cmsItems : FALLBACK_GALLERY_DATA),
    [cmsItems],
  );

  useIsomorphicLayoutEffect(() => {
    if (hasVaultSessionUnlock()) setShowGallery(true);
  }, []);

  const enterVault = useCallback(() => {
    rememberVaultSessionUnlock();
    setShowGallery(true);
  }, []);

  return (
    <>
      <SEO
        title="The Vault | Based on Creativity"
        description="Enter The Vault to explore an experimental gallery of moving images, visual studies, and creative artifacts from Based on Creativity."
        path="/vault"
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "#0d1235",
          overflowX: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          {!showGallery && <VaultIntro key="vault-intro" onEnter={enterVault} />}
        </AnimatePresence>
        {showGallery && <BentoVault items={displayItems} />}
      </div>
    </>
  );
}
