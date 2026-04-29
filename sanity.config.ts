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
  theme: {
    color: {
      default: {
        base: {
          bg: '#FFF6D8',
          fg: '#1A1F4B',
          border: '#8B7355',
          focusRing: '#FFC857',
          shadow: { outline: 'rgba(255, 200, 87, 0.5)', umbra: 'rgba(26, 31, 75, 0.2)' },
        },
        solid: {
          primary: { bg: '#1A1F4B', fg: '#FFF6D8', border: '#1A1F4B' },
          success: { bg: '#4A7C59', fg: '#FFF6D8', border: '#4A7C59' },
          caution: { bg: '#FFC857', fg: '#1A1F4B', border: '#FFC857' },
          critical: { bg: '#C84B31', fg: '#FFF6D8', border: '#C84B31' },
        },
        muted: {
          primary: { bg: '#F6E6B4', fg: '#1A1F4B', border: '#D8CAA8' },
          transparent: { bg: 'rgba(26, 31, 75, 0.05)', fg: '#1A1F4B', border: 'transparent' },
        },
      },
    },
  },
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
