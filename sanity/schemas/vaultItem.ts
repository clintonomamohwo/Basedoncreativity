import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'vaultItem',
  title: 'Vault Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Writing', value: 'writing' },
          { title: 'Design', value: 'design' },
          { title: 'Photography', value: 'photography' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'object',
      fields: [
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
        {
          name: 'cloudinaryUrl',
          title: 'Cloudinary URL (optional)',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image.image',
    },
    prepare(selection) {
      const { title, category, media } = selection;
      return {
        title,
        subtitle: category || 'No category',
        media,
      };
    },
  },
});
