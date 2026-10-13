# Agent Notes

这里只放一种文档：记录影响本项目的决策——"为什么"和"放弃了什么"。

## 路径 = 元数据

notes/{lifecycle}/{class}/yyyy-mm-dd-topic.md

- proposed/ 未落地提案；implemented/ 已落地且随代码更新事实；rejected/ 已否决；archived/ 冻结决策正文，允许修复链接和路径元数据。
- class：architecture / process / testing / misc。新增类别需改本文件。
- 日期 = 首次提出日。文件间引用一律相对链接。

## 何时写

只为持久决策理由写；机械性修改豁免；已有 note 拥有该决策就更新它，禁止重复建。

| 发生了什么 | 写什么 | 写到哪（相对本目录） |
|---|---|---|
| 拍板了一个有取舍的技术决策（选库、定架构、定协议、定目录） | 决策 note | implemented/{class}/yyyy-mm-dd-主题.md |
| 大改动动手前需要论证方案 | 提案 note | proposed/{class}/yyyy-mm-dd-主题.md |
| 方案讨论后被否决 | 原提案移入 rejected/，Status 改为 rejected 并附否决理由，修复相对链接 | rejected/{class}/... |
| 同一个坑踩了第二次 / 同类问题被问了第二遍 | 1~3 行祈使句规则 + 理由链接 | 项目根 AGENTS.md |
| 一套流程执行了第二遍（发布、排障、部署、review） | 工作流 skill | skills/{kebab-case-name}/SKILL.md |
| 代码挪了 / 改名 / 改默认值 | 同一提交里更新受影响 note 的事实部分 | 相应 note |
| 某条规则被证明错了 | 写新 note 反转 + 新旧互相链接，旧规则指向新 note | notes/ + AGENTS.md |
| note 只剩历史价值 | 归档或删除，修复所有入链 | archived/ 或删除 |

**不单独成文**（防过度文档化）：未命中上表事件的机械小改、局部 UI 调整、代码本身已自解释的实现细节、凭空预测的计划。

提交前已命中需要落盘的事件，先写记录及必要的指南链接；提交后用实际提交清单核对是否随代码提交；提交后才发现遗漏，补到工作区，不擅自 amend 或新增提交。

## 记录格式

````markdown
# Agent Note: <标题>

Status: implemented

## Problem

<当时的矛盾/约束，写到不看答案也能读懂>

## Decision

<已落地的事实，现在时，链接关键代码路径>

## Alternatives considered

**<方案A>。** <为什么输>
**<方案B>。** <为什么输>

## Consequences

<这个取舍花了什么代价、买到了什么>
````

proposed 版骨架：`Problem / Proposal / Alternatives considered / Acceptance criteria / Risks`。

## 维护

迁移文件时同步 Status 与相对链接；删除前检查入链与 Git 跟踪状态，未提交的唯一记录优先保留或归档。新增项目工作流时在根 AGENTS.md 或本索引提供链接。
