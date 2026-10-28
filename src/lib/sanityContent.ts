import { sanityClient, urlFor } from './sanity';

type SanityImageField = {
  image?: {
    alt?: string;
    asset?: unknown;
  };
  cloudinaryUrl?: string;
  alt?: string;
};

export interface SanityPortfolioProject {
  _id: string;
  title: string;
  slug?: string;
  client?: string;
  category?: string;
  description?: string;
  thumbnail?: SanityImageField;
  images?: SanityImageField[];
  tags?: string[];
  date?: string;
  featured?: boolean;
  order?: number;
  testimonial?: string;
  testimonialAuthor?: string;
}

export interface SanityVaultItem {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  image?: SanityImageField;
  thumbnail?: SanityImageField;
  description?: string;
  tags?: string[];
  date?: string;
  featured?: boolean;
}

export interface PortableTextSpan {
  _type: 'span';
  text?: string;
}

export interface PortableTextBlock {
  _type: 'block';
  children?: PortableTextSpan[];
}

export interface SanityStory {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  coverImage?: SanityImageField;
  author?: string;
  category?: string;
  publishedAt?: string;
  featured?: boolean;
}

const portfolioQuery = `*[_type == "portfolioProject"] | order(order asc, featured desc, date desc) {
  _id,
  title,
  "slug": slug.current,
  client,
  category,
  description,
  thumbnail,
  images,
  tags,
  date,
  featured,
  order,
  testimonial,
  testimonialAuthor
}`;

const portfolioCardQuery = `*[_type == "portfolioProject"] | order(order asc, featured desc, date desc) {
  _id,
  title,
  "slug": slug.current,
  client,
  category,
  description,
  thumbnail,
  tags,
  date
}`;

const vaultQuery = `*[_type == "vaultItem"] | order(featured desc, date desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  image,
  thumbnail,
  description,
  tags,
  date,
  featured
}`;

const storiesQuery = `*[_type == "story"] | order(featured desc, publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  coverImage,
  author,
  category,
  publishedAt,
  featured
}`;

const storyBySlugQuery = `*[_type == "story" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  coverImage,
  author,
  category,
  publishedAt,
  featured
}`;

export async function fetchPortfolioProjects() {
  return sanityClient.fetch<SanityPortfolioProject[]>(portfolioQuery);
}

export async function fetchPortfolioCardProjects() {
  return sanityClient.fetch<SanityPortfolioProject[]>(portfolioCardQuery);
}

export async function fetchVaultItems() {
  return sanityClient.fetch<SanityVaultItem[]>(vaultQuery);
}

export async function fetchStories() {
  return sanityClient.fetch<SanityStory[]>(storiesQuery);
}

export async function fetchStoryBySlug(slug: string) {
  return sanityClient.fetch<SanityStory | null>(storyBySlugQuery, { slug });
}

export function resolveMediaUrl(media?: SanityImageField, width = 1600) {
  if (!media) return '';

  // Handle Cloudinary URLs - extract public_id from embed URLs if needed
  if (media.cloudinaryUrl) {
    const url = media.cloudinaryUrl;

    // Check if it's a Cloudinary embed player URL
    if (url.includes('player.cloudinary.com/embed')) {
      // Extract public_id from embed URL
      const publicIdMatch = url.match(/[?&]public_id=([^&]+)/);
      if (publicIdMatch) {
        const publicId = decodeURIComponent(publicIdMatch[1]);
        // Return direct video URL instead of embed
        return `https://res.cloudinary.com/basecreator/video/upload/${publicId}.mp4`;
      }
    }

    // Check if it's just a public_id (no http/https)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Assume it's a public_id, build video URL
      return `https://res.cloudinary.com/basecreator/video/upload/${url}.mp4`;
    }

    // Resize direct Cloudinary images and let Cloudinary choose an efficient format.
    const imageUploadPath = '/image/upload/';
    const uploadPathIndex = url.indexOf(imageUploadPath);
    if (uploadPathIndex !== -1) {
      const imagePathStart = uploadPathIndex + imageUploadPath.length;
      const firstSegment = url.slice(imagePathStart).split('/')[0];
      const alreadyTransformed = /(?:^|,)(?:a|b|c|d|dpr|e|f|fl|g|h|l|o|q|r|t|u|w|x|y|z)_[^,]+/.test(firstSegment);

      if (!alreadyTransformed) {
        const requestedWidth = Math.max(1, Math.round(width));
        const transformations = `f_auto,q_auto:good,c_limit,w_${requestedWidth}`;
        return `${url.slice(0, imagePathStart)}${transformations}/${url.slice(imagePathStart)}`;
      }
    }

    // Keep non-image Cloudinary URLs (including direct videos) unchanged.
    return url;
  }

  if (media.image) {
    return urlFor(media.image).width(width).auto('format').quality(80).url();
  }

  return '';
}

export function resolveMediaAlt(media?: SanityImageField, fallback = '') {
  return media?.image?.alt || media?.alt || fallback;
}

export function portableTextToPlainText(blocks: PortableTextBlock[] = []) {
  return blocks
    .filter((block) => block?._type === 'block')
    .map((block) =>
      (block.children || [])
        .filter((child) => child?._type === 'span')
        .map((child) => child.text || '')
        .join('')
        .trim(),
    )
    .filter(Boolean)
    .join('\n\n');
}

export function portableTextToParagraphs(blocks: PortableTextBlock[] = []) {
  return portableTextToPlainText(blocks)
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
