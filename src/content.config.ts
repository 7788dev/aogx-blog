import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// 博客内容集合：src/content/blog/ 下的每个 .md 文件就是一篇文章
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().default(''),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.number().min(0).max(5).default(0),
  }),
})

export const collections = { blog }
