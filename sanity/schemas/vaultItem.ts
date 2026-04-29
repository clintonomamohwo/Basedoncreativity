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
      title: 'Media (Image/Video)',
      type: 'object',
      description: 'Upload an image/video or provide a Cloudinary URL. For videos, use either Sanity file upload or Cloudinary URL.',
      fields: [
        {
          name: 'image',
          title: 'Image/Video File',
          type: 'image',
          description: 'Upload image files here. For videos, use Cloudinary URL below.',
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
          title: 'Cloudinary URL (for videos or external assets)',
          description: 'Full Cloudinary URL for videos. Example: https://res.cloudinary.com/basecreator/video/upload/v123/my-video.mp4',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail (optional)',
      type: 'object',
      description: '🎬 Videos automatically use the first frame as thumbnail. Only upload here if you want a different thumbnail image.',
      fields: [
        {
          name: 'image',
          title: 'Thumbnail Image',
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
