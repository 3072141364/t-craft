---
title: 标签速查表
card_type: 规范
date: 2026-08-05
summary: vault 标签约定(扁平无前缀)。小写+连字符,不加 项目/、类型/、状态/ 等层级前缀。emoji 不进标签本身,只作标题/章节/本表视觉对照。写笔记时 card_type 图标 emoji 向 obsidian-kb 附属文档 emoji-helper 查询,本表为常用对照。
tags: [通用, 规范, 定稿]
---

# 🏷️ 标签速查表

> vault 标签约定。**扁平无前缀**:小写+连字符,直接写 `general_process`、`t-craft`,不加 `项目/`、`类型/`、`状态/` 等层级前缀。**emoji 不进标签本身**(Obsidian 标签不含 emoji),只作标题/章节/本表的视觉对照。写笔记时 card_type 图标 emoji 向 **obsidian-kb 附属文档 emoji-helper** 查询,本表为常用对照。

## 项目标签(扁平)

| 标签 | emoji | 含义 | 何时用 |
|------|------|------|--------|
| `<项目名>`(如 `general_process`) | 📁 | 归属项目 | 卡片/方案属某项目时打 |

## 类型标签(扁平,对应 card_type)

| 标签 | emoji | card_type | 何时用 |
|------|------|-----------|--------|
| `方案` | 📋 | 方案 | 设计方案(开发新功能/修复 bug) |
| `技术` | 🔧 | 技术 | 技术知识/实践沉淀 |
| `流程` | 📝 | 流程 | 规范操作记录(可照着执行) |
| `术语` | 📖 | 术语 | 通用概念定义 |
| `wiki` | 📚 | wiki | 知识词条(科普性解释) |
| `周记` | 📅 | 周记 | 周报 |

## 状态标签(扁平)

| 标签 | emoji | 含义 |
|------|------|------|
| `草稿` | ✍️ | 起草中 |
| `进行中` | 🚧 | 进行中 / WIP |
| `定稿` | ✅ | 定稿 / 已锁 |
| `归档` | 🗄️ | 归档 |

## 主题标签(示例,按需扩展)

标签按主题归类(`ai`、`tools`、`standards`、`env`、`tech` 等),扁平无前缀。

## 用法

- 优先 frontmatter `tags:` 列表,正文确有需要再 inline `#tag`。
- 一卡 2-5 个,不滥用,关联性强才打。
- **新标签先加到此表再用**,避免同义分裂(`#bug` vs `#缺陷`)。
- emoji 选择以 obsidian-kb 附属文档 emoji-helper 查询为准,本表为常用对照。

## 关联

- [[emoji-cheatsheet]] — card_type 图标、周报字段 emoji 对照
- [[tasks-status-cheatsheet]] — checkbox 扩展符号对照
