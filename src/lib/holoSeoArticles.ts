import { sanityClient } from './sanity';

export interface HoloSeoArticle {
  holoArticleId: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string | null;
  publishedAt: string | null;
}

const publishedHoloArticlesQuery = `*[_type == "holoSeoArticle" && defined(publishedAt)] | order(publishedAt desc) {
  "holoArticleId": holoArticleId,
  "slug": select(defined(slug.current) => slug.current, slug),
  title,
  excerpt,
  contentMarkdown,
  metaTitle,
  metaDescription,
  featuredImage,
  publishedAt
}`;

/** Sanity is configured with the published perspective; drafts are never returned. */
export function fetchPublishedHoloSeoArticles(): Promise<HoloSeoArticle[]> {
  return sanityClient.fetch<HoloSeoArticle[]>(publishedHoloArticlesQuery);
}
