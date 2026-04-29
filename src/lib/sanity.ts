import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'wxky32kg';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // Increase timeout and add retry logic
  requestTagPrefix: 'boc-site',
});

console.log('Sanity Client Config:', { projectId, dataset, apiVersion });

// Test connection on load (optional - can remove in production)
if (typeof window !== 'undefined') {
  sanityClient
    .fetch('*[_type == "vaultItem"][0..0]')
    .then(() => {
      console.log('✅ Sanity connection successful');
    })
    .catch((err) => {
      console.error('❌ Sanity connection failed:', err.message);
      if (err.message.includes('CORS')) {
        console.error('💡 CORS Issue: Add your domain to Sanity CORS settings at https://sanity.io/manage');
      }
    });
}

const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  return imageBuilder.image(source as never);
}

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
};

export const isSanityConfigured = Boolean(projectId && dataset);
