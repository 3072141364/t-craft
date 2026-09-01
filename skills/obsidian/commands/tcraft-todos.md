---
description: 周级临时 todo（Tasks 插件 checkbox）。记 todo / 勾掉完成 / 生成周报 / 结转下周。无参数=看 todo 记录方式。
argument-hint: [记录|<描述> | 完成|<任务> | 生成|周报 | 查|<状态>]
---

读 `skill://traft-todos`，按 Tasks checkbox 流程走。

- `/traft-todos 记录 修一下登录页按钮`：在周报「📋 本周任务」列表加一行 `- [ ] 🟡 P1 | 修一下登录页按钮 | ⏰ 待定`（checkbox 待办，含优先级+描述）。
- `/traft-todos 完成 修登录页`：把该行 `[ ]` 改成 `[x]`（勾掉即完成，留在原列表）。
- `/traft-todos 生成 周报`：复制 `skills/obsidian/templates/weekly.md` 到本周周报（**严格遵循模板格式**），任务都记在一个列表；周结时 `[x]` 留在本周，`[>]` 的任务复制到下周周报。
## 写 todo 步骤

### 第一步：计算周报路径

```bash
# 查 vault 路径（不写死）
vault=$(obsidian vault info=path 2>/dev/null)

# 计算 ISO 周
iso_week=$(date +%G-W%V)    # 如 2026-W36

# 拼出周报路径
path="$vault/weekly/周记 $iso_week.md"
```

### 第二步：直接写一行

周报路径已知，直接 `bash` 追加，不绕 obsidian 命令行：

```bash
echo '- [ ] 🟡 P1 | 任务描述 | 🦊 zane.wei ⏰ 待定' >> "/path/to/周记 2026-W36.md"
```

`- [ ] 优先级 | 内容 | 👤对接人 ⏰时间 | 🔗 [[卡片]]`，优先级和内容是必填，其余可选。

- 不改已有内容，不读文件确认，一次到位。
- 只有 `traft-task` 的项目任务才需要创建卡片，临时 todo 不建卡片。

> 前沿：状态只允许 `[ ]/[x]/[/]/[-]/[>]`；`priority` 用 🔥P0/🟡P1/🟢P2。临时小任务走 `traft-todos`；项目任务/需求进展走 `traft-task`。
