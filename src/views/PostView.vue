<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import { fetchNeighbors, fetchPost } from '../api'
import { renderMarkdown } from '../utils/markdown'
import { charCount, formatDate, readingMinutes } from '../utils/format'

const route = useRoute()
const post = ref(null)
const neighbors = ref({ prev: null, next: null })
const loading = ref(true)
const renderedHtml = ref('')
const headings = ref([])
const activeId = ref('')
let observer = null

async function load(slug) {
  loading.value = true
  const [p, n] = await Promise.all([fetchPost(slug), fetchNeighbors(slug)])
  post.value = p
  neighbors.value = n
  if (p) {
    const { html, headings: hs } = renderMarkdown(p.content)
    renderedHtml.value = html
    headings.value = hs
  } else {
    renderedHtml.value = ''
    headings.value = []
  }
  loading.value = false
  await nextTick()
  setupSpy()
}

// 目录滚动高亮：标题进入视口上部 30% 区域时视为「当前章节」
function setupSpy() {
  observer?.disconnect()
  activeId.value = headings.value[0]?.slug ?? ''
  const els = document.querySelectorAll('.post-content h2, .post-content h3')
  if (!els.length || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId.value = entry.target.id
      }
    },
    { rootMargin: '-90px 0px -70% 0px' },
  )
  els.forEach((el) => observer.observe(el))
}

function scrollTo(slug) {
  document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(() => route.params.slug, (slug) => { if (slug) load(slug) }, { immediate: true })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="container">
    <div v-if="loading" class="state-hint">正在加载文章…</div>

    <article v-else-if="post" class="post-page">
      <header class="post-header">
        <router-link class="post-cat" :to="`/category/${post.category}`">
          {{ post.category }}
        </router-link>
        <h1 class="post-title">{{ post.title }}</h1>
        <p class="post-meta">
          <span class="meta-item">
            <AppIcon name="calendar" :size="14" />
            <time>{{ formatDate(post.date) }}</time>
          </span>
          <span class="meta-item">
            <AppIcon name="clock" :size="14" />
            <span>约 {{ readingMinutes(post.content) }} 分钟</span>
          </span>
          <span class="meta-item">
            <AppIcon name="file-text" :size="14" />
            <span>{{ charCount(post.content) }} 字</span>
          </span>
        </p>
      </header>

      <!-- content 为本地静态数据，无 XSS 风险；接入用户生成内容前需先做过滤 -->
      <div class="post-content" v-html="renderedHtml"></div>

      <div class="tag-row">
        <router-link v-for="tag in post.tags" :key="tag" class="tag-link" :to="`/tag/${tag}`">
          <AppIcon name="hash" :size="12" />
          {{ tag }}
        </router-link>
      </div>

      <nav class="post-neighbor" aria-label="上下篇">
        <router-link
          v-if="neighbors.prev"
          class="neighbor"
          :to="`/post/${neighbors.prev.slug}`"
        >
          <span class="neighbor-label">← 上一篇</span>
          <span class="neighbor-title">{{ neighbors.prev.title }}</span>
        </router-link>
        <span v-else></span>

        <router-link
          v-if="neighbors.next"
          class="neighbor next"
          :to="`/post/${neighbors.next.slug}`"
        >
          <span class="neighbor-label">下一篇 →</span>
          <span class="neighbor-title">{{ neighbors.next.title }}</span>
        </router-link>
        <span v-else></span>
      </nav>

      <div class="post-back">
        <router-link class="text-link" to="/">← 回到首页</router-link>
      </div>
    </article>

    <aside v-if="post && headings.length" class="toc" aria-label="文章目录">
      <p class="toc-title">
        <AppIcon name="list" :size="13" />
        目录
      </p>
      <nav class="toc-list">
        <a
          v-for="h in headings"
          :key="h.slug"
          class="toc-link"
          :class="[`lvl${h.level}`, { active: activeId === h.slug }]"
          :href="`#${h.slug}`"
          @click.prevent="scrollTo(h.slug)"
        >
          {{ h.text }}
        </a>
      </nav>
    </aside>

    <div v-if="!loading && !post" class="state-hint">
      <p>文章不存在或已被删除。</p>
      <router-link class="text-link" to="/">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.post-cat {
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: color 0.2s;
}

.post-cat:hover {
  color: var(--accent-strong);
}

.post-title {
  font-family: var(--font-serif);
  font-size: 1.85rem;
  line-height: 1.45;
  margin: 10px 0 12px;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0;
  color: var(--text-3);
  font-size: 0.86rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

/* 标题区与正文保持呼吸感（正文首元素的外边距已被重置为 0） */
.post-header + .post-content {
  margin-top: 40px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 40px;
  padding-top: 22px;
  border-top: 1px solid var(--border);
}

.tag-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-2);
  font-size: 0.82rem;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.tag-link:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.post-neighbor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid var(--border);
}

.neighbor {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.neighbor.next {
  text-align: right;
}

.neighbor-label {
  color: var(--text-3);
  font-size: 0.8rem;
}

.neighbor-title {
  color: var(--text);
  font-size: 0.94rem;
  font-weight: 500;
  line-height: 1.5;
  transition: color 0.2s;
}

.neighbor:hover .neighbor-title {
  color: var(--accent-strong);
}

.post-back {
  margin-top: 24px;
}

/* ---- 右侧目录（宽屏显示） ---- */
.toc {
  display: none;
}

@media (min-width: 1200px) {
  .toc {
    display: block;
    position: fixed;
    top: 104px;
    left: calc(50% + 360px);
    width: 216px;
    max-height: calc(100vh - 160px);
    overflow-y: auto;
    font-size: 0.85rem;
  }
}

.toc-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-3);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  margin: 0 0 10px 16px;
}

.toc-list {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border);
}

.toc-link {
  display: block;
  padding: 4px 0 4px 14px;
  margin-left: -1px;
  border-left: 2px solid transparent;
  color: var(--text-3);
  line-height: 1.55;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.toc-link.lvl3 {
  padding-left: 28px;
}

.toc-link:hover {
  color: var(--text);
}

.toc-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
}

@media (max-width: 640px) {
  .post-neighbor {
    grid-template-columns: 1fr;
  }
}
</style>
