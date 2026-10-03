<script setup>
import { onMounted, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import { fetchCategories } from '../api'

const categories = ref([])
const loading = ref(true)

onMounted(async () => {
  categories.value = await fetchCategories()
  loading.value = false
})
</script>

<template>
  <div class="container">
    <div class="page-head">
      <h1>分类</h1>
      <p class="page-sub">按话题浏览文章</p>
    </div>

    <div v-if="loading" class="state-hint">正在加载…</div>
    <div v-else class="row-list">
      <router-link
        v-for="cat in categories"
        :key="cat.name"
        class="cat-row"
        :to="`/category/${cat.name}`"
      >
        <AppIcon name="folder" :size="15" class="cat-icon" />
        <span class="cat-name">{{ cat.name }}</span>
        <span class="cat-count">{{ cat.count }} 篇</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.row-list {
  border-top: 1px solid var(--border);
}

.cat-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 4px;
  border-bottom: 1px solid var(--border);
  transition:
    color 0.2s,
    padding-left 0.2s;
}

.cat-row:hover {
  padding-left: 10px;
}

.cat-icon {
  flex: none;
  color: var(--text-3);
  transition: color 0.2s;
}

.cat-row:hover .cat-icon {
  color: var(--accent);
}

.cat-name {
  font-weight: 600;
  transition: color 0.2s;
}

.cat-row:hover .cat-name {
  color: var(--accent-strong);
}

.cat-count {
  margin-left: auto;
  color: var(--text-3);
  font-size: 0.85rem;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
</style>
