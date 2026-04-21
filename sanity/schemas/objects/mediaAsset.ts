import { defineField, defineType } from 'sanity';

export const mediaAsset = defineType({
  name: 'mediaAsset',
  title: 'Media Asset',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Sanity Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'cloudinaryUrl',
      title: 'Cloudinary URL',
      type: 'url',
      description: 'Optional Cloudinary-hosted asset URL. Use this if media is already managed in Cloudinary.',
    }),
    defineField({
      name: 'alt',
      title: 'Fallback Alt Text',
      type: 'string',
      description: 'Used when the alt text is not set directly on the uploaded image.',
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'cloudinaryUrl',
      media: 'image',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Media Asset',
        subtitle: selection.subtitle || 'Sanity-hosted image',
        media: selection.media,
      };
    },
  },
});
