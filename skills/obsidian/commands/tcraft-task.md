---
description: 任务管理。建任务 / 查任务 / 更新进度 / 每周评估。无参数=看当前任务视图用法。
argument-hint: [创建|<任务名> | 查|<查询> | 评估]
---

读 `skill://traft-task`，按任务管理流程走。

- `/traft-task 创建 登录优化`：复制 `templates/task.md` 到 `project/<项目>/<YYYYMMDD-登录优化>.md`，填 schema（type 任务 / priority / owner / project / start / doneTime / tag task）。
- `/traft-task 查 进行中`：`grep "^status: 进行中" /path/to/vault/project --include='*.md'` 按 status/priority/owner 检索任务并汇总。
- `/traft-task 评估`：用 `task-component.components` 看本周，落周记、月底归档。

> 前提：`archive/component/` 有 `task-component.components`（换电脑拷贝插件 `templates/task-component.components` 到 `archive/component/`）。
