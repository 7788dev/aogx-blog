<script setup>
import { computed, onMounted, ref } from 'vue'
import PostItem from '../components/PostItem.vue'
import { fetchPosts } from '../api'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  posts.value = await fetchPosts()
  loading.value = false
})

// posts 已按日期倒序，顺序分组即为新的年份在前
const groups = computed(() => {
  const map = new Map()
  for (const p of posts.value) {
    const year = p.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(p)
  }
  return [...map.entries()]
})
</script>

<template>
  <div class="container">
    <div class="page-head">
      <h1>归档</h1>
      <p v-if="!loading" class="page-sub">共 {{ posts.length }} 篇文章，路虽远，行则将至。</p>
    </div>

    <div v-if="loading" class="state-hint">正在加载…</div>
    <div v-for="[year, list] in groups" v-else :key="year" class="year-group">
      <div class="year-head">
        <span class="year-name">{{ year }}</span>
        <span class="year-count">{{ list.length }} 篇</span>
      </div>
      <div class="post-list">
        <PostItem v-for="post in list" :key="post.slug" :post="post" />
      </div>
    </div>
  </div>
</template>
