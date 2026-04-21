import { useEffect } from 'react';

const SITE_NAME = 'Based on Creativity';
const SITE_URL = 'https://www.bochq.com';
const DEFAULT_IMAGE = `${SITE_URL}/bochq-logo.png`;

type SEOType = 'website' | 'article';
type TwitterCard = 'summary' | 'summary_large_image';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  type?: SEOType;
  image?: string;
  twitterCard?: TwitterCard;
  robots?: string;
}

function upsertMeta(selector: string, attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel='${rel}']`);

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

export function SEO({
  title,
  description,
  path,
  type = 'website',
  image = DEFAULT_IMAGE,
  twitterCard = 'summary_large_image',
  robots = 'index, follow',
}: SEOProps) {
  useEffect(() => {
    const normalizedPath = path ?? window.location.pathname;
    const absoluteUrl = normalizedPath.startsWith('http')
      ? normalizedPath
      : `${SITE_URL}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;

    document.title = title;

    upsertMeta("meta[name='description']", 'name', 'description', description);
    upsertMeta("meta[name='robots']", 'name', 'robots', robots);
    upsertMeta("meta[property='og:title']", 'property', 'og:title', title);
    upsertMeta("meta[property='og:description']", 'property', 'og:description', description);
    upsertMeta("meta[property='og:type']", 'property', 'og:type', type);
    upsertMeta("meta[property='og:url']", 'property', 'og:url', absoluteUrl);
    upsertMeta("meta[property='og:image']", 'property', 'og:image', image);
    upsertMeta("meta[property='og:site_name']", 'property', 'og:site_name', SITE_NAME);
    upsertMeta("meta[name='twitter:card']", 'name', 'twitter:card', twitterCard);
    upsertMeta("meta[name='twitter:title']", 'name', 'twitter:title', title);
    upsertMeta("meta[name='twitter:description']", 'name', 'twitter:description', description);
    upsertMeta("meta[name='twitter:image']", 'name', 'twitter:image', image);

    upsertLink('canonical', absoluteUrl);
  }, [description, image, path, robots, title, twitterCard, type]);

  return null;
}
