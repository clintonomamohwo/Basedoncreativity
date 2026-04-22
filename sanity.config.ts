import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

import { schemaTypes } from './sanity/schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'wxky32kg';
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2024-01-01';

export default defineConfig({
  name: 'based-on-creativity',
  title: 'Based on Creativity Studio',
  projectId,
  dataset,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  form: {
    image: {
      assetSources: (previousAssetSources) => previousAssetSources,
    },
  },
  document: {
    newDocumentOptions: (previousOptions) => previousOptions,
  },
  scheduledPublishing: {
    enabled: false,
  },
  studio: {
    components: {},
  },
  api: {
    projectId,
    dataset,
    apiVersion,
  },
});
