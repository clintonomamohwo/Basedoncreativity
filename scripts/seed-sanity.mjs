import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'wxky32kg';
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_AUTH_TOKEN;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2024-01-01';

if (!token) {
  throw new Error('SANITY_AUTH_TOKEN is required to seed content.');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const media = (cloudinaryUrl, alt) => ({
  _type: 'mediaAsset',
  cloudinaryUrl,
  alt,
});

const block = (text) => ({
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [
    {
      _type: 'span',
      marks: [],
      text,
    },
  ],
});

const documents = [
  {
    _id: 'portfolioProject-boc-brand-system',
    _type: 'portfolioProject',
    title: 'BOC Brand System Refresh',
    slug: { _type: 'slug', current: 'boc-brand-system-refresh' },
    client: 'Based on Creativity',
    category: 'Branding',
    description: 'A premium identity refresh for Based on Creativity, combining editorial typography, motion-ready assets, and a refined visual system designed for digital-first storytelling.',
    thumbnail: media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Royal_Dog_dpz0gl', 'BOC brand system presentation board'),
    images: [
      { ...media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Golden_Fox_f0mdvp', 'Brand textures and moodboard'), _key: 'brand-1' },
      { ...media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/NBA_yc2yyg', 'Identity applications and collateral'), _key: 'brand-2' },
    ],
    tags: ['Identity Design', 'Typography', 'Visual System'],
    date: '2025-02-10',
    featured: true,
    order: 1,
  },
  {
    _id: 'portfolioProject-creativity-base-web-platform',
    _type: 'portfolioProject',
    title: 'Creativity Base Web Platform',
    slug: { _type: 'slug', current: 'creativity-base-web-platform' },
    client: 'Creativity Base',
    category: 'Web Development',
    description: 'A cinematic web experience for the Creativity Base ecosystem, built to showcase services, stories, and work through a polished editorial interface.',
    thumbnail: media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Avatar_creation_gqdfew', 'Creativity Base web platform interface'),
    images: [
      { ...media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/MusicCosmo_jv8rlb', 'Homepage interaction states'), _key: 'web-1' },
      { ...media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Work_The_Dream_po2wzn', 'Editorial content layouts'), _key: 'web-2' },
    ],
    tags: ['React', 'Tailwind CSS', 'Editorial UI'],
    date: '2025-03-08',
    featured: true,
    order: 2,
  },
  {
    _id: 'portfolioProject-motion-merch-campaign',
    _type: 'portfolioProject',
    title: 'Motion Merch Capsule',
    slug: { _type: 'slug', current: 'motion-merch-capsule' },
    client: 'BOC Studio',
    category: 'Merchandise',
    description: 'A concept capsule combining product visuals, animated launch teasers, and campaign-ready artwork for a limited BOC merchandise release.',
    thumbnail: media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Glow_Penguin_g8hzna', 'Motion merch campaign hero art'),
    images: [
      { ...media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/The_Tiger_Queen_rhpere', 'Merch graphic exploration'), _key: 'merch-1' },
      { ...media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/TrevorJ1_de3b13', 'Campaign lifestyle mockup'), _key: 'merch-2' },
    ],
    tags: ['Campaign Design', 'Product Visuals', 'Animation'],
    date: '2025-04-01',
    featured: false,
    order: 3,
  },
  {
    _id: 'vaultItem-royal-dog-editorial',
    _type: 'vaultItem',
    title: 'Royal Dog Editorial Portrait',
    slug: { _type: 'slug', current: 'royal-dog-editorial-portrait' },
    category: 'Illustration',
    image: media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Royal_Dog_dpz0gl', 'Royal Dog illustration'),
    description: 'An expressive portrait study developed for the BOC vault, balancing royal iconography with modern editorial styling.',
    tags: ['Illustration', 'Editorial', 'Character'],
    date: '2025-01-20',
    featured: true,
  },
  {
    _id: 'vaultItem-golden-fox-study',
    _type: 'vaultItem',
    title: 'Golden Fox Study',
    slug: { _type: 'slug', current: 'golden-fox-study' },
    category: 'Design',
    image: media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Golden_Fox_f0mdvp', 'Golden Fox concept art'),
    description: 'A warm-toned composition exploring movement, symbolism, and premium colour treatment for future BOC campaigns.',
    tags: ['Design', 'Color Study', 'Concept'],
    date: '2025-02-14',
    featured: false,
  },
  {
    _id: 'vaultItem-avatar-creation',
    _type: 'vaultItem',
    title: 'Avatar Creation',
    slug: { _type: 'slug', current: 'avatar-creation' },
    category: '3D',
    image: media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Avatar_creation_gqdfew', 'Avatar creation artwork'),
    description: 'A polished digital artwork exploring identity, world-building, and dimensional styling for future BOC storytelling projects.',
    tags: ['3D', 'World Building', 'Digital Art'],
    date: '2025-03-21',
    featured: true,
  },
  {
    _id: 'story-creative-discipline-after-dark',
    _type: 'story',
    title: 'Creative Discipline After Dark',
    slug: { _type: 'slug', current: 'creative-discipline-after-dark' },
    excerpt: 'A reflective note on what it means to keep creating when the applause is absent and only the work remains.',
    body: [
      block('Most creative practice is not glamorous. It is built in quiet rooms, with unfinished drafts, uncertain instincts, and a standard that has to come from somewhere deeper than attention.'),
      block('For Based on Creativity, discipline is not the opposite of imagination. It is the structure that protects imagination from dissolving into intention without execution.'),
      block('The late hours matter because they reveal what remains when there is no audience. That is where voice sharpens, taste matures, and the work begins to tell the truth.'),
    ],
    coverImage: media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/Work_The_Dream_po2wzn', 'Creative Discipline After Dark cover art'),
    author: 'Based on Creativity',
    category: 'Essay',
    publishedAt: '2025-03-30T19:30:00Z',
    featured: true,
  },
  {
    _id: 'story-building-worlds-with-intent',
    _type: 'story',
    title: 'Building Worlds With Intent',
    slug: { _type: 'slug', current: 'building-worlds-with-intent' },
    excerpt: 'Why visual storytelling becomes more powerful when every image, phrase, and transition belongs to the same emotional universe.',
    body: [
      block('A strong creative world is not a pile of references. It is a system of choices that keeps returning to the same emotional center.'),
      block('When story, image, sound, and interface share intention, the audience does not just consume the work. They enter it, remember it, and attach meaning to it.'),
      block('That is the ambition behind BOC projects: not content for the moment, but worlds that feel coherent enough to outlive their launch.'),
    ],
    coverImage: media('https://res.cloudinary.com/basecreator/image/upload/f_auto,q_auto/v1/MusicCosmo_jv8rlb', 'Building Worlds With Intent cover art'),
    author: 'Based on Creativity',
    category: 'Editorial',
    publishedAt: '2025-04-08T16:00:00Z',
    featured: false,
  },
];

for (const document of documents) {
  await client.createOrReplace(document);
  console.log(`Upserted ${document._id}`);
}

const counts = await client.fetch(`{
  "portfolioProjects": count(*[_type == "portfolioProject"]),
  "vaultItems": count(*[_type == "vaultItem"]),
  "stories": count(*[_type == "story"])
}`);

console.log('\nSeed complete.');
console.log(JSON.stringify(counts, null, 2));
