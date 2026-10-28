import bocLogo from '../assets/boc_logo.png';
import {
  resolveMediaAlt,
  resolveMediaUrl,
  type SanityPortfolioProject,
} from './sanityContent';

export type ProjectStatus = 'Completed' | 'In Development' | 'Concept';
export type ProjectClassification =
  | 'BOC-owned work'
  | 'BOC-owned concept'
  | 'Client project'
  | 'Unattributed work';

export interface PortfolioProject {
  id: string;
  aliases?: string[];
  index: string;
  title: string;
  client?: string;
  category: string;
  discipline: string;
  classification: ProjectClassification;
  status: ProjectStatus;
  year: string;
  summary: string;
  image?: string;
  imageAlt?: string;
  testimonial?: string;
  testimonialAuthor?: string;
}

/** Local examples retained when the published portfolio cannot be reached. */
export const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: 'boc-brand-identity',
    aliases: ['boc-brand-system-refresh'],
    index: '01',
    title: 'BOC Brand System Refresh',
    category: 'Branding',
    discipline: 'Identity Design · Typography · Visual System',
    classification: 'BOC-owned work',
    status: 'Completed',
    year: '2025',
    summary:
      'A premium identity refresh for Based on Creativity, combining editorial typography, motion-ready assets, and a refined visual system designed for digital-first storytelling.',
    image: bocLogo,
    imageAlt: 'Based on Creativity logo, part of its own visual identity',
  },
  {
    id: 'bochq-website',
    aliases: ['creativity-base-web-platform'],
    index: '02',
    title: 'Creativity Base Web Platform',
    category: 'Web Development',
    discipline: 'React · Tailwind CSS · Editorial UI',
    classification: 'BOC-owned work',
    status: 'Completed',
    year: '2025',
    summary:
      'A cinematic web experience for the Creativity Base ecosystem, built to showcase services, stories, and work through a polished editorial interface.',
  },
  {
    id: 'first-animated-series',
    index: '03',
    title: 'First Animated Series',
    category: 'Animation',
    discipline: 'Animation · Character Design · Narrative',
    classification: 'BOC-owned work',
    status: 'In Development',
    year: 'TBA',
    summary:
      'The debut animated series from Creativity Base Studios: an original world in development, with characters and a visual language being developed for the project.',
  },
  {
    id: 'first-publication',
    index: '04',
    title: 'First Publication',
    category: 'Publishing',
    discipline: 'Editorial · Publishing · Illustration',
    classification: 'BOC-owned work',
    status: 'In Development',
    year: 'TBA',
    summary:
      'The inaugural title from Creativity Base Press, an illustrated written work in development.',
  },
  {
    id: 'motion-merch-capsule',
    index: '05',
    title: 'Motion Merch Capsule',
    category: 'Merchandise',
    discipline: 'Campaign Design · Product Visuals · Animation',
    classification: 'BOC-owned concept',
    status: 'Concept',
    year: '2025',
    summary:
      'A concept capsule combining product visuals, animated launch teasers, and campaign-ready artwork for a limited BOC merchandise release.',
  },
  {
    id: 'modern-cosmos',
    index: '06',
    title: 'Modern Cosmos',
    client: 'Modern Cosmos',
    category: 'Web Development',
    discipline: 'Website Redesign · Responsive Design · Desktop & Mobile',
    classification: 'Client project',
    status: 'Completed',
    year: '2026',
    summary:
      'Website redesign and site updates for Modern Cosmos, with improvements across desktop and mobile views.',
    image:
      'https://cdn.sanity.io/images/wxky32kg/production/af8627bb68da6dc2a3089c09b9b7591ae50aabb4-2400x1810.png?w=1600&auto=format&q=80',
    imageAlt:
      'Modern Cosmos homepage before-and-after comparison showing desktop and mobile views.',
    testimonial:
      'My experience was of a genuinely creative process and deliberately imaginative website redesign. My virtual correspondence was intuitive and collaborative. I super recommend Based on Creativity to give your concept a marvellous form.',
    testimonialAuthor: 'Ryan D',
  },
];

const BOC_ENTITIES = new Set([
  'based on creativity',
  'boc studio',
  'creativity base',
  'creativity base press',
  'creativity base studios',
  'creativity base network',
  'self',
]);

function formatProjectYear(date?: string) {
  if (!date) return 'TBA';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? 'TBA' : String(parsed.getFullYear());
}

function getProjectStatus(project: SanityPortfolioProject): ProjectStatus {
  if (/\bconcept\b/i.test(`${project.title} ${project.description || ''}`)) {
    return 'Concept';
  }
  if (!project.date) return 'In Development';
  const parsed = new Date(project.date);
  if (Number.isNaN(parsed.getTime())) return 'In Development';
  return parsed <= new Date() ? 'Completed' : 'In Development';
}

export function mapSanityProject(
  project: SanityPortfolioProject,
  index: number,
): PortfolioProject {
  const status = getProjectStatus(project);
  const image = resolveMediaUrl(project.thumbnail, 1600) || undefined;
  const client = project.client?.trim().toLowerCase();
  const isBocOwned = Boolean(client && BOC_ENTITIES.has(client));
  const classification =
    status === 'Concept'
      ? isBocOwned
        ? 'BOC-owned concept'
        : project.client
          ? 'Client project'
          : 'Unattributed work'
      : isBocOwned
        ? 'BOC-owned work'
        : project.client
          ? 'Client project'
          : 'Unattributed work';

  return {
    id: project.slug || project._id,
    index: String(index + 1).padStart(2, '0'),
    title: project.title,
    client: project.client,
    category: project.category || 'Creative Work',
    discipline: project.tags?.length
      ? project.tags.join(' · ')
      : project.category || 'Creative Work',
    classification,
    status,
    year: formatProjectYear(project.date),
    summary: project.description?.trim() || 'Project details are being prepared.',
    image,
    imageAlt: image
      ? resolveMediaAlt(project.thumbnail, `${project.title} project artwork`)
      : undefined,
  };
}
