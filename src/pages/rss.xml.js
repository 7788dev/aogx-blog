import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { siteConfig } from '../config.js'
import { withBase } from '../utils/links.js'

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  )

  return rss({
    title: `${siteConfig.name} · ${siteConfig.latinName}`,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: withBase(`posts/${post.id}/`),
    })),
    customData: '<language>zh-cn</language>',
  })
}
