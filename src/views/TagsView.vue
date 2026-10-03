<script setup>
import { onMounted, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import { fetchTags } from '../api'

const tags = ref([])
const loading = ref(true)

onMounted(async () => {
  tags.value = await fetchTags()
  loading.value = false
})

// 标签字号随文章数轻微缩放，封顶 1.2rem
function tagSize(count) {
  return `${Math.min(1.2, 0.9 + (count - 1) * 0.08)}rem`
}
</script>

<template>
  <div class="container">
    <div class="page-head">
      <h1>标签</h1>
      <p v-if="!loading" class="page-sub">共 {{ tags.length }} 个标签，按话题找到同类文章</p>
    </div>

    <div v-if="loading" class="state-hint">正在加载…</div>
    <div v-else class="tag-cloud">
      <router-link
        v-for="tag in tags"
        :key="tag.name"
        class="tag-item"
        :to="`/tag/${tag.name}`"
        :style="{ fontSize: tagSize(tag.count) }"
      >
        <AppIcon name="hash" :size="13" class="tag-icon" />
        {{ tag.name }}
        <sup>{{ tag.count }}</sup>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
  color: var(--text-2);
  font-weight: 500;
  transition:
    color 0.2s,
    border-color 0.2s,
    transform 0.2s;
}

.tag-item:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-1px);
}

.tag-icon {
  flex: none;
  color: var(--text-3);
  transition: color 0.2s;
}

.tag-item:hover .tag-icon {
  color: var(--accent);
}

.tag-item sup {
  color: var(--text-3);
  font-size: 0.68em;
  font-weight: 400;
  font-family: var(--font-mono);
}
</style>
