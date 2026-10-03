// 前端本地 Mock 数据源：后端（server/）未启动时兜底使用，接口与真实后端一致
import { posts } from '../data/posts'

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

const sortedByDateDesc = () => [...posts].sort((a, b) => b.date.localeCompare(a.date))

export async function fetchPosts() {
  await delay()
  return sortedByDateDesc()
}

export async function fetchPost(slug) {
  await delay()
  return posts.find((p) => p.slug === slug) ?? null
}

export async function fetchCategories() {
  await delay()
  const map = new Map()
  for (const p of posts) map.set(p.category, (map.get(p.category) ?? 0) + 1)
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function fetchTags() {
  await delay()
  const map = new Map()
  for (const p of posts) for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1)
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
