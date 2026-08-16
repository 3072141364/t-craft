---
description: 建本周周报 / 周记。列本周开发/论文/技术三流任务与进展、问题阻塞、沉淀、下周计划;工作清单在周报内维护。触发 obsidian-kb 模块四。
argument-hint: [<ISO周次: 可空,默认本周>]
---

触发 **obsidian-kb** 模块四(周报)。

## 执行

1. **读规则**:obsidian-kb 附属文档 `references/weekly.md`(章节结构、todo 格式、状态符号)。
2. **建卡**:复制模板 `obsidian-kb/assets/templates/weekly.md` → `weekly/周记 <YYYY>-W<ww>.md`(周次用 ISO week,`date.isocalendar()` 可得),列三流计划(开发/论文/技术)。
3. **本周中**:每完成一件事,先更新对应需求 progress.md 状态,再在周报加 todo 项 + 沉淀指针——**周报只链 progress,不重复记状态**。
4. **下周初**:未完成项移入下周计划;本周归档。

## 约定

- 工作清单(正在做/待办/本周完成)在周报「本周事项」内维护,不另建文件。
- 写周报前展示草稿给用户确认。
