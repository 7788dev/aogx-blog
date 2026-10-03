---
title: "手写一个 Vite 插件：从最小可用到自动注入版本号"
excerpt: "Vite 插件本质上就是一个带钩子的对象，比想象中简单得多。从十几行的最小插件开始，理解 transformIndexHtml、configResolved 等常用钩子。"
date: 2026-01-10
category: "前端开发"
tags: ["Vite", "工程化"]
cover: 4
---

Vite 插件本质上就是一个带钩子的对象，比想象中简单得多。

## 最小可用插件

```js
// vite-plugin-logo.js
export default function vitePluginLogo() {
  return {
    name: 'vite-plugin-logo',
    transformIndexHtml(html) {
      return html.replace('</body>', '<!-- powered by my plugin --></body>')
    },
  }
}
```

在 `vite.config.js` 里注册即可：

```js
import { defineConfig } from 'vite'
import vitePluginLogo from './vite-plugin-logo.js'

export default defineConfig({
  plugins: [vitePluginLogo()],
})
```

## 常用钩子

- `configResolved`：读取最终配置，常用来拿环境信息
- `transform(code, id)`：转换模块代码，配合正则可以定制编译产物
- `transformIndexHtml`：注入脚本或标签
- `configureServer`：往 dev server 加自定义中间件

## 一个实用例子：自动注入版本号

```js
export default function versionPlugin() {
  let version = ''
  return {
    name: 'vite-plugin-version',
    configResolved(config) {
      version = config.env.MODE
    },
    transformIndexHtml() {
      return [{ tag: 'meta', attrs: { name: 'app-version', content: version } }]
    },
  }
}
```

写插件的过程也是理解构建工具的过程。下次遇到「构建时做点小改动」的需求，先想想能不能用一个十几行的插件解决。
