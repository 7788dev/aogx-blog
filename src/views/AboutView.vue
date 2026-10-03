<script setup>
import { siteConfig } from '../config'
import AppIcon from '../components/AppIcon.vue'
import LogoMark from '../components/LogoMark.vue'
</script>

<template>
  <div class="container">
    <div class="about-head">
      <LogoMark :size="72" />
      <h1>关于 {{ siteConfig.name }}</h1>
    </div>

    <div class="about-body">
      <p>你好，我是 {{ siteConfig.author }}，{{ siteConfig.bio }}</p>
      <p>
        站名「{{ siteConfig.name }}」取自「寒风刺骨，傲骨心」——环境越冷，骨头越硬。
        这里的文章大多是前端开发的实践经验，也有一些阅读笔记和生活随想。
      </p>
      <p>
        我相信写作是最好的复盘方式——把一件事讲清楚的过程，就是把它真正学会的过程。
        如果哪篇文章对你有一点帮助，那就再好不过了。
      </p>
    </div>

    <div class="about-links">
      <a class="social-link" :href="siteConfig.github" target="_blank" rel="noopener">
        <AppIcon name="github" :size="15" />
        GitHub
      </a>
      <a class="social-link" :href="`mailto:${siteConfig.email}`">
        <AppIcon name="mail" :size="15" />
        Email
      </a>
    </div>
  </div>
</template>

<style scoped>
.about-head {
  text-align: center;
  padding-top: 16px;
  margin-bottom: 28px;
}

.about-head h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin: 16px 0 0;
}

.about-body {
  color: var(--text-2);
  line-height: 1.95;
}

.about-body p {
  margin: 0 0 14px;
}

.about-links {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
</style>
