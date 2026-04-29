import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'wxky32kg';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN to avoid caching issues during development
  perspective: 'published',
  requestTagPrefix: 'boc-site',
  ignoreBrowserTokenWarning: true,
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

      // Provide helpful CORS troubleshooting
      if (err.message.includes('CORS') || err.message.includes('Request error')) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('💡 CORS ISSUE DETECTED');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('');
        console.error('To fix this:');
        console.error('1. Go to: https://sanity.io/manage/personal/project/' + projectId + '/api');
        console.error('2. Click "Add CORS origin"');
        console.error('3. Add: ' + window.location.origin);
        console.error('4. Enable "Allow credentials"');
        console.error('5. Save and refresh this page');
        console.error('');
        console.error('📖 Full guide: See SANITY_CORS_FIX.md in project root');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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
