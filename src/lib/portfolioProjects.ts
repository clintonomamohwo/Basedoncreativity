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
      'BOC’s brand refresh brings its logo variations, colour palette, typography and digital-card styles into a more cohesive visual system. Selected public-safe excerpts from the brand guidelines show how these elements work together to create a recognisable, consistent expression of the studio. If your own identity feels scattered across touchpoints, let’s talk about bringing it together.',
    image:
      'https://cdn.sanity.io/images/wxky32kg/production/a43b0a902b2aff19de75037d5a2346362bb38a7b-3228x1748.jpg?w=1600&auto=format&q=80',
    imageAlt:
      'Collage of selected BOC logo, palette, typography, and card-style guideline excerpts.',
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
      'The Creativity Base ecosystem spans services, stories and creative work; this completed platform gives them a shared digital home. A cinematic, editorial interface brings the different parts together while giving each room to be discovered. If you’re bringing several ideas or offerings under one roof, let’s explore a digital experience that connects them.',
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
      'Creativity Base Studios’ debut animated series is taking shape around an original world, with characters and a visual language in development. It’s a studio-owned project still being built, not a finished or released series.',
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
      'Creativity Base Press is developing an illustrated written work, bringing editorial, publishing and illustration together in its first title. The project remains in development and has not yet been released.',
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
      'This BOC-owned concept imagines a limited merchandise release as a connected campaign: product visuals, animated launch teasers and artwork designed to work together. It explores how motion could give a future capsule a memorable launch identity; the collection is a concept, not a released product line. Planning a launch of your own? Let’s talk about building the visual world around it.',
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
      'For Modern Cosmos, BOC completed a website redesign and site updates across desktop and mobile. The work pairs responsive design with a more considered visual presentation, giving the client’s concept a thoughtful online form. If your site is ready for a similarly imaginative refresh, we’d love to hear what you’re building.',
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
