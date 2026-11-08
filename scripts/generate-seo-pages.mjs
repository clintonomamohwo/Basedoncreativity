import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(projectRoot, 'dist');
const siteUrl = 'https://www.bochq.com';
const siteName = 'Based on Creativity';
const defaultImage =
  'https://cdn.sanity.io/images/wxky32kg/production/a43b0a902b2aff19de75037d5a2346362bb38a7b-3228x1748.jpg?w=1200&h=630&fit=crop&auto=format&q=85';
const keywords =
  'Toronto creative studio, brand identity, web development, animation, visual storytelling, editorial design';

const portfolioProjects = [
  {
    path: 'boc-brand-identity',
    title: 'BOC Brand System Refresh',
    client: 'Based on Creativity',
    category: 'Branding',
    classification: 'BOC-owned work',
    status: 'Completed',
    year: '2025',
    description:
      'BOC’s brand refresh brings its logo variations, colour palette, typography and digital-card styles into a more cohesive visual system. Selected public-safe excerpts from the brand guidelines show how these elements work together to create a recognisable, consistent expression of the studio. If your own identity feels scattered across touchpoints, let’s talk about bringing it together.',
  },
  {
    path: 'bochq-website',
    title: 'Creativity Base Web Platform',
    client: 'Creativity Base',
    category: 'Web Development',
    classification: 'BOC-owned work',
    status: 'Completed',
    year: '2025',
    description:
      'The Creativity Base ecosystem spans services, stories and creative work; this completed platform gives them a shared digital home. A cinematic, editorial interface brings the different parts together while giving each room to be discovered. If you’re bringing several ideas or offerings under one roof, let’s explore a digital experience that connects them.',
  },
  {
    path: 'first-animated-series',
    title: 'First Animated Series',
    client: 'Creativity Base Studios',
    category: 'Animation',
    classification: 'BOC-owned work',
    status: 'In Development',
    year: 'TBA',
    description:
      'Creativity Base Studios’ debut animated series is taking shape around an original world, with characters and a visual language in development. It’s a studio-owned project still being built, not a finished or released series.',
  },
  {
    path: 'first-publication',
    title: 'First Publication',
    client: 'Creativity Base Press',
    category: 'Publishing',
    classification: 'BOC-owned work',
    status: 'In Development',
    year: 'TBA',
    description:
      'Creativity Base Press is developing an illustrated written work, bringing editorial, publishing and illustration together in its first title. The project remains in development and has not yet been released.',
  },
  {
    path: 'motion-merch-capsule',
    title: 'Motion Merch Capsule',
    client: 'BOC Studio',
    category: 'Merchandise',
    classification: 'BOC-owned concept',
    status: 'Concept',
    year: '2025',
    description:
      'This BOC-owned concept imagines a limited merchandise release as a connected campaign: product visuals, animated launch teasers and artwork designed to work together. It explores how motion could give a future capsule a memorable launch identity; the collection is a concept, not a released product line. Planning a launch of your own? Let’s talk about building the visual world around it.',
  },
  {
    path: 'modern-cosmos',
    title: 'Modern Cosmos',
    client: 'Modern Cosmos',
    category: 'Web Development',
    classification: 'Client project',
    status: 'Completed',
    year: '2026',
    description:
      'For Modern Cosmos, BOC completed a website redesign and site updates across desktop and mobile. The work pairs responsive design with a more considered visual presentation, giving the client’s concept a thoughtful online form. If your site is ready for a similarly imaginative refresh, we’d love to hear what you’re building.',
  },
  {
    path: 'portfolio-creation',
    title: 'Portfolio Creation',
    client: 'Self',
    category: 'Web Development',
    classification: 'BOC-owned work',
    status: 'Completed',
    year: '2025',
    description:
      'A self-directed portfolio project shaped to bring selected creative work into one clear, considered digital showcase. Thoughtful curation and presentation give each piece room to stand out while helping visitors explore the broader body of work. Building a portfolio of your own? Let’s create a digital home that feels true to the work behind it.',
  },
];

const storyRecords = [
  {
    path: 'creative-discipline-after-dark',
    title: 'Creative Discipline After Dark',
    author: 'Based on Creativity',
    excerpt:
      'A reflective note on what it means to keep creating when the applause is absent and only the work remains.',
    body: [
      'Most creative practice is not glamorous. It is built in quiet rooms, with unfinished drafts, uncertain instincts, and a standard that has to come from somewhere deeper than attention.',
      'For Based on Creativity, discipline is not the opposite of imagination. It is the structure that protects imagination from dissolving into intention without execution.',
      'The late hours matter because they reveal what remains when there is no audience. That is where voice sharpens, taste matures, and the work begins to tell the truth.',
    ],
  },
  {
    path: 'building-worlds-with-intent',
    title: 'Building Worlds With Intent',
    author: 'Based on Creativity',
    excerpt:
      'Why visual storytelling becomes more powerful when every image, phrase, and transition belongs to the same emotional universe.',
    body: [
      'A strong creative world is not a pile of references. It is a system of choices that keeps returning to the same emotional center.',
      'When story, image, sound, and interface share intention, the audience does not just consume the work. They enter it, remember it, and attach meaning to it.',
      'That is the ambition behind BOC projects: not content for the moment, but worlds that feel coherent enough to outlive their launch.',
    ],
  },
];

const services = [
  {
    eyebrow: 'Animation & Storytelling',
    name: 'Bringing Worlds to Life',
    description:
      'Where narrative meets craft. Our animation studio develops characters, worlds, and stories through 2D and digital animation, motion design, and cinematic production. Every frame is intentional. Every story is deeply considered before production begins.',
    deliverables: ['2D Character Animation & Scene Production', 'Short Film & Original Series Development', 'Motion Graphics & Visual Effects', 'Storyboarding & Concept Art', 'Brand Animation & Animated Logos', 'Animatics & Pre-Production Packages'],
    outcome:
      'An animated work or production-ready development package with story, character, and visual direction clearly defined.',
    relatedWork: 'First Animated Series · In development',
    relatedPath: '/work/first-animated-series',
  },
  {
    eyebrow: 'Publishing & Editorial',
    name: 'Stories in Print & Digital',
    description:
      'A publishing house rooted in voices that deserve to be heard. From illustrated novellas to editorial magazines, we design and produce print and digital publications built to command attention on any shelf - or any screen.',
    deliverables: ['Book & Novella Publishing', 'Editorial Magazine Design & Production', "Illustrated Children's Books", 'Zine & Independent Press Runs', 'Copywriting & Editorial Direction', 'Print-Ready & Digital-First Formats'],
    outcome:
      'A designed, edited, print-ready or digital-first publication, with its text and visual system prepared for release.',
    relatedWork: 'First Publication · In development',
    relatedPath: '/work/first-publication',
  },
  {
    eyebrow: 'Digital Platform & Community',
    name: 'Spaces for Creative Minds',
    description:
      'We build and operate digital ecosystems where creative audiences gather, grow, and collaborate. Platforms, newsletters, and community spaces designed with the same editorial care as everything else BOC produces.',
    deliverables: ['Creative Community Platform Development', 'Newsletter Strategy & Production', 'Content Programming & Curation', 'Digital Events & Live Programming', 'Creator Ecosystem Architecture', 'Audience Growth & Retention Strategy'],
    outcome:
      'A digital platform or community program with defined structure, editorial voice, content programming, and a clear operating model.',
    relatedWork: 'Creativity Base Web Platform · BOC-owned',
    relatedPath: '/work/bochq-website',
  },
  {
    eyebrow: 'Visual Identity & Design',
    name: 'Identity as Declaration',
    description:
      'Identity is not decoration - it is declaration. Our graphic design practice crafts brand systems and visual identities that speak before a single word is read. Precise, purposeful, and unmistakable.',
    deliverables: ['Brand Identity & Logo Systems', 'Typography & Colour Architecture', 'Print & Packaging Design', 'Art Direction & Creative Strategy', 'Illustration & Icon Systems', 'Brand Guidelines & Usage Standards'],
    outcome:
      'A flexible identity system with logo, typography, colour, art direction, and usage guidance for the brand’s key touchpoints.',
    relatedWork: 'BOC Brand System Refresh · BOC-owned',
    relatedPath: '/work/boc-brand-identity',
  },
  {
    eyebrow: 'Websites & Digital Experiences',
    name: 'Presence Built to Last',
    description:
      'Digital presence designed and engineered with the same care as the brands it represents. Bespoke websites and interactive experiences that are fast, accessible, and beautiful - built for the long term.',
    deliverables: ['Bespoke Website Design & Development', 'Interactive & Immersive Web Experiences', 'E-Commerce & Digital Storefronts', 'UX Research & Interface Design', 'Performance Optimisation & Accessibility', 'CMS Integration & Ongoing Support'],
    outcome:
      'A designed and developed website with responsive interfaces, CMS integration, and accessibility and performance checks appropriate to the project.',
    relatedWork: 'Modern Cosmos · Client project',
    relatedPath: '/work/modern-cosmos',
  },
  {
    eyebrow: 'Products & Apparel',
    name: 'Creativity You Can Hold',
    description:
      'When creativity becomes something tangible. We conceive, design, and produce limited-run merchandise and apparel collections that carry the full weight of the brand they represent - objects worth owning and worth giving.',
    deliverables: ['Apparel Design & Limited-Run Production', 'Art Prints & Collectible Objects', 'Branded Merchandise Strategy', 'Packaging Design & Unboxing Experience', 'Artist & Brand Collaborations', 'Product Photography Direction'],
    outcome:
      'A cohesive product concept and rollout package covering design, packaging direction, and campaign assets ready for production planning.',
    relatedWork: 'Motion Merch Capsule · Concept',
    relatedPath: '/work/motion-merch-capsule',
  },
  {
    eyebrow: 'Documentation & Enablement',
    name: 'Technical Writing',
    description:
      'We turn complex products, processes, and ideas into clear documentation people can use. Work can include user guides, standard operating procedures, knowledge-base content, and technical explainers.',
    deliverables: ['User & Product Documentation', 'Standard Operating Procedures', 'Knowledge-Base & Help-Centre Content', 'Technical Explainers & Reference Guides', 'Documentation Review & Restructuring', 'Style, Terminology & Editorial Consistency'],
    outcome:
      'A clear, structured set of technical documents tailored to the readers, tools, and workflow they support.',
    relatedWork: 'Discuss this service',
    relatedPath: '/contact',
  },
  {
    eyebrow: 'AI-Enabled Operations',
    name: 'AI Automation Services',
    description:
      'We help teams identify repetitive tasks where AI can assist, then scope and build fit-for-purpose automations around existing tools. Workflows include clear human review and handoffs where appropriate.',
    deliverables: ['AI Opportunity & Workflow Mapping', 'AI-Assisted Task Automation', 'Tool Integration & Process Design', 'Human Review & Escalation Steps', 'Testing & Quality Checks', 'Handoff & Usage Documentation'],
    outcome:
      'A scoped AI-assisted workflow with defined inputs, review points, and handoffs, documented for the team that will use it.',
    relatedWork: 'Discuss this service',
    relatedPath: '/contact',
  },
  {
    eyebrow: 'Connected Workflows',
    name: 'Workflow Automation',
    description:
      'We map repeatable business processes and connect steps across the tools a team already uses. Automations are scoped around clear triggers, handoffs, exception handling, and maintainable documentation.',
    deliverables: ['Process Mapping & Automation Scoping', 'Cross-Tool Workflow Connections', 'Notifications, Routing & Approvals', 'Exception Handling & Escalation Paths', 'Testing & Reliability Checks', 'Handoff & Maintenance Documentation'],
    outcome:
      'A documented automated process with defined triggers, system handoffs, and a clear path for exceptions.',
    relatedWork: 'Discuss this service',
    relatedPath: '/contact',
  },
];

const mainRoutes = [
  {
    path: '/',
    title: 'Based on Creativity (BOC) | Creative Studio',
    description:
      'Based on Creativity is a creative studio bringing brands and stories to life through graphic design, web development, animation, and publishing.',
    heading: 'Based on Creativity',
    body: [
      'Based on Creativity is a creative studio bringing brands and stories to life through graphic design, web development, animation, and publishing.',
    ],
    sections: [{ heading: 'Selected work', items: portfolioProjects }],
    type: 'website',
  },
  {
    path: '/work',
    title: 'Work | Based on Creativity',
    description:
      'Explore selected work from Based on Creativity, including brand identity systems, digital experiences, editorial design, and visual storytelling.',
    heading: 'Selected Work',
    body: [
      'BOC develops brand worlds, digital experiences, animation, and publishing projects. Each one built from a single standard: that the work should outlast the moment it was made for.',
    ],
    sections: [{ heading: 'Selected projects', items: portfolioProjects }],
  },
  {
    path: '/services',
    title: 'Services | Based on Creativity',
    description:
      'Explore BOC services including brand identity, digital experiences, technical writing, AI automation services, and workflow automation.',
    heading: 'What We Create',
    body: [
      'BOC brings creative craft and practical expertise together - from animation, publishing, web, design, and merchandise to technical writing and automation. Every service is shaped around the work it needs to do.',
      'The examples linked below include BOC-owned work and client work. Service descriptions are typical deliverables, not claims of measured client results.',
      'Imagination and intention, all under one roof.',
    ],
    sections: services.map((service) => ({
      heading: service.name,
      eyebrow: service.eyebrow,
      body: [service.description, `Typical deliverable: ${service.outcome}`],
      items: service.deliverables.map((title) => ({ title })),
      link: { title: service.relatedWork, href: service.relatedPath },
    })),
  },
  {
    path: '/studio',
    title: 'Studio | Based on Creativity',
    description:
      'Step inside the Based on Creativity studio to see how narrative, design craft, motion, and world-building shape every creative collaboration.',
    heading: 'Inside the Based on Creativity studio',
    body: [
      'Step inside the Based on Creativity studio to see how narrative, design craft, motion, and world-building shape every creative collaboration.',
    ],
  },
  {
    path: '/vault',
    title: 'The Vault | Based on Creativity',
    description:
      'Enter The Vault to explore an experimental gallery of moving images, visual studies, and creative artifacts from Based on Creativity.',
    heading: 'The Vault',
    body: [
      'Enter The Vault to explore an experimental gallery of moving images, visual studies, and creative artifacts from Based on Creativity.',
    ],
  },
  {
    path: '/about',
    title: 'About | Based on Creativity',
    description:
      'Learn about Based on Creativity, the studio philosophy, creative practice, and the perspective behind its design-led storytelling.',
    heading: 'About Based on Creativity',
    body: [
      'Learn about Based on Creativity, the studio philosophy, creative practice, and the perspective behind its design-led storytelling.',
    ],
  },
  {
    path: '/contact',
    title: 'Contact | Based on Creativity',
    description:
      'Start a conversation with Based on Creativity about brand identity, digital design, creative direction, and collaborative storytelling projects.',
    heading: 'Start a conversation',
    body: [
      'Start a conversation with Based on Creativity about brand identity, digital design, creative direction, and collaborative storytelling projects.',
    ],
  },
  {
    path: '/stories',
    title: 'Stories | Based on Creativity',
    description:
      'Browse the Based on Creativity stories collection, featuring original short fiction, poetic narratives, and immersive visual storytelling.',
    heading: 'Stories from Based on Creativity',
    body: [
      'Browse the Based on Creativity stories collection, featuring original short fiction, poetic narratives, and immersive visual storytelling.',
    ],
    sections: [{ heading: 'Stories', items: storyRecords.map((story) => ({
      title: story.title,
      href: `/stories/${story.path}`,
      description: story.excerpt,
    })) }],
  },
  {
    path: '/insights',
    title: 'Insights | Based on Creativity',
    description:
      'Practical articles from Based on Creativity on brand identity, small-business websites, and thoughtful workflow automation.',
    heading: 'Insights for thoughtful businesses',
    body: [
      'Explore practical articles from Based on Creativity on design, digital experiences, and workflows that help a business communicate clearly.',
    ],
    sections: [],
  },
  {
    path: '/library',
    title: 'Library | Based on Creativity',
    description:
      'Explore the Based on Creativity library of reflections, expressions, and curated creative work across mediums and themes.',
    heading: 'The Based on Creativity library',
    body: [
      'Explore the Based on Creativity library of reflections, expressions, and curated creative work across mediums and themes.',
    ],
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Based on Creativity',
    description:
      'Read the Based on Creativity privacy policy to understand how personal information is collected, used, stored, and protected.',
    heading: 'Privacy policy',
    body: [
      'Read the Based on Creativity privacy policy to understand how personal information is collected, used, stored, and protected.',
    ],
  },
  {
    path: '/terms',
    title: 'Terms of Service | Based on Creativity',
    description:
      'Review the Based on Creativity terms of service covering website use, intellectual property, and service expectations.',
    heading: 'Terms of service',
    body: [
      'Review the Based on Creativity terms of service covering website use, intellectual property, and service expectations.',
    ],
  },
  {
    path: '/faq',
    title: 'FAQ | Based on Creativity',
    description:
      'The Based on Creativity FAQ page is currently in development and will soon share answers about the studio process and approach.',
    heading: 'Frequently asked questions',
    body: ['This page is in development. Explore the studio, work, services, or contact page for current information.'],
    robots: 'noindex, follow',
  },
  {
    path: '/community',
    title: 'Community | Based on Creativity',
    description:
      'The Based on Creativity community page is in development and will introduce future opportunities to connect, collaborate, and learn together.',
    heading: 'Community',
    body: ['This page is in development. Explore the studio, work, services, or contact page for current information.'],
    robots: 'noindex, follow',
  },
  {
    path: '/partners',
    title: 'Partners | Based on Creativity',
    description:
      'The Based on Creativity partners page is in development and will soon highlight creative collaborations and strategic partnerships.',
    heading: 'Partners',
    body: ['This page is in development. Explore the studio, work, services, or contact page for current information.'],
    robots: 'noindex, follow',
  },
];

function toMetaDescription(value, maxLength = 160) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  const firstSentence = normalized.match(/^.*?[.!?](?=\s|$)/)?.[0];
  const candidate = firstSentence || normalized;
  if (candidate.length <= maxLength) return candidate;

  const shortened = candidate
    .slice(0, maxLength - 1)
    .replace(/\s+\S*$/, '')
    .trimEnd();
  return `${shortened}…`;
}

function storyMetaDescription(story) {
  const excerpt = story.excerpt.replace(/[.!?]+$/, '');
  return `${excerpt}. Read "${story.title}" by ${story.author} in the Based on Creativity stories collection.`;
}

function markdownToPlainBlocks(markdown) {
  return String(markdown || '')
    .split(/\n\s*\n+/)
    .map((block) => block
      .replace(/^\s{0,3}#{1,6}\s+/gm, '')
      .replace(/^\s*[-*+]\s+/gm, '• ')
      .replace(/^\s*\d+\.\s+/gm, '• ')
      .replace(/^\s*>\s?/gm, '')
      .replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim())
    .filter(Boolean);
}

async function fetchPublishedHoloArticles() {
  const projectId = process.env.SANITY_PROJECT_ID || 'wxky32kg';
  const dataset = process.env.SANITY_DATASET || 'production';
  const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01';
  const query = '*[_type == "holoSeoArticle" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) { "slug": slug.current, title, excerpt, contentMarkdown, metaTitle, metaDescription, featuredImage, publishedAt }';
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${encodeURIComponent(dataset)}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Sanity returned HTTP ${response.status}`);
    const result = await response.json();
    return Array.isArray(result.result) ? result.result : [];
  } catch {
    console.warn('Could not fetch Holo articles for static SEO output; the rest of the site will still build.');
    return [];
  }
}

const projectRoutes = portfolioProjects.map((project) => ({
  path: `/work/${project.path}`,
  title: `${project.title} | Work | ${siteName}`,
  description: toMetaDescription(project.description),
  heading: project.title,
  body: [project.description],
  details: [
    ['Classification', project.classification],
    ['Status', project.status],
    ['Category', project.category],
    ['Year', project.year],
  ],
  type: 'creativework',
}));

const storyRoutes = storyRecords.map((story) => ({
  path: `/stories/${story.path}`,
  title: `${story.title} | Stories | ${siteName}`,
  description: storyMetaDescription(story),
  heading: story.title,
  body: story.body,
  details: [['Author', story.author]],
  type: 'article',
}));

const publishedHoloArticles = await fetchPublishedHoloArticles();
const holoArticleRoutes = publishedHoloArticles
  .filter((article) =>
    typeof article?.slug === 'string' &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(article.slug) &&
    typeof article.title === 'string' &&
    typeof article.contentMarkdown === 'string')
  .map((article) => ({
    path: `/insights/${article.slug}`,
    title: article.metaTitle || `${article.title} | Insights | ${siteName}`,
    description: article.metaDescription || article.excerpt || toMetaDescription(markdownToPlainBlocks(article.contentMarkdown)[0] || article.title),
    heading: article.title,
    body: [],
    contentMarkdown: article.contentMarkdown,
    publishedAt: article.publishedAt,
    image: typeof article.featuredImage === 'string' && article.featuredImage.startsWith('https://')
      ? article.featuredImage
      : defaultImage,
    type: 'article',
  }));
const insightsRoute = mainRoutes.find((route) => route.path === '/insights');
const insightsHubRoute = {
  ...insightsRoute,
  sections: [{
    heading: 'Latest insights',
    items: holoArticleRoutes.map((article) => ({
      title: article.heading,
      href: article.path,
      description: article.description,
    })),
  }],
};
const routes = [
  ...mainRoutes.filter((route) => route.path !== '/insights'),
  insightsHubRoute,
  ...projectRoutes,
  ...storyRoutes,
  ...holoArticleRoutes,
];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
const escapeXml = escapeHtml;
const absoluteUrl = (path) => `${siteUrl}${path === '/' ? '/' : path}`;
const outputName = (path) => (path === '/' ? 'home' : path.slice(1).replaceAll('/', '--'));

function schemaFor(route) {
  const url = absoluteUrl(route.path);
  const pageType = route.type === 'article' ? 'Article' : route.type === 'creativework' ? 'CreativeWork' : 'WebPage';
  const page = {
    '@type': pageType,
    name: route.title,
    description: route.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: route.image || defaultImage,
  };
  if (route.type === 'article' && route.publishedAt) {
    page.datePublished = route.publishedAt;
  }

  if (route.path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
          logo: `${siteUrl}/boc-logo.png`,
          description: route.description,
          sameAs: [
            'https://instagram.com/basedoncreativity',
            'https://twitter.com/basedoncreativity',
            'https://www.linkedin.com/company/based-on-creativity/',
            'https://www.youtube.com/@basedoncreativity',
          ],
        },
        {
          '@type': 'WebSite',
          name: siteName,
          url: siteUrl,
          description: route.description,
        },
        page,
      ],
    };
  }

  return { '@context': 'https://schema.org', ...page };
}

function renderItem(item) {
  const title = escapeHtml(item.title);
  const href = item.href || (item.path ? `/work/${item.path}` : undefined);
  const titleMarkup = href
    ? `<a href="${escapeHtml(href)}">${title}</a>`
    : title;
  const description = item.description ? `<p>${escapeHtml(item.description)}</p>` : '';
  const metadata = [item.category, item.classification, item.status, item.year]
    .filter(Boolean)
    .join(' · ');
  const metadataMarkup = metadata ? `<p class="seo-meta">${escapeHtml(metadata)}</p>` : '';
  const nestedItems = item.items?.length
    ? `<ul>${item.items.map((child) => `<li>${escapeHtml(child.title)}</li>`).join('')}</ul>`
    : '';
  const linkMarkup = item.link
    ? `<p class="seo-related">Related: <a href="${escapeHtml(item.link.href)}">${escapeHtml(item.link.title)}</a></p>`
    : '';
  const bodyMarkup = item.body?.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n') || '';
  const deliverables = item.deliverables?.length
    ? `<h3>Typical deliverables</h3><ul>${item.deliverables.map((deliverable) => `<li>${escapeHtml(deliverable)}</li>`).join('')}</ul>`
    : '';

  return `<li><article><h3>${titleMarkup}</h3>${metadataMarkup}${description}${bodyMarkup}${deliverables}${nestedItems}${linkMarkup}</article></li>`;
}

function renderInlineMarkdown(value) {
  const source = String(value || '');
  const token = /(\[([^\]]+)\]\((https:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let output = '';
  let cursor = 0;
  for (const match of source.matchAll(token)) {
    const index = match.index ?? 0;
    output += escapeHtml(source.slice(cursor, index));
    if (match[2] && match[3]) {
      let href = '';
      try {
        const parsed = new URL(match[3]);
        if (parsed.protocol === 'https:') href = escapeHtml(parsed.toString());
      } catch {}
      output += href
        ? `<a href="${href}" rel="noopener noreferrer">${escapeHtml(match[2])}</a>`
        : escapeHtml(match[2]);
    } else if (match[4]) {
      output += `<strong>${escapeHtml(match[4])}</strong>`;
    } else if (match[5]) {
      output += `<em>${escapeHtml(match[5])}</em>`;
    } else if (match[6]) {
      output += `<code>${escapeHtml(match[6])}</code>`;
    }
    cursor = index + match[0].length;
  }
  output += escapeHtml(source.slice(cursor));
  return output;
}

function renderMarkdownHtml(markdown) {
  const output = [];
  const lines = String(markdown || '').split(/\r?\n/);
  let paragraph = [];
  let listType = '';
  let listItems = [];
  const flushParagraph = () => {
    if (paragraph.length) output.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length) output.push(`<${listType}>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</${listType}>`);
    listType = '';
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    const quote = trimmed.match(/^>\s?(.*)$/);
    if (!trimmed) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(6, heading[1].length + 1);
      output.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
    } else if (unordered || ordered) {
      flushParagraph();
      const nextType = unordered ? 'ul' : 'ol';
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push((unordered || ordered)[1]);
    } else if (quote) {
      flushParagraph();
      flushList();
      output.push(`<blockquote><p>${renderInlineMarkdown(quote[1])}</p></blockquote>`);
    } else {
      flushList();
      paragraph.push(trimmed);
    }
  }
  flushParagraph();
  flushList();
  return output.join('\n');
}

function fallbackMarkup(route) {
  const paragraphs = (Array.isArray(route.body) ? route.body : [route.body])
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('\n');
  const details = route.details?.length
    ? `<dl class="seo-details">${route.details.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`
    : '';
  const markdown = route.contentMarkdown ? renderMarkdownHtml(route.contentMarkdown) : '';
  const sections = route.sections?.length
    ? route.sections.map((section) => {
        const sectionBody = section.body?.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n') || '';
        const items = section.items?.length
          ? `<ul class="seo-items">${section.items.map(renderItem).join('\n')}</ul>`
          : '';
        const relatedLink = section.link
          ? `<p class="seo-related">Related: <a href="${escapeHtml(section.link.href)}">${escapeHtml(section.link.title)}</a></p>`
          : '';
        return `<section><p class="seo-kicker">${escapeHtml(section.eyebrow || '')}</p><h2>${escapeHtml(section.heading)}</h2>${sectionBody}${items}${relatedLink}</section>`;
      }).join('\n')
    : '';

  return `
    <main class="seo-fallback" id="main-content">
      <p class="seo-kicker">Based on Creativity</p>
      <h1>${escapeHtml(route.heading)}</h1>
      ${details}
      ${markdown}
      ${paragraphs}
      ${sections}
      <nav aria-label="Explore Based on Creativity">
        <a href="/work">Work</a>
        <a href="/services">Services</a>
        <a href="/studio">Studio</a>
        <a href="/stories">Stories</a>
        <a href="/insights">Insights</a>
        <a href="/contact">Contact</a>
      </nav>
    </main>`;
}

function buildDocument(shell, route) {
  const url = absoluteUrl(route.path);
  const robots = route.robots ?? 'index, follow';
  const documentTitle = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const image = escapeHtml(route.image || defaultImage);
  const jsonLd = JSON.stringify(schemaFor(route)).replace(/</g, '\\u003c');
  const assetLinks = [...shell.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => !/rel=["']canonical["']/i.test(tag))
    .join('\n      ');
  const assetScripts = [...shell.matchAll(/<script\b[^>]*\bsrc=[^>]*><\/script>/gi)]
    .map((match) => match[0])
    .join('\n      ');
  const head = `<head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="${description}" />
      <meta name="keywords" content="${escapeHtml(keywords)}" />
      <meta name="robots" content="${robots}" />
      <title>${documentTitle}</title>
      <link rel="canonical" href="${url}" />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:type" content="${route.type === 'article' ? 'article' : 'website'}" />
      <meta property="og:site_name" content="${siteName}" />
      <meta property="og:title" content="${documentTitle}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${documentTitle}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}" />
      <script type="application/ld+json">${jsonLd}</script>
      <style>.seo-fallback{max-width:72rem;margin:0 auto;padding:7rem 1.5rem;font-family:system-ui,sans-serif;color:#111;background:#fff}.seo-fallback .seo-kicker{font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.seo-fallback h1{max-width:18ch;font-size:clamp(2.25rem,6vw,4.8rem);line-height:1.04}.seo-fallback h2{margin-top:2.5rem;font-size:1.8rem}.seo-fallback h3{font-size:1.2rem}.seo-fallback p,.seo-fallback li{max-width:48rem;font-size:1.05rem;line-height:1.6}.seo-fallback .seo-meta,.seo-fallback dt{font-size:.85rem;color:#555}.seo-fallback .seo-details{display:flex;flex-wrap:wrap;gap:1rem 2rem}.seo-fallback .seo-details div{min-width:8rem}.seo-fallback dd{margin:0;font-weight:700}.seo-fallback ul{padding-left:1.25rem}.seo-fallback .seo-items>li{margin:1rem 0}.seo-fallback nav{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem}.seo-fallback a{color:#1A1F4B;font-weight:700}</style>
      ${assetLinks}
      ${assetScripts}
    </head>`;

  return shell
    .replace(/<head>[\s\S]*?<\/head>/i, head)
    .replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${fallbackMarkup(route)}</div>`);
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

if (!existsSync(join(distRoot, 'index.html'))) {
  throw new Error('Expected Vite output at dist/index.html before generating SEO pages.');
}

const shell = readFileSync(join(distRoot, 'index.html'), 'utf8');
for (const route of routes) {
  const document = buildDocument(shell, route);
  const output = route.path === '/' ? join(distRoot, 'index.html') : join(distRoot, 'seo', `${outputName(route.path)}.html`);
  write(output, document);
}

const indexableRoutes = routes.filter((route) => !route.robots?.includes('noindex'));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexableRoutes
  .map((route) => `  <url><loc>${escapeXml(absoluteUrl(route.path))}</loc></url>`)
  .join('\n')}\n</urlset>\n`;
write(join(distRoot, 'sitemap.xml'), sitemap);
write(join(distRoot, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`Generated ${routes.length} crawler-visible route documents, sitemap.xml, and robots.txt.`);
