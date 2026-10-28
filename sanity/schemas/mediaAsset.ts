import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'mediaAsset',
  title: 'Media Asset',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
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
      title: 'Cloudinary URL (optional)',
      type: 'url',
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
    }),
  ],
});
