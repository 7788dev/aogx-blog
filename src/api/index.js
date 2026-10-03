import { fetchCategories as mockCategories, fetchPost as mockPost, fetchPosts as mockPosts, fetchTags as mockTags } from './mock'

// ============ 数据层 ============
// 优先请求真实后端（server/，开发时经 vite 代理 /api -> http://localhost:8080）。
// 后端未启动或请求失败时，自动回退到本地 Mock，保证前台可独立运行。

async function request(path) {
  const res = await fetch(`/api${path}`, { headers: { 'Content-Type': 'application/json' } })
  const body = await res.json()
  if (body.code !== 200) throw new Error(body.msg || `HTTP ${res.status}`)
  return body.data
}

/** 文章列表（按日期倒序，含 tags 与正文） */
export async function fetchPosts() {
  try {
    return await request('/posts')
  } catch {
    return mockPosts()
  }
}

/** 按 slug 获取单篇文章；不存在返回 null */
export async function fetchPost(slug) {
  try {
    return (await request(`/posts/${encodeURIComponent(slug)}`)) ?? null
  } catch {
    return mockPost(slug)
  }
}

/** 当前文章的上一篇（更旧）与下一篇（更新），基于全量列表计算 */
export async function fetchNeighbors(slug) {
  const list = await fetchPosts()
  const i = list.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return { prev: list[i + 1] ?? null, next: list[i - 1] ?? null }
}

export async function fetchCategories() {
  try {
    return await request('/categories')
  } catch {
    return mockCategories()
  }
}

export async function fetchTags() {
  try {
    return await request('/tags')
  } catch {
    return mockTags()
  }
}
