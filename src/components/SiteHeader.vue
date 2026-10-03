<script setup>
import { siteConfig } from '../config'
import { useTheme } from '../composables/useTheme'
import AppIcon from './AppIcon.vue'

const { theme, toggleTheme } = useTheme()

const links = [
  { label: '首页', to: '/' },
  { label: '归档', to: '/archive' },
  { label: '分类', to: '/categories' },
  { label: '标签', to: '/tags' },
  { label: '关于', to: '/about' },
]
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <router-link to="/" class="brand">{{ siteConfig.name }}</router-link>

      <nav class="site-nav">
        <router-link v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
          {{ link.label }}
        </router-link>
      </nav>

      <button
        class="icon-btn"
        type="button"
        :title="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
        @click="toggleTheme"
      >
        <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="17" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg);
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 58px;
  padding-top: 0;
}

.brand {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.18rem;
  letter-spacing: 0.02em;
  transition: opacity 0.2s;
}

.brand:hover {
  opacity: 0.8;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
}

.nav-link {
  position: relative;
  padding: 4px 1px;
  color: var(--text-2);
  font-size: 0.93rem;
  transition: color 0.2s;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--grad-a), var(--grad-b));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}

.nav-link:hover {
  color: var(--text);
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  transform: scaleX(1);
}

.nav-link.router-link-exact-active {
  color: var(--text);
  font-weight: 600;
}

@media (max-width: 600px) {
  .header-inner {
    gap: 10px;
  }

  .site-nav {
    gap: 12px;
  }

  .nav-link {
    font-size: 0.88rem;
  }
}
</style>
