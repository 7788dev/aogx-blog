import { marked } from 'marked'

/** 为标题文本生成稳定的锚点 slug（保留中英文与数字） */
function slugify(text, counts) {
  let slug =
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  const n = counts.get(slug) ?? 0
  counts.set(slug, n + 1)
  return n > 0 ? `${slug}-${n}` : slug
}

/**
 * 渲染 Markdown 为 HTML，同时为 h2/h3 注入锚点 id 并收集目录信息。
 * 返回 { html, headings }，headings 元素为 { level, text, slug }。
 */
export function renderMarkdown(content) {
  const counts = new Map()
  const headings = []
  const html = marked.parse(content).replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_, level, inner) => {
      const text = inner.replace(/<[^>]+>/g, '').trim()
      const slug = slugify(text, counts)
      headings.push({ level: Number(level), text, slug })
      return `<h${level} id="${slug}">${inner}</h${level}>`
    },
  )
  return { html, headings }
}
