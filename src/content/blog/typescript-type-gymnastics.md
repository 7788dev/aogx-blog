---
title: "TypeScript 类型体操入门：从手写 Pick 开始"
excerpt: "类型体操听起来吓人，其实入门只需要理解几个基础工具类型是怎么实现的。从 keyof、映射类型、infer 三个知识点出发，逐步解锁常用套路。"
date: 2026-03-15
category: "前端开发"
tags: ["TypeScript"]
cover: 1
---

「类型体操」听起来吓人，其实入门只需要理解几个基础工具类型是怎么实现的。

## 从 Pick 开始

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

拆开看就三个知识点：

1. `keyof T`：取出对象类型的所有键，组成联合类型
2. `K extends keyof T`：约束 K 必须是 T 的键的子集
3. `[P in K]`：映射类型，遍历 K 中的每个键

## 常用技巧

**条件类型 + infer 推断**：

```ts
type Unpack<T> = T extends Promise<infer V> ? V : T

type A = Unpack<Promise<string>>  // string
type B = Unpack<number>           // number
```

**never 的过滤效果**（联合类型的分配律）：

```ts
type NonNull<T> = T extends null | undefined ? never : T

type C = NonNull<string | null | number>  // string | number
```

## 什么时候该用

类型体操是工具不是炫技。业务代码里 80% 的场景只需要泛型约束和 `Partial`、`Pick`、`Record` 这些内置工具类型，剩下的 20% 再考虑自定义映射类型。
