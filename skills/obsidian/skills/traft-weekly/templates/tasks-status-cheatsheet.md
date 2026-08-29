---
title: Tasks 状态速查表
type: 规范
date: 2026-08-05
summary: Obsidian Tasks + Minimal 主题的 checkbox 扩展符号对照。周报/正式笔记仅允许默认状态 + 计划类共 6 个符号,不得用 [w]/[!]/[*] 等其余符号。搁置用 [-] 进行中用 [/],不再用 ⏸️/🔄 emoji 行内标注。
tags: [通用, 规范, 定稿]
---

# ✅ Tasks 状态速查表

> Obsidian Tasks 插件 + Minimal 主题的 checkbox 扩展符号。
> **周报及正式笔记仅允许以下 6 个符号**,不得使用 `[w]`/`[!]`/`[*]`/`[?]` 等标记/信息/评价类符号。

## 允许使用(默认状态 + 计划类)

| 符号 | 语义 | 类型 | 用途 |
|------|------|------|------|
| `[ ]` | 待办 | TODO | 未开始 |
| `[x]` | 完成 | DONE | 已完成 |
| `[/]` | 进行中 | IN_PROGRESS | 正在推进 |
| `[-]` | 取消 | CANCELLED | 搁置/取消(含缺依赖停摆) |
| `[>]` | 转发 | forwarded | 转到下周/下阶段 |
| `[<]` | 排期 | scheduling | 定稿排期、待到时 |

### 使用约定

- **checkbox 即状态**:符号本身表达进度,正文不重复写"已完成/未开始"
- **搁置用 `[-]`**:不用 ⏸️ emoji 行内标注;缺依赖停摆一律 `[-]`
- **进行中用 `[/]`**:不用 🔄 emoji 行内标注
- **子项继承父项**:对接人/文档默认继承父项,仅不同时才写;子项用 tab 缩进表从属

### 周报 todo 项格式

```
- [checkbox] 优先级 类型 | 内容 | 👤对接人 ⏰时间 | 🔗 [[文档]]
```

详见 [[weekly]] 模板图例。

## 参考对照(其余符号,仅本表展示,不得用于正式笔记)

### 标记类

- `[?]` 疑问 question
- `[!]` 重要 important
- `[*]` 星标 star
- `["]` 引用 quote

### 信息类

- `[l]` 位置 location
- `[b]` 书签 bookmark
- `[i]` 信息 information
- `[I]` 想法 idea

### 评价类

- `[S]` 储蓄 savings
- `[p]` 优点 pros
- `[c]` 缺点 cons
- `[f]` 火 fire
- `[k]` 关键 key
- `[w]` 胜 win
- `[u]` 上升 up
- `[d]` 下降 down

## 关联

- [[emoji-cheatsheet]] — type 图标、周报字段 emoji
- [[tags-cheatsheet]] — 标签(扁平无前缀)对照
- [[weekly]] — 周报模板与 todo 项格式
