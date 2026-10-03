<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import PostItem from '../components/PostItem.vue'
import { fetchBingDaily } from '../api/bing'
import { fetchPosts } from '../api'
import { siteConfig } from '../config'

const posts = ref([])
const loading = ref(true)
const keyword = ref('')
const searchInput = ref(null)
const bing = ref(null)

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  // 背景图异步加载：先展示寒夜渐变，图片就绪后淡入
  fetchBingDaily().then((data) => {
    bing.value = data
  })
  posts.value = await fetchPosts()
  loading.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

// Ctrl/⌘ + K 快捷聚焦搜索框
function onKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

const filtered = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return posts.value
  return posts.value.filter((p) =>
    [p.title, p.excerpt, p.category, ...p.tags].join(' ').toLowerCase().includes(k),
  )
})

// posts 已按日期倒序，顺序分组即为新的年份在前
const groups = computed(() => {
  const map = new Map()
  for (const p of filtered.value) {
    const year = p.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(p)
  }
  return [...map.entries()]
})

const catCount = computed(() => new Set(posts.value.map((p) => p.category)).size)
const tagCount = computed(() => new Set(posts.value.flatMap((p) => p.tags)).size)
</script>

<template>
  <div class="home">
    <section class="hero" :class="{ 'has-photo': bing }">
      <div v-if="bing" class="hero-photo" :style="{ backgroundImage: `url(${bing.url})` }"></div>
      <div class="hero-overlay"></div>

      <div class="container hero-content">
        <p class="hero-latin">{{ siteConfig.latinName.toUpperCase() }}</p>
        <h1 class="hero-title">{{ siteConfig.name }}</h1>
        <p class="hero-motto">{{ siteConfig.motto }}</p>
        <p v-if="!loading" class="hero-stats">
          {{ posts.length }} 篇文章 · {{ catCount }} 个分类 · {{ tagCount }} 个标签
        </p>
        <p v-if="bing?.copyright" class="hero-credit">必应每日一图 · {{ bing.copyright }}</p>
      </div>

      <span class="hero-scroll" aria-hidden="true"></span>
    </section>

    <section class="container posts-section">
      <div class="search-box">
        <input ref="searchInput" v-model="keyword" type="search" placeholder="搜索文章…" />
        <span class="kbd">Ctrl K</span>
      </div>

      <div v-if="loading" class="state-hint">正在加载文章…</div>
      <template v-else>
        <div v-for="[year, list] in groups" :key="year" class="year-group">
          <div class="year-head">
            <span class="year-name">{{ year }}</span>
            <span class="year-count">{{ list.length }} 篇</span>
          </div>
          <div class="post-list">
            <PostItem v-for="post in list" :key="post.slug" :post="post" />
          </div>
        </div>
        <div v-if="!filtered.length" class="state-hint">没有找到匹配的文章，换个关键词试试？</div>
      </template>
    </section>
  </div>
</template>

<style scoped>
/* ---- 整屏寒夜首图 ---- */
.hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  height: calc(100vh - 58px);
  min-height: 540px;
  overflow: hidden;
  /* 无图时的寒夜底色 */
  background: linear-gradient(165deg, #0e141c 0%, #182230 52%, #29394a 100%);
}

.hero-photo {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  /* 高度去饱和：任何彩色风景都归入冷峻的黑白灰调 */
  filter: grayscale(0.85) contrast(1.05) brightness(0.9);
  opacity: 0;
  transition: opacity 1.4s ease;
}

.hero.has-photo .hero-photo {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 15, 22, 0.42) 0%,
    rgba(10, 15, 22, 0.18) 46%,
    rgba(10, 15, 22, 0.82) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding-bottom: 92px;
  color: #fff;
}

.hero-latin {
  margin: 0 0 12px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.58em;
  color: rgba(255, 255, 255, 0.5);
}

.hero-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(2.6rem, 6vw, 3.6rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.2;
}

.hero-motto {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 18px 0 0;
  font-size: 1.02rem;
  letter-spacing: 0.34em;
  color: rgba(255, 255, 255, 0.74);
}

.hero-motto::before {
  content: '';
  flex: none;
  width: 30px;
  height: 1px;
  background: rgba(255, 255, 255, 0.45);
}

.hero-stats {
  margin: 20px 0 0;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
}

.hero-credit {
  margin: 6px 0 0;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.32);
  max-width: 72%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 26px;
  width: 1px;
  height: 52px;
  background: linear-gradient(rgba(255, 255, 255, 0.65), transparent);
  transform-origin: top;
  animation: hero-scroll 2.4s ease-in-out infinite;
}

@keyframes hero-scroll {
  0%,
  100% {
    transform: scaleY(0.15);
    opacity: 0.4;
  }

  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* ---- 文章列表 ---- */
.posts-section {
  margin-top: 46px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 2px 10px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--accent);
}

.search-box input {
  border: none;
  outline: none;
  background: none;
  width: 100%;
  font: inherit;
  color: var(--text);
}

.search-box input::placeholder {
  color: var(--text-3);
}

.search-box:focus-within .kbd {
  display: none;
}
</style>
