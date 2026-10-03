---
title: "Vue 3 组合式 API 实践：从选项式到组合式的迁移心得"
excerpt: "把一个两年老项目从选项式 API 逐步迁移到组合式 API 的过程记录，聊聊组合式 API 在逻辑复用、类型推导上的优势，以及迁移路上踩过的坑。"
date: 2026-09-18
category: "前端开发"
tags: ["Vue", "JavaScript"]
cover: 0
---

## 为什么要迁移

项目规模变大之后，选项式 API 的痛点越来越明显：一个功能的相关代码被迫分散在 `data`、`methods`、`computed` 等各个选项里，读代码时上下文来回跳转。

组合式 API 允许我们按「逻辑关注点」组织代码，一个功能的响应式状态、副作用和计算属性可以放在一起。

## 基本写法对比

先看选项式的典型写法：

```vue
<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  }
}
</script>
```

使用组合式 API 后：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>
```

## 逻辑复用：Composables

组合式 API 最大的价值在于逻辑复用。比如把「鼠标位置追踪」抽成一个函数：

```js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  const update = (e) => { x.value = e.pageX; y.value = e.pageY }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return { x, y }
}
```

任何组件引入 `useMouse()` 即可获得响应式的鼠标坐标，不需要 mixin，也不需要担心命名冲突。

## 迁移建议

1. **不要一次性重写**。新功能用组合式 API，旧代码按模块逐步迁移。
2. **优先抽离无 UI 依赖的逻辑**，如数据获取、表单校验、定时器管理。
3. **保持 composable 单一职责**，一个函数只做一件事，复杂组合放在更上层。

> 迁移不是目的，可维护性才是。如果项目很小、逻辑简单，选项式 API 也完全没问题。
