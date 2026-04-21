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
}

export interface SanityVaultItem {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  image?: SanityImageField;
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
  order
}`;

const vaultQuery = `*[_type == "vaultItem"] | order(featured desc, date desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  image,
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
  if (media.cloudinaryUrl) return media.cloudinaryUrl;
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
