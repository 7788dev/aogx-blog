// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 项目站点：仓库 7788dev/aogx-blog，部署后地址为
  // https://7788dev.github.io/aogx-blog/
  site: 'https://7788dev.github.io',
  base: '/aogx-blog',
  server: {
    port: 5173,
  },
})
