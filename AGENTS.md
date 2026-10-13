# Repository Guidelines

## 项目结构

- `src/pages/`：路由页面（首页、归档、分类/标签及筛选页、关于、404、`rss.xml`、文章详情 `posts/[slug].astro`）
- `src/components/`：SiteHeader / SiteFooter / PostItem / AppIcon / Giscus / LogoMark
- `src/layouts/BaseLayout.astro`：全站 HTML 骨架、深色模式防闪烁脚本
- `src/styles/main.css`：全站样式唯一入口（设计变量在 `:root` 与 `[data-theme='dark']`）；组件局部样式写在各 `.astro` 的 `<style>` 块
- `src/content/blog/*.md`：文章内容；frontmatter 由 `src/content.config.ts` 校验（title / excerpt / date / category / tags / cover）
- `src/config.js`：站点名称、口号、社交链接、头像等全局配置
- `src/utils/`：`links.js` 的 `withBase()`、`format.js` 的日期与字数工具
- `public/images/`：每日背景图与头像，由 `daily-bg.yml` 定时任务自动烘焙，勿手改

## 常用命令

```bash
npm install
npm run dev       # 本地开发，默认 http://localhost:5173
npm run build     # 生产构建，输出 dist/
npm run preview   # 预览构建产物
```

## 构建与部署

站点部署在 GitHub Pages 子路径下（`astro.config.mjs` 中 base 为 `/aogx-blog`）：仓库内一律用 `withBase()` 拼接站内链接，禁止硬编码 `/` 开头路径。推送 main 后 `deploy.yml` 自动构建发布；`daily-bg.yml` 每日更新背景图与头像。

## 代码风格

- 2 空格缩进、单引号、行尾不加分号，ES Module
- 工具模块与脚本用 camelCase 文件名，Astro 组件用 PascalCase，CSS 类用 kebab-case
- 注释用中文，只在必要处写

## 提交规范

沿用 Conventional Commits：`feat:` / `fix:` / `chore:` / `perf:` 前缀 + 中文摘要，如 `fix: 补回 giscus 挂载容器常量`。

## 测试与验证

项目暂无测试框架与 lint 配置。改动底线是 `npm run build` 通过；页面与样式改动需在 `npm run dev` 下人工核验浅色/深色主题与移动/桌面宽度下的表现。

## Agent-Specific Instructions

为持久决策记录原因与备选方案，尽量随相关代码提交。完成 Git 提交后按 [记忆维护指南](.agents/notes/README.md) 自查，命中才写，未命中静默继续；遗漏补到工作区，不自动改写提交历史。后续会话先读本文件，再按需增量维护对应章节。
