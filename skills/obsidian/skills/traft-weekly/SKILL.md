---
name: traft-weekly
description: 周报/周记管理技能。每周把开发、论文、技术三流进展与下周计划记在一篇周报里,并沉淀可复用内容。何时激活:"帮我写本周周报","更新周报进度","新增周报任务","本周做了什么/下周计划","整理本周沉淀"。
---

# traft-weekly

周报(type `周记`)是每周的**多流并记**:把一周的**开发(projects)**、**论文(papers)**、**技术(tech)** 三条线记在同一篇,并沉淀可复用内容、列出下周计划。

- 一张周报 = 一篇 md 文档,必须有 frontmatter。
- 周报状态用 Obsidian Tasks 扩展符号,**不用 emoji 作主状态**;状态/进度速查见 `templates/tasks-status-cheatsheet.md`(仅允许 6 个符号:`[ ]` / `[x]` / `[/]` / `[-]` / `[>]` / `[<]`)。
- 模板(单源):`templates/weekly.md`(本技能内),建周报时复制。

# RULES

## ALWAYS DO
- 写周报前,向用户确认本周跨度(如 `2026-W35`),并从 `projects/`、`papers/`、`tech/` 及关联文档核对实际进展,**不凭记忆**。
- 标题用 `周记 <YYYY>-W<ww>`(ISO 周);frontmatter 含 `type: 周记`、`date`。
- 三流分开记,不混写:开发 / 论文 / 技术各一段。
- 「沉淀」落可复用文档/技能:凡能提炼进 skill 仓库的,标注并落盘。
- 涉及周报文档的增删改查,遵循 traft-obsidian 文档规范(frontmatter + 双链)。
- emoji 只作标题/章节/行内视觉标注,**不进标签**;用 `ob-emoji` 工具查询。
- 状态用允许的 6 个符号:待办 `[ ]`、完成 `[x]`、进行中 `[/]`、搁置/取消 `[-]`、转发下周 `[>]`、排期 `[<]`;进行中/搁置不用 🔄/⏸️ emoji 行内标注。

## NEVER DO
- 不编造本周进展:没做完写 `[ ]`,做完写 `[x]`。
- 不复述无关项目细节;周报聚焦本周回顾与下周计划。
- 不用 emoji 代替 checkbox 主状态。

# 周报结构

不展开模板与字段细节,需要使用时直接阅读对应文件:

| 内容 | 位置 |
|------|------|
| 周报正文模板(三流并记结构) | `templates/weekly.md` |
| frontmatter 字段 | `templates/weekly.md` 头部 |
| 字段 emoji(优先级/类型/状态/章节) | `ob-emoji` 工具(section=weekly) |
| 状态符号与约定(6 个) | `templates/tasks-status-cheatsheet.md` |
