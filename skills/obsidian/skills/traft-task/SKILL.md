---
name: traft-task
description: 任务管理技能。用任务 note(schema 已 hook 校验)+ `tasks.components` 多视图(表格/看板/日历/画廊/甘特)管理任务；一个任务=一篇带 `task` tag 的 note，含优先级/负责人/起止/项目。每周评估、每月底归档。何时触发:"建任务","加个任务","更新任务进度","查看进行中的任务","这个任务什么优先级/截止","每周评估","归档任务"。
---

# 任务管理

用 PARA 的 `project/` 下任务 note 管理，靠 `tasks.components` 多视图看进度。**一个任务 = 一篇带 `task` tag 的 note**。

## 任务 note（schema，hook 会校验）
建在 `project/<项目>/<YYYYMMDD-任务名>.md`（命名日期前缀），frontmatter：
- `type: 任务`
- `status`：待规划 / 进行中 / 草稿 / 完成
- `priority`：P0(高) / P1(中) / P2(低)
- `owner`：负责人
- `project`：项目归属
- `start` / `doneTime`：开始 / 结束时间（ISO，`YYYY-MM-DDT00:00:00`）
- `tags` 含 `task`
- 通用必填（title/created/updated/confidence/tags/summary 等）

模板：`skill://traft-task/../templates/task.md`（或插件 `templates/task.md`）。

## 任务视图（`tasks.components`）
- 视图在 **`archive/component/`**：`tasks.components`（不在 vault 根），含 表格 / 看板(按 priority) / 日历(start) / 画廊 / 甘特(start→doneTime)。
- 只在 vault 有 `tasks.components` 时可见；换电脑把插件 `templates/tasks.components` 拷到 `archive/component/`。
- 过滤规则：`tags 含 "task"`（进甘特/看板的任务须 tag=task + 有 start/doneTime + project）。

## 生命周期
1. **建任务**：复制 `task.md` 模板到 `project/<项目>/<YYYYMMDD-任务名>.md`，填 schema。
2. **更新**：改 `status`/`priority`/`start`/`doneTime`/子任务；hook 校验，`ob-query` 可按状态/优先级/负责人查。
3. **每周评估**：用 `tasks.components` 看本周完成/进行中/卡住，落一句到周记（`archive/weekly/`）。
4. **每月底归档**：把本月完成任务的 `archive` 相关 + 周记移到 `archive/weekly/<YYYY-MM>/`，`archived: true`。

## 查询
- `ob-query` 检索任务（带 priority/status/project 元数据）。
- `/traft-task 查 进行中` 快速筛。

## 边界
- 任务 note 属于 `project/`；领域知识属 `area/`；临时事用 todo（不进任务视图）。
- 任务↔领域用双链关联，无父子字段。
