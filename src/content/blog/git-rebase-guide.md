---
title: "Git Rebase 使用指南：让提交历史干净起来"
excerpt: "rebase 和 merge 解决的是同一个问题——整合分支——但方式完全不同。搞清楚三个最常用的场景和一条黄金法则，就能放心用起来。"
date: 2026-05-20
category: "工具效率"
tags: ["Git"]
cover: 4
---

## rebase 是什么

`git rebase` 直译是「变基」：把一串提交摘下来，接到另一个基点上重放。它和 `merge` 解决的是同一个问题——整合两条分支——但方式完全不同：

- **merge**：把两条分支的历史合并在一起，产生一个合并提交，历史是「真实发生过的」
- **rebase**：把提交重放一遍，历史是线性的、干净的

## 最常用的三个场景

**1. 同步主干，保持线性历史**

```bash
git checkout feature/login
git fetch origin
git rebase origin/main
```

**2. 交互式变基，整理提交**

```bash
git rebase -i HEAD~5
```

常用指令：

- `pick`：保留该提交
- `squash`：与上一个提交合并
- `reword`：修改提交信息
- `drop`：丢弃该提交

**3. 摘取提交换基**：想把 feature-a 里的提交挪到 feature-b 上时，`git rebase --onto feature-b feature-a` 可以精确控制重放范围。

## 黄金法则

> **不要对已经推送到公共分支的提交做 rebase。**

rebase 会改写提交历史。如果你 rebase 了别人正在基于其工作的分支，协作者的本地历史会和远端冲突，整个团队都要花时间收拾残局。

万一真的 rebase 了公共分支，可以用 `git reflog` 找到变基前的 HEAD，然后 `git reset --hard` 回去。
