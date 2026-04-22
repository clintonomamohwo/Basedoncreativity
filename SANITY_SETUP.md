# Based on Creativity
<p align="center">
  <img src="./src/assets/boc_logo.png" alt="Based on Creativity Logo" width="120" />
</p>
<p align="center">
  <em>A legacy digital media company</em><br/>
  <strong>Built in the quiet. Born in the light.</strong>
</p>

<p align="center">

![Status](https://img.shields.io/badge/status-active-111111?style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-111111?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-111111?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-111111?style=flat&logo=vite&logoColor=FFD62E)
![Sanity](https://img.shields.io/badge/Sanity-111111?style=flat&logo=sanity&logoColor=F03E2F)

</p>

---
# Sanity CMS Setup for Based on Creativity

The BOC website is now wired to **Sanity** so Clinton can manage portfolio content, vault items, and stories from a dashboard instead of editing code. The website frontend reads published content from the **`production`** dataset, while local administrative tasks such as seeding content and deploying the Studio use a private write token stored only in local environment files.

| Item | Value |
| --- | --- |
| **Sanity project ID** | `wxky32kg` |
| **Dataset** | `production` |
| **Frontend read mode** | Published content only |
| **Local admin auth** | `SANITY_AUTH_TOKEN` in `.env` |
| **Studio config files** | `sanity.config.ts`, `sanity.cli.ts` |
| **Frontend client file** | `src/lib/sanity.ts` |

## Accessing the Sanity Studio dashboard

The Studio is configured inside this same repository, so there is no separate codebase to manage. From the project root, Clinton can run the Studio locally and sign in with his Sanity account to manage content.

| Task | Command | Notes |
| --- | --- | --- |
| **Start the website locally** | `pnpm dev` | Runs the Vite app |
| **Start Sanity Studio locally** | `pnpm sanity:dev` | Opens the content dashboard locally |
| **Open Sanity CLI** | `pnpm sanity` | Useful for Sanity maintenance tasks |
| **Deploy the Studio** | `pnpm sanity:deploy` | Publishes a hosted Studio |

When the Studio is running locally, Sanity will provide the local URL in the terminal. If Clinton prefers the hosted Sanity project area, he can also sign in through the Sanity management portal for the project and use the deployed Studio once it has been published.

## Environment variables

The frontend only needs the public project settings. Local write operations such as seeding sample content or deploying the Studio additionally require a private token. That token must stay in `.env` and **must never be placed in browser-exposed `VITE_` variables**.

| Variable | Purpose |
| --- | --- |
| **`VITE_SANITY_PROJECT_ID`** | Public frontend project ID |
| **`VITE_SANITY_DATASET`** | Public frontend dataset name |
| **`VITE_SANITY_API_VERSION`** | API version used by frontend queries |
| **`SANITY_STUDIO_PROJECT_ID`** | Project ID used by local Studio tooling |
| **`SANITY_STUDIO_DATASET`** | Dataset used by local Studio tooling |
| **`SANITY_STUDIO_API_VERSION`** | API version used by local Studio tooling |
| **`SANITY_AUTH_TOKEN`** | Private write token for local admin tasks |

## Content types available in the dashboard

The Studio contains three main document types, plus a reusable media object. This keeps the editing experience simple while preserving the current site design.

| Content type | Purpose | Key fields |
| --- | --- | --- |
| **Portfolio Project** | Powers the Work page | Title, slug, client, category, description, thumbnail, gallery images, tags, date, featured, manual order |
| **Vault Item** | Powers the Vault page | Title, slug, category, main visual, description, tags, date, featured |
| **Story** | Powers the Stories page and story detail view | Title, slug, excerpt, body, cover image, author, category, published date, featured |
| **Media Asset** | Reusable image object | Sanity image upload, Cloudinary URL, alt text |

The media field supports **either** a native Sanity image upload **or** a Cloudinary URL, which means BOC can continue using existing Cloudinary assets while also gaining the option to upload directly into Sanity when that is more convenient.

## Adding or editing portfolio projects

Portfolio entries appear on the **Work** page. The current layout is preserved, but the cards now read from Sanity whenever published portfolio records are available.

| Step | What to do |
| --- | --- |
| **1** | Open **Portfolio Project** in the Studio |
| **2** | Create a new document or edit an existing one |
| **3** | Fill in the **Title**, **Client**, **Category**, and **Description** |
| **4** | Generate the **Slug** from the title |
| **5** | Add a **Thumbnail** image and any supporting **Images** |
| **6** | Set **Tags**, **Date**, and **Featured** as needed |
| **7** | Use the **Order** field if Clinton wants a custom sequence |
| **8** | Publish the document |

If no published portfolio items are available yet, the page falls back to the original hardcoded content so the design does not break.

## Adding vault items

Vault items power the image-driven **Vault** gallery. The filters and gallery experience remain intact; only the content source has changed.

| Step | What to do |
| --- | --- |
| **1** | Open **Vault Item** in the Studio |
| **2** | Enter the **Title** and generate the **Slug** |
| **3** | Choose the **Category** |
| **4** | Add the **Main Visual** using a Sanity upload or Cloudinary URL |
| **5** | Add a short **Description** and any **Tags** |
| **6** | Set the **Date** and optional **Featured** flag |
| **7** | Publish the document |

The frontend maps published vault items into the existing gallery layout and keeps the previous fallback gallery in place if Sanity is empty or unavailable.

## Adding stories

Stories power both the **Stories** listing page and each **Story Detail** page. The listing page uses the published story title and summary, while the detail page renders the story body from Sanity content.

| Step | What to do |
| --- | --- |
| **1** | Open **Story** in the Studio |
| **2** | Enter the **Title** and generate the **Slug** |
| **3** | Write an **Excerpt** for the listing page |
| **4** | Enter the main story content in **Body** |
| **5** | Add an optional **Cover Image** |
| **6** | Confirm **Author**, **Category**, and **Published At** |
| **7** | Publish the story |

At the moment, story detail pages render Sanity stories as editorial reading content. The original hardcoded story content remains as a fallback for older routes that are not yet replaced in Sanity.

## Sample content seeded into Sanity

Starter content has been added so the CMS-backed pages are not empty. These records can be edited or deleted directly from the Studio.

| Document type | Seeded items |
| --- | --- |
| **Portfolio Project** | `BOC Brand System Refresh`, `Creativity Base Web Platform`, `Motion Merch Capsule` |
| **Vault Item** | `Royal Dog Editorial Portrait`, `Golden Fox Study`, `Avatar Creation` |
| **Story** | `Creative Discipline After Dark`, `Building Worlds With Intent` |

## Deployment notes

The main website continues to deploy from **Vercel** on pushes to the tracked branch. The Sanity Studio is separate from the Vite site and can be deployed independently when Clinton wants a hosted editorial dashboard.

| Deployment target | How it works |
| --- | --- |
| **Website** | Vercel builds the React/Vite app from the repository |
| **Sanity Studio** | Deploy separately with `pnpm sanity:deploy` |
| **Content updates** | Publishing content in Sanity updates the data source without code changes |

If Clinton wants the Studio hosted, he can run the deploy command from this repository, follow the Sanity prompts, and then share the resulting Studio URL with editors.

## Operational notes

The integration was built to preserve the current visual design while moving content management into Sanity. The site still includes fallback content paths so the public pages remain stable even if Sanity content is incomplete.

| File | Role |
| --- | --- |
| **`src/lib/sanity.ts`** | Shared frontend Sanity client |
| **`src/lib/sanityContent.ts`** | Queries, content mapping, and media helpers |
| **`sanity.config.ts`** | Studio configuration |
| **`sanity.cli.ts`** | CLI configuration |
| **`scripts/seed-sanity.mjs`** | Seed script for sample content |

For security, the write token should remain local only. If the token is ever rotated, Clinton only needs to update `.env` locally before running admin tasks again.
