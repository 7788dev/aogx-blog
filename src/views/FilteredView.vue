<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PostItem from '../components/PostItem.vue'
import { fetchPosts } from '../api'

const route = useRoute()
const posts = ref([])
const loading = ref(true)

const isCategory = computed(() => route.name === 'category')
const filterName = computed(() => String(route.params.name))

async function load() {
  loading.value = true
  posts.value = await fetchPosts()
  loading.value = false
}

watch(() => route.fullPath, load, { immediate: true })

const matched = computed(() =>
  posts.value.filter((p) =>
    isCategory.value ? p.category === filterName.value : p.tags.includes(filterName.value),
  ),
)
</script>

<template>
  <div class="container">
    <div class="page-head">
      <p class="crumb">
        <router-link to="/">首页</router-link>
        <span> / </span>
        <span>{{ isCategory ? '分类' : '标签' }}</span>
      </p>
      <h1>
        {{ isCategory ? '分类' : '标签' }}：<span class="highlight">{{ filterName }}</span>
      </h1>
      <p v-if="!loading" class="page-sub">共 {{ matched.length }} 篇文章</p>
    </div>

    <div v-if="loading" class="state-hint">正在加载…</div>
    <template v-else>
      <div v-if="matched.length" class="post-list">
        <PostItem v-for="post in matched" :key="post.slug" :post="post" />
      </div>
      <div v-else class="state-hint">这里还没有文章。</div>
    </template>
  </div>
</template>

<style scoped>
.crumb {
  color: var(--text-3);
  font-size: 0.84rem;
  margin: 0 0 6px;
}

.crumb a:hover {
  color: var(--accent);
}

.highlight {
  color: var(--accent-strong);
}
</style>
