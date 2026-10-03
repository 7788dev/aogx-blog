<script setup>
import { siteConfig } from '../config'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <p>© {{ siteConfig.since }}–{{ year }} {{ siteConfig.latinName }}</p>
      <p class="footer-meta">{{ siteConfig.slogan }} · 由 Vue 3 与 Vite 驱动</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 32px 0 40px;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-align: center;
  color: var(--text-3);
  font-size: 0.82rem;
  padding-top: 0;
}

.footer-inner p {
  margin: 0;
}

.footer-meta {
  opacity: 0.85;
}
</style>
