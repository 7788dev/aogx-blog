# 傲骨心（Aogx）—— 个人博客

基于 **Astro** 的静态博客：Markdown 写作，构建产物为纯静态页面，可免费托管到 GitHub Pages / Vercel / Netlify / Cloudflare Pages。

## 功能

- **Markdown 写作**：`src/content/blog/` 下每个 `.md` 文件就是一篇文章（frontmatter：标题/日期/分类/标签/封面）
- **首页**：整屏「寒夜首图」——必应每日一图作背景（自动去饱和冷色处理，多级降级保证可用），站名与座右铭压图排版；下方为按年份分组的极简文章列表 + 搜索（`Ctrl/⌘ + K` 快捷聚焦）
- **文章详情**：Markdown 渲染、宽屏右侧目录（TOC，滚动高亮，Astro 自动生成）、上一篇/下一篇导航、阅读时长与字数估算
- **归档 / 分类 / 标签**：年份时间线、分类列表、标签云，及对应的筛选页
- **深色模式**：跟随系统 + 手动切换，本地持久化，刷新不闪烁（深色为 GitHub Dark 风格）
- **其他**：寒夜墨色 Logo（与 favicon 同源）、Lucide 线性图标、微点阵背景、响应式布局、404 页面

## 快速开始

```bash
npm install
npm run dev       # 开发调试，默认 http://localhost:5173
npm run build     # 生产构建，输出到 dist/
npm run preview   # 本地预览构建产物
```

## 写一篇文章

在 `src/content/blog/` 新建 `my-post.md`：

```markdown
---
title: 文章标题
excerpt: 一句话摘要
date: 2026-10-04
category: 前端开发
tags: [Vue, 随笔]
cover: 0
---

正文使用 Markdown 语法……
```

保存即完成，`npm run dev` 里即时可见；推送后由托管平台自动构建发布。

## 目录结构

```
├── astro.config.mjs           # Astro 配置（站点域名、端口）
├── public/
│   └── favicon.svg            # 站点 Logo（寒夜墨色 + 白色孤星）
├── scripts/                   # 一次性维护脚本（如内容转换）
└── src/
    ├── content.config.ts      # 内容集合定义与 frontmatter 校验
    ├── content/blog/          # ★ 文章（Markdown）
    ├── layouts/
    │   └── BaseLayout.astro   # 全站骨架（head、主题防闪烁脚本、导航页脚）
    ├── components/
    │   ├── SiteHeader.astro   # 顶部导航 + 主题切换
    │   ├── SiteFooter.astro
    │   ├── LogoMark.astro     # 站点 Logo
    │   ├── AppIcon.astro      # 统一图标库（Lucide 规范）
    │   └── PostItem.astro     # 文章列表行
    ├── pages/                 # 路由 = 文件结构
    │   ├── index.astro        # 首页（寒夜首图 + 列表 + 搜索）
    │   ├── posts/[slug].astro # 文章详情（TOC / 上下篇）
    │   ├── archive.astro      # 归档
    │   ├── categories.astro   # 分类
    │   ├── category/[name].astro
    │   ├── tags.astro         # 标签云
    │   ├── tag/[name].astro
    │   ├── about.astro
    │   └── 404.astro
    ├── scripts/
    │   └── bing.js            # 必应每日一图（多级降级 + 当日缓存）
    ├── styles/
    │   └── main.css           # 设计变量、深色模式、Markdown 正文样式
    ├── utils/
    │   └── format.js          # 日期、阅读时长等工具
    └── config.js              # 站点信息（名称、座右铭、作者、社交链接）
```

## 常见自定义

| 想改什么               | 去哪里改                            |
| ---------------------- | ----------------------------------- |
| 站点名称、座右铭、作者 | `src/config.js`                     |
| 文章                   | `src/content/blog/*.md`             |
| 主题色、字体、圆角     | `src/styles/main.css` 顶部变量      |
| 导航链接               | `src/components/SiteHeader.astro`   |
| 必应背景图强制指定     | `src/scripts/bing.js` 的注释说明    |
| 站点域名               | `astro.config.mjs` 的 `site` 字段   |

## 部署

构建产物为纯静态文件（`dist/`），推荐直接连接 GitHub 仓库到 **Vercel / Netlify / Cloudflare Pages**（零配置自动识别 Astro），或用 GitHub Actions 发布到 **GitHub Pages**。服务器自建则用任意静态服务器托管 `dist/` 即可。
