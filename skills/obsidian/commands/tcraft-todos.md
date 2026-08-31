---
description: 周级临时 todo（Tasks 插件 checkbox）。记 todo / 勾掉完成 / 生成周报 / 结转下周。无参数=看 todo 记录方式。
argument-hint: [记录|<描述> | 完成|<任务> | 生成|周报 | 查|<状态>]
---

读 `skill://traft-todos`，按 Tasks checkbox 流程走。

- `/traft-todos 记录 修一下登录页按钮`：在周报「📋 本周任务」列表加一行 `- [ ] 🟡 P1 | 修一下登录页按钮 | ⏰ 待定`（checkbox 待办，含优先级+描述）。
- `/traft-todos 完成 修登录页`：把该行 `[ ]` 改成 `[x]`（勾掉即完成，留在原列表）。
- `/traft-todos 生成 周报`：复制 `templates/weekly.md` 到本周周报，任务都记在一个列表；周结时 `[x]` 留在本周，`[>]` 的任务复制到下周周报。

> 前沿：状态只允许 `[ ]/[x]/[/]/[-]/[>]`；`priority` 用 🔥P0/🟡P1/🟢P2。临时小任务走 `traft-todos`；项目任务/需求进展走 `traft-task`。
