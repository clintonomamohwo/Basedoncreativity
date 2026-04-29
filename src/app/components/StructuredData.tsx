import { useEffect } from 'react';

/**
 * Structured Data (JSON-LD) Component
 *
 * Adds schema.org structured data to pages for better SEO.
 * Google and other search engines use this to display rich snippets.
 */

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';

    // Remove existing structured data if present
    const existing = document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }

    // Add to document head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const element = document.getElementById('structured-data');
      if (element) {
        element.remove();
      }
    };
  }, [data]);

  return null;
}

/**
 * Helper functions to generate structured data for common types
 */

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Based on Creativity',
    url: 'https://www.bochq.com',
    logo: 'https://www.bochq.com/bochq-logo.png',
    description: 'A creative studio crafting distinctive brand worlds, digital experiences, visual storytelling, and strategic design.',
    sameAs: [
      'https://instagram.com/basedoncreativity',
      'https://twitter.com/basedoncreativity',
      'https://www.linkedin.com/company/based-on-creativity/',
      'https://www.youtube.com/@basedoncreativity',
    ],
  };
}

export function createCreativeWorkSchema(params: {
  title: string;
  description: string;
  author: string;
  datePublished?: string;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: params.title,
    description: params.description,
    author: {
      '@type': 'Organization',
      name: params.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Based on Creativity',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bochq.com/bochq-logo.png',
      },
    },
    ...(params.datePublished && { datePublished: params.datePublished }),
    ...(params.image && { image: params.image }),
    url: params.url,
  };
}

export function createArticleSchema(params: {
  headline: string;
  description: string;
  author: string;
  datePublished?: string;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.headline,
    description: params.description,
    author: {
      '@type': 'Person',
      name: params.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Based on Creativity',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bochq.com/bochq-logo.png',
      },
    },
    ...(params.datePublished && { datePublished: params.datePublished }),
    ...(params.image && {
      image: {
        '@type': 'ImageObject',
        url: params.image,
      },
    }),
    url: params.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url,
    },
  };
}

export function createWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Based on Creativity',
    url: 'https://www.bochq.com',
    description: 'A creative studio crafting distinctive brand worlds, digital experiences, visual storytelling, and strategic design.',
    publisher: {
      '@type': 'Organization',
      name: 'Based on Creativity',
    },
  };
}
