---
title: "设计一套优雅的 RESTful API：从资源到响应结构"
excerpt: "URL 用名词复数、动作交给 HTTP 方法、状态码要诚实——把这些原则内化成团队的肌肉记忆，接口文档就省了一半。"
date: 2026-06-25
category: "后端"
tags: ["API", "架构"]
cover: 3
---

## 从资源出发

RESTful 的核心是把一切抽象为**资源**：用 URL 表示资源，用 HTTP 方法表达对资源的操作。

| 操作     | 方法   | 示例            |
| -------- | ------ | --------------- |
| 查询列表 | GET    | `/articles`     |
| 查询单个 | GET    | `/articles/42`  |
| 创建     | POST   | `/articles`     |
| 全量更新 | PUT    | `/articles/42`  |
| 局部更新 | PATCH  | `/articles/42`  |
| 删除     | DELETE | `/articles/42`  |

## 几条实战原则

1. **URL 用名词复数**，动作交给 HTTP 方法：用 `DELETE /articles/42` 而不是 `/deleteArticle?id=42`。
2. **层级表达从属关系**，但不要超过两层：`/users/42/articles` 可以，再深就该用查询参数了。
3. **过滤、分页、排序放查询参数**：`/articles?page=2&size=10&sort=-created_at`。
4. **状态码要诚实**：参数错误回 400，未登录回 401，没权限回 403，资源不存在回 404，不要一律 200。

## 统一响应结构

业务层建议返回统一信封，方便前端统一处理：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [],
    "total": 0,
    "page": 1,
    "size": 10
  }
}
```

> 规范的价值不在于「标准」本身，而在于团队成员不需要猜测就能写对接口。
