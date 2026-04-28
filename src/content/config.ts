import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.any().transform((data) => {
        return {
            title: data?.title ? String(data.title) : 'Untitled Post',
            description: data?.description ? String(data.description) : '',
            cover: data?.cover ? String(data.cover) : undefined,
            author: data?.author ? String(data.author) : 'SaveTikFast Team',
            pubDate: data?.pubDate ? new Date(data.pubDate) : new Date(),
            lang: data?.lang ? String(data.lang) : 'en',
        };
    }),
});

export const collections = {
    'blog': blogCollection,
};
