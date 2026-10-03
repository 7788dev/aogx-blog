<script setup>
defineProps({
  post: { type: Object, required: true },
})
</script>

<template>
  <router-link :to="`/post/${post.slug}`" class="post-row">
    <span class="row-title">{{ post.title }}</span>
    <span class="row-date">{{ post.date.slice(5) }}</span>
  </router-link>
</template>
