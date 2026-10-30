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

const routes = [
  {
    path: '/',
    title: 'Based on Creativity (BOC) | Creative Studio',
    description:
      'Based on Creativity is a creative studio bringing brands and stories to life through graphic design, web development, animation, and publishing.',
    heading: 'Based on Creativity, a studio for ideas in motion',
    body:
      'Based on Creativity is a Toronto creative studio for brand identity, digital experiences, animation, editorial work, and visual storytelling.',
    type: 'website',
  },
  {
    path: '/work',
    title: 'Selected Work | Based on Creativity',
    description:
      'Explore selected brand identity, web development, animation, editorial, and visual storytelling work from Based on Creativity.',
    heading: 'Selected work from Based on Creativity',
    body:
      'Explore creative work across brand systems, digital platforms, animation, editorial design, and visual storytelling.',
  },
  {
    path: '/services',
    title: 'Creative Services | Based on Creativity',
    description:
      'Explore Based on Creativity services for brand identity, digital experiences, technical writing, AI automation, and workflow design.',
    heading: 'Creative services for brands and ideas in motion',
    body:
      'Based on Creativity helps organizations shape distinctive identities, digital experiences, content systems, and creative workflows.',
  },
  {
    path: '/studio',
    title: 'Studio | Based on Creativity',
    description:
      'Meet the Based on Creativity studio and discover how narrative, design craft, motion, and world-building shape each collaboration.',
    heading: 'Inside the Based on Creativity studio',
    body:
      'The studio combines strategic thinking, visual craft, and storytelling to give ambitious ideas a clear, memorable form.',
  },
  {
    path: '/vault',
    title: 'The Vault | Based on Creativity',
    description:
      'Explore The Vault, an experimental gallery of moving images, visual studies, and creative artifacts from Based on Creativity.',
    heading: 'The Vault',
    body:
      'The Vault collects visual studies, motion experiments, and creative artifacts from the Based on Creativity studio.',
  },
  {
    path: '/about',
    title: 'About | Based on Creativity',
    description:
      'Learn about Based on Creativity, a Toronto creative studio building thoughtful brand worlds, digital experiences, and visual stories.',
    heading: 'About Based on Creativity',
    body:
      'Based on Creativity is a creative studio focused on ideas that need a distinctive visual world and a purposeful digital home.',
  },
  {
    path: '/contact',
    title: 'Contact | Based on Creativity',
    description:
      'Contact Based on Creativity to discuss brand identity, digital design, creative direction, and collaborative storytelling projects.',
    heading: 'Start a conversation',
    body:
      'Bring a question, a rough idea, or an established brand challenge. Based on Creativity welcomes collaborative creative work.',
  },
  {
    path: '/stories',
    title: 'Stories | Based on Creativity',
    description:
      'Read stories and reflections from Based on Creativity on creative discipline, design craft, narrative, and building worlds with intent.',
    heading: 'Stories from Based on Creativity',
    body:
      'Read reflections on creative practice, design, storytelling, and the ideas that shape the studio’s work.',
  },
  {
    path: '/library',
    title: 'Library | Based on Creativity',
    description:
      'Explore the Based on Creativity library of reflections, expressions, and curated creative work across mediums and themes.',
    heading: 'The Based on Creativity library',
    body:
      'The library is a growing collection of creative references, reflections, and studio work for curious collaborators.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Based on Creativity',
    description:
      'Read the Based on Creativity privacy policy to understand how personal information is collected, used, stored, and protected.',
    heading: 'Privacy policy',
    body:
      'Read how Based on Creativity handles personal information collected through this website and its contact channels.',
  },
  {
    path: '/terms',
    title: 'Terms of Service | Based on Creativity',
    description:
      'Review the Based on Creativity terms of service covering website use, intellectual property, and service expectations.',
    heading: 'Terms of service',
    body:
      'Review the terms that govern use of the Based on Creativity website and related services.',
  },
  {
    path: '/work/boc-brand-identity',
    title: 'BOC Brand System Refresh | Based on Creativity',
    description:
      'Explore the Based on Creativity brand system refresh, bringing logo variations, colour, typography, and digital-card styles into one visual system.',
    heading: 'BOC Brand System Refresh',
    body:
      'A cohesive brand refresh for Based on Creativity, bringing logo, colour, typography, and digital-card systems into one recognizable expression.',
    type: 'creativework',
  },
  {
    path: '/work/bochq-website',
    title: 'Creativity Base Web Platform | Based on Creativity',
    description:
      'Explore the Creativity Base Web Platform, a shared digital home for services, stories, and creative work from Based on Creativity.',
    heading: 'Creativity Base Web Platform',
    body:
      'A completed digital platform that brings services, stories, and creative work together in one cinematic editorial experience.',
    type: 'creativework',
  },
  {
    path: '/work/first-animated-series',
    title: 'First Animated Series | Based on Creativity',
    description:
      'Discover the early development of Creativity Base Studios’ original animated series, including character, world, and visual-language exploration.',
    heading: 'First Animated Series',
    body:
      'An original animated series in development, exploring character design, narrative, and a distinct visual world.',
    type: 'creativework',
  },
  {
    path: '/work/first-publication',
    title: 'First Publication | Based on Creativity',
    description:
      'Explore the development of Creativity Base Press’ first illustrated publication, bringing editorial, publishing, and illustration together.',
    heading: 'First Publication',
    body:
      'An illustrated written work in development that brings editorial, publishing, and illustration into a first original title.',
    type: 'creativework',
  },
  {
    path: '/work/motion-merch-capsule',
    title: 'Motion Merch Capsule | Based on Creativity',
    description:
      'Explore a Based on Creativity concept for a limited merchandise launch with product visuals, animation, and campaign design.',
    heading: 'Motion Merch Capsule',
    body:
      'A studio-owned concept for a connected merchandise campaign, including motion-led launch visuals and a cohesive artwork system.',
    type: 'creativework',
  },
  {
    path: '/work/modern-cosmos',
    title: 'Modern Cosmos Website Redesign | Based on Creativity',
    description:
      'Explore Based on Creativity’s responsive website redesign and visual presentation work for Modern Cosmos.',
    heading: 'Modern Cosmos website redesign',
    body:
      'A completed responsive website redesign that gave Modern Cosmos a more considered and imaginative digital presentation.',
    type: 'creativework',
  },
  {
    path: '/stories/creative-discipline-after-dark',
    title: 'Creative Discipline After Dark | Based on Creativity',
    description:
      'Read Creative Discipline After Dark, a Based on Creativity story about sustained creative practice and intentional making.',
    heading: 'Creative Discipline After Dark',
    body:
      'A reflection from Based on Creativity on creative practice, discipline, and making with intention.',
    type: 'article',
  },
  {
    path: '/stories/building-worlds-with-intent',
    title: 'Building Worlds with Intent | Based on Creativity',
    description:
      'Read Building Worlds with Intent, a Based on Creativity story about narrative, design systems, and purposeful creative direction.',
    heading: 'Building Worlds with Intent',
    body:
      'A Based on Creativity reflection on shaping visual worlds through narrative, design systems, and purposeful direction.',
    type: 'article',
  },
  {
    path: '/faq',
    title: 'FAQ | Based on Creativity',
    description:
      'The Based on Creativity FAQ page is in development and will soon share answers about the studio process and approach.',
    heading: 'Frequently asked questions',
    body: 'This page is in development. Explore the studio, work, services, or contact page for current information.',
    robots: 'noindex, follow',
  },
  {
    path: '/community',
    title: 'Community | Based on Creativity',
    description:
      'The Based on Creativity community page is in development and will introduce future opportunities to connect, collaborate, and learn together.',
    heading: 'Community',
    body: 'This page is in development. Explore the studio, work, services, or contact page for current information.',
    robots: 'noindex, follow',
  },
  {
    path: '/partners',
    title: 'Partners | Based on Creativity',
    description:
      'The Based on Creativity partners page is in development and will soon highlight creative collaborations and strategic partnerships.',
    heading: 'Partners',
    body: 'This page is in development. Explore the studio, work, services, or contact page for current information.',
    robots: 'noindex, follow',
  },
];

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
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
    image: defaultImage,
  };

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

function fallbackMarkup(route) {
  return `
    <main class="seo-fallback" id="main-content">
      <p class="seo-kicker">Based on Creativity</p>
      <h1>${escapeHtml(route.heading)}</h1>
      <p>${escapeHtml(route.body)}</p>
      <nav aria-label="Explore Based on Creativity">
        <a href="/work">Work</a>
        <a href="/services">Services</a>
        <a href="/studio">Studio</a>
        <a href="/stories">Stories</a>
        <a href="/contact">Contact</a>
      </nav>
    </main>`;
}

function buildDocument(shell, route) {
  const url = absoluteUrl(route.path);
  const robots = route.robots ?? 'index, follow';
  const documentTitle = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const jsonLd = JSON.stringify(schemaFor(route)).replace(/</g, '\\u003c');
  const assetLinks = [...shell.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => !/rel=["']canonical["']/i.test(tag))
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
      <meta property="og:image" content="${defaultImage}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${documentTitle}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${defaultImage}" />
      <script type="application/ld+json">${jsonLd}</script>
      <style>.seo-fallback{max-width:72rem;margin:0 auto;padding:7rem 1.5rem;font-family:system-ui,sans-serif;color:#111;background:#fff}.seo-fallback .seo-kicker{font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.seo-fallback h1{max-width:18ch;font-size:clamp(2.25rem,6vw,4.8rem);line-height:1.04}.seo-fallback p{max-width:48rem;font-size:1.1rem;line-height:1.6}.seo-fallback nav{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem}.seo-fallback a{color:#1A1F4B;font-weight:700}</style>
      ${assetLinks}
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
