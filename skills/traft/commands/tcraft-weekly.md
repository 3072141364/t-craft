---
description: 周报/周记管理。无参数=建本周周报(三流并记);带一句话=按这句话执行,如"更新xxx需求进度"、"新增任务"、"整理本周沉淀"。
argument-hint: [一句话,如"更新xxx需求进度"|<ISO周次>]
---

触发 `traft-weekly` skill。

## 参数
- 无参数:建本周周报(先确认本周跨度,列开发/论文/技术三流进展与下周计划)。
- `<一句话>`:按这句话执行周报相关动作,例如:
  - `更新 xxx 需求进度`:更新需求 xxx 的进度,落到它的 `progress.md`,周报对应条目随之更新;对照实际状态,不编造。
  - `新增任务`:在周报工作清单加任务。
  - `整理本周沉淀`:把本周可复用内容沉淀到技能仓库。
- `<ISO周次>`:指定周,如 `/tcraft-weekly 2026-W34`。

## 执行
读 `skill://traft-weekly`,按其约定走:

1. 建周报:复制 `skill://traft-weekly/templates/weekly.md`,确认本周跨度,三流分开记(开发/论文/技术)。
2. 进度更新:改对应需求的 `progress.md`(走 `traft-project-docs` 的 progress 约定);周报只链 progress,不重复记状态。
3. 状态用 6 个允许符号(`[ ]`/`[x]`/`[/]`/`[-]`/`[>]`/`[<]`);emoji 只作视觉标注,**不进标签**。
4. 落盘遵循 traft-obsidian 卡片规范(frontmatter + 双链)。
