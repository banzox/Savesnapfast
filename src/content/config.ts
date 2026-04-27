import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        cover: z.string().optional(),
        author: z.string().default('SaveTikFast Team'),
        pubDate: z.date(),
        lang: z.string().default('en'),
    }),
});

export const collections = {
    'blog': blogCollection,
};
