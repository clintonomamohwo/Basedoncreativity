import { CloudinaryImage } from './CloudinaryImage';

interface StorySection {
  type: 'text' | 'image';
  content?: string;
  publicId?: string;
  caption?: string;
}

export function getStoryPalette(publicId?: string) {
  const defaultPalette = {
    from: '#1A1F4B',
    to: '#0E1331',
    accent: '#FFC857',
    detail: '#F6E6B4',
  };

  if (!publicId) {
    return defaultPalette;
  }

  if (publicId.includes('moon-listener')) {
    return { from: '#111A44', to: '#26377A', accent: '#FFD988', detail: '#E8EDFF' };
  }

  if (publicId.includes('compass-dream')) {
    return { from: '#15314A', to: '#245C6D', accent: '#F0C36D', detail: '#D8F4FF' };
  }

  if (publicId.includes('quiet-spark')) {
    return { from: '#48214B', to: '#A14767', accent: '#FFD27A', detail: '#FFE8DA' };
  }

  if (publicId.includes('fragments')) {
    return { from: '#1E2748', to: '#5C4B87', accent: '#F9D67B', detail: '#F1E9FF' };
  }

  if (publicId.includes('clockmaker')) {
    return { from: '#3B2517', to: '#7A5435', accent: '#F7C779', detail: '#FFF0D6' };
  }

  if (publicId.includes('last-voyage')) {
    return { from: '#102B46', to: '#1E5678', accent: '#F8CD76', detail: '#E0F4FF' };
  }

  return defaultPalette;
}

function escapeSvgText(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createStoryFallbackSrc(
  publicId: string | undefined,
  alt: string,
  variant: 'hero' | 'section',
) {
  const palette = getStoryPalette(publicId);
  const width = variant === 'hero' ? 1600 : 1200;
  const height = variant === 'hero' ? 900 : 900;
  const title = escapeSvgText(alt || 'Based on Creativity');
  const label = escapeSvgText(
    variant === 'hero'
      ? 'Story artwork placeholder — replace with Cloudinary asset when ready'
      : 'Story illustration placeholder — replace with Cloudinary asset when ready',
  );
  const ornament = variant === 'hero' ? 'BOC STORY ART' : 'BOC STORY DETAIL';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette.from}" />
          <stop offset="100%" stop-color="${palette.to}" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.35" />
          <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" rx="36" />
      <rect x="32" y="32" width="${width - 64}" height="${height - 64}" rx="28" fill="none" stroke="rgba(255,255,255,0.18)" />
      <circle cx="${width / 2}" cy="${height * 0.34}" r="${variant === 'hero' ? 260 : 220}" fill="url(#glow)" />
      <path d="M ${width * 0.15} ${height * 0.72} C ${width * 0.35} ${height * 0.58}, ${width * 0.65} ${height * 0.86}, ${width * 0.85} ${height * 0.72}" fill="none" stroke="${palette.detail}" stroke-opacity="0.22" stroke-width="3" />
      <text x="50%" y="18%" text-anchor="middle" fill="${palette.accent}" font-family="'Space Mono', monospace" font-size="${variant === 'hero' ? 28 : 24}" letter-spacing="7">${ornament}</text>
      <text x="50%" y="52%" text-anchor="middle" fill="#ffffff" font-family="'Cormorant Garamond', serif" font-size="${variant === 'hero' ? 72 : 60}" font-style="italic">${title}</text>
      <text x="50%" y="62%" text-anchor="middle" fill="${palette.detail}" font-family="'Source Sans 3', sans-serif" font-size="${variant === 'hero' ? 26 : 24}">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

type StoryAssetProps = {
  publicId?: string;
  alt: string;
  className?: string;
  variant?: 'hero' | 'section';
  cloudinaryOptions?: React.ComponentProps<typeof CloudinaryImage>['cloudinaryOptions'];
};

// Broken asset IDs are checked at runtime; the component gracefully falls back via
// CloudinaryImage's own error handling when an asset fails to load.
export function StoryAsset({
  publicId,
  alt,
  className,
  variant = 'section',
  cloudinaryOptions,
}: StoryAssetProps) {
  const fallbackSrc = createStoryFallbackSrc(publicId, alt, variant);

  if (!publicId) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <CloudinaryImage
      publicId={publicId}
      alt={alt}
      fallbackSrc={fallbackSrc}
      cloudinaryOptions={cloudinaryOptions}
      className={className}
    />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function GrainOverlay() {
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
export function PageContent({ section }: { section: StorySection | null }) {
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
          <StoryAsset
            publicId={section.publicId}
            alt={section.caption || ''}
            variant="section"
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
export function BookPage({
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
