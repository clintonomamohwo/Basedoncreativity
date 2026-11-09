import type { IncomingMessage, ServerResponse } from 'node:http';

const SITE_URL = 'https://www.bochq.com';
const DEFAULT_PROJECT_ID = 'wxky32kg';
const DEFAULT_DATASET = 'production';
const IMAGE_HOSTS = new Set(['res.cloudinary.com', 'cdn.sanity.io']);
const CLOUDINARY_TRANSFORM_KEYS = new Set([
  'a', 'b', 'c', 'dpr', 'e', 'f', 'fl', 'g', 'h', 'l', 'o', 'q', 'r', 't', 'u', 'w', 'x', 'y', 'z',
]);

type SanityMedia = {
  cloudinaryUrl?: string;
  image?: {
    asset?: { url?: string | null } | null;
  } | null;
};

type VaultItem = {
  category?: string;
  image?: SanityMedia | null;
  thumbnail?: SanityMedia | null;
};

const vaultQuery = `*[_type == "vaultItem"] | order(featured desc, date desc)[0...1000] {
  category,
  image { cloudinaryUrl, image { asset->{url} } },
  thumbnail { cloudinaryUrl, image { asset->{url} } }
}`;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function safePathSegments(segments: string[]) {
  return segments.length > 0 && segments.every((segment) =>
    segment !== '.' && segment !== '..' && /^[a-zA-Z0-9._-]+$/.test(segment),
  );
}

function isCloudinaryTransformation(segment: string) {
  return segment.split(',').some((part) => {
    const match = part.match(/^([a-z]{1,3})_/);
    return Boolean(match && CLOUDINARY_TRANSFORM_KEYS.has(match[1]));
  });
}

function sameSiteImageUrl(value?: string | null) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !IMAGE_HOSTS.has(url.hostname)) return undefined;

    if (url.hostname === 'res.cloudinary.com') {
      const uploadMarker = '/image/upload/';
      const uploadIndex = url.pathname.indexOf(uploadMarker);
      if (uploadIndex < 0 || !url.pathname.startsWith('/basecreator/')) return undefined;

      const segments = url.pathname.slice(uploadIndex + uploadMarker.length).split('/').filter(Boolean);
      const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
      let assetSegments = versionIndex >= 0
        ? segments.slice(versionIndex)
        : (segments.length > 1 && isCloudinaryTransformation(segments[0]) ? segments.slice(1) : segments);

      if (assetSegments.length) {
        assetSegments = [...assetSegments];
        assetSegments[assetSegments.length - 1] = assetSegments.at(-1)!.replace(/\.(?:jpe?g|png|webp|avif|gif)$/i, '');
      }
      if (!safePathSegments(assetSegments)) return undefined;

      const assetPath = assetSegments.map(encodeURIComponent).join('/');
      return `${SITE_URL}/vault-images/cloudinary/${assetPath}`;
    }

    const sanityPrefix = '/images/wxky32kg/production/';
    if (!url.pathname.startsWith(sanityPrefix)) return undefined;
    const assetSegments = url.pathname.slice(sanityPrefix.length).split('/').filter(Boolean);
    if (!safePathSegments(assetSegments)) return undefined;

    const assetPath = assetSegments.map(encodeURIComponent).join('/');
    return `${SITE_URL}/vault-images/sanity/${assetPath}`;
  } catch {
    return undefined;
  }
}

function mediaImageUrl(media?: SanityMedia | null) {
  return sameSiteImageUrl(media?.cloudinaryUrl) || sameSiteImageUrl(media?.image?.asset?.url);
}

function cloudinaryVideoPoster(media?: SanityMedia | null) {
  if (!media?.cloudinaryUrl) return undefined;

  try {
    const embedUrl = new URL(media.cloudinaryUrl);
    if (embedUrl.protocol !== 'https:' || embedUrl.hostname !== 'player.cloudinary.com') {
      return undefined;
    }

    const cloudName = embedUrl.searchParams.get('cloud_name');
    const publicId = embedUrl.searchParams.get('public_id');
    const publicIdSegments = publicId?.split('/') || [];
    if (
      cloudName !== 'basecreator' ||
      !publicId ||
      !safePathSegments(publicIdSegments)
    ) {
      return undefined;
    }

    const safePublicId = publicIdSegments.map(encodeURIComponent).join('/');
    return `${SITE_URL}/vault-images/poster/${safePublicId}`;
  } catch {
    return undefined;
  }
}

function getItemImageUrls(item: VaultItem) {
  const directImage = mediaImageUrl(item.image) || mediaImageUrl(item.thumbnail);
  if (directImage) return [directImage];

  if (item.category?.toLowerCase() === 'video') {
    const poster = cloudinaryVideoPoster(item.image);
    if (poster) return [poster];
  }

  return [];
}

function makeImageSitemap(imageUrls: string[]) {
  const imageEntries = imageUrls
    .map((imageUrl) => `      <image:image><image:loc>${escapeXml(imageUrl)}</image:loc></image:image>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/vault</loc>
${imageEntries}
  </url>
</urlset>`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.end('Method Not Allowed');
    return;
  }

  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || DEFAULT_DATASET;
  const apiUrl = new URL(
    `https://${encodeURIComponent(projectId)}.api.sanity.io/v2024-01-01/data/query/${encodeURIComponent(dataset)}`,
  );
  apiUrl.searchParams.set('query', vaultQuery);
  apiUrl.searchParams.set('perspective', 'published');

  try {
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Sanity query failed');

    const data = await response.json() as { result?: VaultItem[] };
    const imageUrls = [...new Set((data.result || []).flatMap(getItemImageUrls))];
    const xml = makeImageSitemap(imageUrls);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(req.method === 'HEAD' ? undefined : xml);
  } catch {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(req.method === 'HEAD' ? undefined : 'Image sitemap is temporarily unavailable.');
  }
}
