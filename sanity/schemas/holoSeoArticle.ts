import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'holoSeoArticle',
  title: 'Holo SEO Article',
  type: 'document',
  fields: [
    defineField({ name: 'holoArticleId', title: 'Holo Article ID', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'deliveryId', title: 'Last Delivery ID', type: 'string' }),
    defineField({ name: 'event', title: 'Last Holo Event', type: 'string' }),
    defineField({ name: 'brandId', title: 'Holo Brand ID', type: 'string' }),
    defineField({ name: 'brandName', title: 'Holo Brand Name', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'contentMarkdown', title: 'Content (Markdown)', type: 'text', rows: 12, validation: (Rule) => Rule.required() }),
    defineField({ name: 'contentHtml', title: 'Content (HTML, source copy)', type: 'text', rows: 12 }),
    defineField({ name: 'metaTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'SEO Description', type: 'text', rows: 3 }),
    defineField({ name: 'featuredImage', title: 'Featured Image URL', type: 'url' }),
    defineField({
      name: 'images',
      title: 'Inline Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'Image URL', type: 'url' }),
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
          ],
          preview: { select: { title: 'alt', subtitle: 'url' } },
        },
      ],
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({ name: 'isRepublish', title: 'Republished', type: 'boolean', initialValue: false }),
    defineField({ name: 'receivedAt', title: 'Last Received At', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt' },
  },
});
