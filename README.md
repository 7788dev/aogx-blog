# 傲骨心（Aogx）—— 个人博客前端

基于 **Vue 3 + Vite + Vue Router** 构建的博客前端，内置 Mock 数据可独立运行。
> 注：正在评估迁移到静态站点生成器（Astro / Hugo），详见仓库讨论。

## 功能

- **首页**：整屏「寒夜首图」——必应每日一图作背景（自动去饱和冷色处理，多级降级保证可用），站名与座右铭压图排版；下方为按年份分组的极简文章列表 + 搜索（`Ctrl/⌘ + K` 快捷聚焦）
- **文章详情**：Markdown 渲染、宽屏右侧目录（TOC，滚动高亮）、上一篇/下一篇导航、阅读时长与字数估算（meta 均带图标）
- **归档**：按年份分组的全部文章
- **分类 / 标签**：独立的分类列表页与标签云页，可跳转到对应筛选列表
- **深色模式**：跟随系统 + 手动切换，本地持久化，刷新不闪烁（深色为 GitHub Dark 风格）
- **其他**：专业 Logo 与全套 Lucide 线性图标（首页刻意保持无图标）、页面过渡动画、悬停微交互、响应式布局、404 页面

## 快速开始

```bash
npm install
npm run dev       # 开发调试，默认 http://localhost:5173
npm run build     # 生产构建，输出到 dist/
npm run preview   # 本地预览构建产物
```

## 目录结构

```
├── index.html                 # 入口 HTML（含防闪烁主题脚本）
├── vite.config.js
├── public/
│   └── favicon.svg            # 站点 Logo（寒夜墨色 + 白色孤星）
└── src/
    ├── main.js                # 应用入口
    ├── App.vue                # 根组件：头部 / 路由出口 / 页脚
    ├── config.js              # 站点信息（名称、座右铭、作者等）
    ├── assets/
    │   └── main.css           # 设计变量、深色模式、Markdown 正文样式
    ├── api/
    │   ├── index.js           # 数据层（当前为 Mock，可替换为 HTTP 请求）
    │   ├── mock.js            # 本地 Mock 数据源
    │   └── bing.js            # 必应每日一图（多级降级 + 当日缓存）
    ├── data/
    │   └── posts.js           # 示例文章数据
    ├── composables/
    │   └── useTheme.js        # 深浅色主题切换
    ├── utils/
    │   ├── format.js          # 日期、阅读时长等格式化工具
    │   └── markdown.js        # Markdown 渲染 + 目录（TOC）提取
    ├── router/
    │   └── index.js           # 路由（含 404 兜底与滚动行为）
    ├── components/
    │   ├── SiteHeader.vue     # 顶部导航 + 主题切换
    │   ├── SiteFooter.vue
    │   ├── LogoMark.vue       # 站点 Logo（与 favicon 同源）
    │   ├── AppIcon.vue        # 全站统一图标库（Lucide 规范）
    │   └── PostItem.vue       # 文章列表行
    └── views/
        ├── HomeView.vue       # 首页
        ├── PostView.vue       # 文章详情
        ├── ArchiveView.vue    # 归档
        ├── CategoriesView.vue # 分类
        ├── TagsView.vue       # 标签云
        ├── FilteredView.vue   # 分类 / 标签筛选列表（复用）
        ├── AboutView.vue
        └── NotFoundView.vue
```

## 常见自定义

| 想改什么             | 去哪里改                        |
| -------------------- | ------------------------------- |
| 站点名称、座右铭、作者 | `src/config.js`                 |
| 文章内容             | `src/data/posts.js`             |
| 主题色、字体、圆角   | `src/assets/main.css` 顶部变量  |
| 导航链接             | `src/components/SiteHeader.vue` |
| 必应背景图强制指定   | `src/api/bing.js` 的注释说明    |

## 部署提示

构建产物为纯静态文件（`dist/`），可部署到任意静态托管（Nginx、Vercel、Netlify、GitHub Pages 等）。项目使用 History 路由，服务器需配置 SPA 回退：所有未匹配路径返回 `index.html`。
