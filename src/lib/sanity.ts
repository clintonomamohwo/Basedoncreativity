import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'wxky32kg';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

const imageBuilder = imageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  return imageBuilder.image(source as never);
}

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
};

export const isSanityConfigured = Boolean(projectId && dataset);
