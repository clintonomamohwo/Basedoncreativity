import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@sanity/client';

type JsonRecord = Record<string, unknown>;
type HoloImage = { url: string; alt: string };
type HoloArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  contentHtml?: string;
  contentMarkdown: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string | null;
  images?: HoloImage[];
  publishedAt: string;
  isRepublish?: boolean;
};
type HoloPayload = {
  version: number;
  test?: boolean;
  event: 'article.published' | 'article.updated';
  deliveryId: string;
  sentAt?: string;
  brand?: { id?: string; name?: string };
  article: HoloArticle;
};

const MAX_BODY_BYTES = 2 * 1024 * 1024;
const DEFAULT_SITE_URL = 'https://www.bochq.com';

class PayloadTooLargeError extends Error {}

function sendJson(res: ServerResponse, status: number, value: JsonRecord) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(value));
}

async function readRawBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const part = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += part.length;
    if (size > MAX_BODY_BYTES) throw new PayloadTooLargeError();
    chunks.push(part);
  }
  return Buffer.concat(chunks);
}

function constantTimeTextEqual(left: string, right: string) {
  const leftBytes = Buffer.from(left, 'utf8');
  const rightBytes = Buffer.from(right, 'utf8');
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function verifyAuthentication(rawBody: Buffer, req: IncomingMessage, secret: string) {
  const mode = (process.env.HOLO_WEBHOOK_AUTH_MODE || 'hmac').toLowerCase();
  if (mode === 'bearer') {
    const authorization = req.headers.authorization;
    return typeof authorization === 'string' && constantTimeTextEqual(authorization, `Bearer ${secret}`);
  }
  if (mode !== 'hmac') return false;
  const signature = req.headers['x-holo-signature'];
  if (typeof signature !== 'string') return false;
  const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`;
  return constantTimeTextEqual(signature, expected);
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function parsePayload(value: unknown): HoloPayload | null {
  if (!isRecord(value) || !isRecord(value.article)) return null;
  const article = value.article;
  if (
    value.version !== 1 ||
    (value.event !== 'article.published' && value.event !== 'article.updated') ||
    typeof value.deliveryId !== 'string' ||
    typeof article.id !== 'string' ||
    typeof article.slug !== 'string' ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(article.slug) ||
    typeof article.title !== 'string' ||
    typeof article.contentMarkdown !== 'string' ||
    !article.contentMarkdown.trim() ||
    typeof article.publishedAt !== 'string' ||
    Number.isNaN(Date.parse(article.publishedAt))
  ) {
    return null;
  }
  if (article.featuredImage != null && !isHttpsUrl(article.featuredImage)) return null;
  if (
    article.images != null &&
    (!Array.isArray(article.images) ||
      article.images.some((image) => !isRecord(image) || !isHttpsUrl(image.url)))
  ) {
    return null;
  }
  return value as unknown as HoloPayload;
}

function makeDocumentId(articleId: string) {
  const safeId = articleId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  return `holo-seo-${safeId}`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { message: 'Method Not Allowed' });
    return;
  }

  if (!String(req.headers['content-type'] || '').toLowerCase().includes('application/json')) {
    sendJson(res, 415, { message: 'Expected application/json' });
    return;
  }

  const secret = process.env.HOLO_WEBHOOK_SECRET;
  if (!secret) {
    sendJson(res, 503, { message: 'Webhook secret is not configured' });
    return;
  }

  let rawBody: Buffer;
  try {
    rawBody = await readRawBody(req);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      sendJson(res, 413, { message: 'Payload exceeds the 2 MB limit' });
      return;
    }
    sendJson(res, 400, { message: 'Could not read request body' });
    return;
  }

  if (!verifyAuthentication(rawBody, req, secret)) {
    sendJson(res, 401, { message: 'Invalid webhook authentication' });
    return;
  }

  let decoded: unknown;
  try {
    decoded = JSON.parse(rawBody.toString('utf8'));
  } catch {
    sendJson(res, 400, { message: 'Invalid JSON body' });
    return;
  }

  if (isRecord(decoded) && decoded.test === true) {
    sendJson(res, 200, { message: 'Test webhook received; no content was written' });
    return;
  }

  const payload = parsePayload(decoded);
  if (!payload) {
    sendJson(res, 400, { message: 'Unsupported or incomplete Holo article payload' });
    return;
  }

  const expectedBrandId = process.env.HOLO_BRAND_ID;
  if (expectedBrandId && payload.brand?.id !== expectedBrandId) {
    sendJson(res, 403, { message: 'Webhook brand does not match this endpoint' });
    return;
  }

  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'wxky32kg';
  const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    sendJson(res, 503, { message: 'Sanity write token is not configured' });
    return;
  }

  const article = payload.article;
  const images = (article.images || []).map((image, index) => ({
    _key: `holo-image-${index}`,
    url: image.url,
    alt: typeof image.alt === 'string' ? image.alt : '',
  }));
  const document = {
    _id: makeDocumentId(article.id),
    _type: 'holoSeoArticle',
    holoArticleId: article.id,
    deliveryId: payload.deliveryId,
    event: payload.event,
    brandId: payload.brand?.id || '',
    brandName: payload.brand?.name || '',
    title: article.title,
    slug: { _type: 'slug', current: article.slug },
    excerpt: article.excerpt || '',
    contentHtml: article.contentHtml || '',
    contentMarkdown: article.contentMarkdown,
    metaTitle: article.metaTitle || article.title,
    metaDescription: article.metaDescription || article.excerpt || '',
    featuredImage: article.featuredImage || null,
    images,
    publishedAt: article.publishedAt,
    isRepublish: Boolean(article.isRepublish || payload.event === 'article.updated'),
    receivedAt: new Date().toISOString(),
  };

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: false,
      token,
    });
    await client.createOrReplace(document);
    const baseUrl = process.env.HOLO_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
    const liveUrl = new URL(`/insights/${encodeURIComponent(article.slug)}`, baseUrl).toString();
    sendJson(res, 200, { ok: true, url: liveUrl });
  } catch {
    // Return a retryable status without returning CMS details or credentials to the sender.
    sendJson(res, 500, { message: 'Article storage failed; retry later' });
  }
}
