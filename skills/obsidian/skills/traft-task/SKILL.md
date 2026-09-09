---
name: traft-task
description: 任务管理技能。用任务 note(schema 已 hook 校验)+ `task-component.components` 多视图(表格/看板/日历/画廊/甘特)管理任务；一个任务=一篇带 `task` tag 的 note，含优先级/负责人/起止/项目。每周评估、每月底归档。何时触发:"建任务","加个任务","更新任务进度","查看进行中的任务","这个任务什么优先级/截止","每周评估","归档任务"。
compatibility: Obsidian Tasks 插件 + task-component.components 视图（archive/component/）
---

# traft-task 技能

项目任务/需求进展管理：用 PARA 的 `project/` 下任务 note + `task-component.components` 多视图（表格/看板/日历/画廊/甘特）管理。**一个任务 = 一篇带 `task` tag 的 note**。

**职责边界**：
- 负责：项目任务、需求进展（✨feat/🐛bugfix/🔍debug）的建/改/查、每周评估、每月底归档。
- 不负责：临时小任务（`traft-todos` 周报 checkbox）、领域知识（`area/`）、看板/甘特以外的视图定制。超出边界直接转交，不硬接。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 建任务 | "建任务"、"加个任务"、"新建一个 feat/bugfix" | 触发 |
| 更新任务 | "更新任务进度"、"这个任务什么优先级/截止"、"改一下负责人" | 触发 |
| 查看任务 | "查看进行中的任务"、"哪些任务卡住了" | 触发 |
| 每周评估/归档 | "每周评估"、"归档任务"、"本月完成了哪些" | 触发 |
| 临时小任务 | "加个todo"、"记个临时任务"、"这周做过啥" | 不触发，转交 `traft-todos` |
| 闲聊/泛泛提问 | "随便聊聊"、"你怎么看" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. 一个任务 = 一篇带 `task` tag 的 note，建在 `project/<项目>/requirements/<YYYYMMDD-任务名>.md`（日期前缀命名）。
2. 严格填 schema frontmatter（type/status/priority/owner/project/start/doneTime/tags 等），hook 校验，不自造字段。
3. 进度变更改 frontmatter（`status`/`priority`/`start`/`doneTime`/子任务），视图自动反映。
4. 每周评估落一句到周记；每月底归档本月完成任务。
5. 进甘特/看板的任务须满足：`tags` 含 `task` + 有 `start`/`doneTime` + `project`。

### 2.2 禁止执行(NEVER DO)
1. 不把项目任务记成 todo/周报 checkbox 行——临时小任务才归 `traft-todos`。
2. 不跳过/自造 schema 字段，不臆造负责人、项目、起止时间。
3. 不把任务 note 建到 `project/` 以外；领域知识归 `area/`，不进任务视图。
4. 不删改 `archive/component/task-component.components` 之外的插件视图文件。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：任务名、项目归属、优先级、负责人、起止时间（按需）。
- 缺失时：
  - 任务名/优先级缺失 → 向用户确认，不猜测补全。
  - 项目归属不明 → 确认归属项目；项目不存在先与用户对齐归属，不新建 note。

## 3. 知识底座（CONTEXT）

- **载体**：任务 note `project/<项目>/requirements/<YYYYMMDD-任务名>.md`，一个任务一篇，frontmatter 字段见 5.2。
- **模板**：`skill://traft-task/../templates/task.md`（即 `skills/obsidian/templates/task.md`），建任务复制它。
- **视图**：`archive/component/task-component.components`（表格/看板按 priority/日历按 start/画廊/甘特 start→doneTime），不在 vault 根；换电脑把 `templates/task-component.components` 拷到 `archive/component/`。
- **过滤规则**：视图只收 `tags` 含 `task` 的 note（进甘特/看板须 + `start`/`doneTime` + `project`）。
- **分工**：`traft-todos` 管临时小任务（周报 checkbox 行）；任务 note 与领域 note 用双链关联，无父子字段。
- **查询**：`grep -rl` 按 frontmatter 字段（priority/status/project）检索；`/traft-task 查 进行中` 快速筛。
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 建任务
- 动作：复制 `task.md` 模板到 `project/<项目>/requirements/<YYYYMMDD-任务名>.md`，填 schema frontmatter（见 5.2）。
- IF 项目归属不明 → 先与用户对齐归属项目。
- 完成标志：note 存在、命名日期前缀、frontmatter 通过 hook 校验。

### Step 2: 更新 / 查看
- IF 更新 → 改对应 frontmatter 字段（`status`/`priority`/`start`/`doneTime`/子任务），hook 校验。
- IF 查看 → 用 `task-component.components` 视图，或 `grep -rl`/`/traft-task 查 进行中` 按状态/优先级/负责人筛。
- 完成标志：字段合法且视图/检索结果与用户意图一致。

### Step 3: 每周评估 / 归档
- IF 每周评估 → 用视图看本周完成/进行中/卡住，落一句到周记。
- IF 每月底归档 → 把本月完成任务的 `archive` 相关 + 周记移到 `archive/weekly/<YYYY-MM>/`，标记 `archived: true`。
- 完成标志：评估已落周记 / 归档完成且标记 `archived: true`。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
任务 note（`project/<项目>/requirements/<YYYYMMDD-任务名>.md`）的 frontmatter：

```yaml
---
title: <任务标题>
type: 任务
status: 待规划          # 待规划 / 进行中 / 草稿 / 完成
priority: P2            # P0 高 / P1 中 / P2 低
owner: <负责人>
project: <项目归属名>
start: <开始时间，如 2026-08-25T00:00:00>
doneTime: <结束时间，如 2026-09-03T00:00:00>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
confidence: 100
tags: [task, <领域/项目 tag>]
summary: 一句话摘要
---
```

### 5.2 字段要求

| 字段 | 取值 | 写作要求 |
|----|------|------|
| `title` | 任务标题 | 一句话，可验收 |
| `type` | 任务 | 固定值，不可改 |
| `status` | 待规划 / 进行中 / 草稿 / 完成 | 状态流转靠它，视图按此分组 |
| `priority` | P0 高 / P1 中 / P2 低 | 必填；排序 P0 > P1 > P2 |
| `owner` | 负责人 | 必填，不臆造 |
| `project` | 项目归属名 | 必填，与目录名一致 |
| `start` / `doneTime` | ISO `YYYY-MM-DDT00:00:00` | 进甘特/看板的必填 |
| `tags` | 含 `task` | 视图过滤依据；可加领域 tag |
| 通用必填 | title/created/updated/confidence/tags/summary | 与全库 note 约定一致 |

### 5.3 交付前自检
- [ ] note 建在 `project/<项目>/requirements/` 下，命名 `<YYYYMMDD>-任务名`
- [ ] frontmatter 字段齐全、无自造字段，hook 校验通过
- [ ] 进视图的任务：`tags` 含 `task` + 有 `start`/`doneTime` + `project`
- [ ] 项目任务未误记成 todo（临时任务才归 `traft-todos`）

## 6. 示例

### 6.1 好的示例
**输入**：建个任务：整理周报数据，P1，负责人小明，周五前完成
**输出**：
```yaml
---
title: 整理周报数据
type: 任务
status: 待规划
priority: P1
owner: 小明
project: 周报
start: 2026-09-10T00:00:00
doneTime: 2026-09-11T00:00:00
created: 2026-09-09
updated: 2026-09-09
confidence: 100
tags: [task, 周报]
summary: 整理本周周报数据
---
```
（相对时间"周五"换算为具体日期 `2026-09-11` 写入 `doneTime`；字段齐全、hook 校验通过）

### 6.2 差的示例
**输入**：建个任务：整理周报数据
**输出**：
```yaml
---
title: 整理周报数据
type: 任务
status: 待规划
priority: P1
tags: [task]
---
```
（缺 `owner`/`project`/`start`/`doneTime`/created/updated/confidence/summary，hook 校验失败、无法进视图）

**输入**：把这个任务完成了
**输出**：给 todo 行勾 `[x]` —— 若该任务是项目任务（`project/` note），应改 frontmatter `status: 完成` + `doneTime`，而不是当 todo 处理。
