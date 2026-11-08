# Holo SEO publishing integration

This worktree contains a prepared Holo-to-Sanity receiver and a separate Insights destination. It is not connected to Holo, deployed, or publishing content. The existing Stories and Library pages remain separate.

## Receiver route and behavior

The Vercel function is `api/holo/seo.ts`, which maps to `/api/holo/seo` after deployment. It accepts Holo's version 1 JSON article events, verifies the raw request body using HMAC-SHA256 by default, and upserts a `holoSeoArticle` document in Sanity using the stable Holo article ID. Repeated deliveries update the same document instead of creating duplicates.

Requests marked `test: true` are authenticated and acknowledged, but never write to Sanity. Live article deliveries require a Sanity write token and return the article URL as `{ "url": "https://www.bochq.com/insights/<slug>" }` so Holo can associate its published article with the site URL. The Insights app route reads published documents from Sanity, so a newly delivered slug can resolve without a website deployment.

The receiver does not expose the Holo secret in code or logs. Keep all secrets in server-side environment settings only, never in a `VITE_` variable or browser code.

## Environment settings needed later

Configure these server-side only, after the user approves a deployment and a Holo connection:

- `HOLO_WEBHOOK_SECRET`: the Holo secret shown once while connecting the webhook.
- `HOLO_WEBHOOK_AUTH_MODE`: `hmac` (recommended and the default), or `bearer` if that is the authentication choice made in Holo.
- `SANITY_API_TOKEN`: a write token restricted to the BOC Sanity project and production dataset.
- `SANITY_PROJECT_ID`: defaults to `wxky32kg` if omitted.
- `SANITY_DATASET`: defaults to `production` if omitted.
- `HOLO_PUBLIC_SITE_URL`: defaults to `https://www.bochq.com`.
- `HOLO_BRAND_ID`: optional expected Holo brand UUID, to reject events from another brand.

No Holo-generated URL or secret is available yet. The public callback URL will only exist after the API route is deployed over HTTPS. At that point, configure Holo to POST to `https://www.bochq.com/api/holo/seo`, choose HMAC authentication, copy the one-time Holo secret directly into the server-side environment setting, and send Holo's test delivery first. Do not paste the secret into source files or chat.

## Safe activation sequence

1. Review the local `/insights` preview and approve the implementation separately from any deployment.
2. Deploy the receiver and Insights route only after explicit approval. No deploy has happened as part of this preparation.
3. Add the server-side environment settings above. The Sanity token must be scoped to the correct project and dataset.
4. Connect Holo using the public HTTPS callback and HMAC mode, then add its one-time secret to server-side settings.
5. Send Holo's test delivery. The endpoint returns success without creating or updating a Sanity document.
6. Only a real Holo publish/update event creates or updates a Sanity article. Website deployment remains a separate action and still requires approval.

## Article rendering and search indexing

Holo's Markdown is rendered as escaped React nodes, not injected as raw HTML. The Insights pages read published Holo article documents from Sanity. The local preview flag displays the three supplied draft posts with a noindex banner; it does not call the webhook or write to Sanity.

The forwarded sandbox preview is not password protected. Its noindex metadata is an indexing directive, not an access-control mechanism, so treat the temporary URL as a review link rather than a secure private area.

The static build adds published Holo article URLs to its sitemap and writes per-article SEO fallback files. The current dynamic `/insights/:slug` rewrite serves the app shell so newly delivered slugs can render from Sanity immediately, with page metadata set client-side. The sitemap refreshes at the next site build. No automatic deploy or rebuild is configured, and any deployment remains subject to separate approval.

## Protocol reference

[Holo SEO Webhooks documentation](https://docs.tryholo.ai/seo/seo-webhooks) defines the version 1 article envelope, `X-Holo-Signature: sha256=<hex>` HMAC over the exact raw JSON body, test deliveries, image URLs, delivery IDs, and retry behavior used by this scaffold.
