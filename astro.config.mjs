// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // 部署后改成真实域名（影响 canonical、RSS 等）
  site: 'https://aogx-blog.example.com',
  server: {
    port: 5173,
  },
})
