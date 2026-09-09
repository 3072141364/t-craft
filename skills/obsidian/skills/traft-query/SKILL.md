---
name: traft-query
description: vault 检索/查询技能——快速查询知识点。从 obsidian vault 的 project/area/resource/weekly/archive 检索知识、项目离码文档、研究笔记、周报，用 grep/glob 文件系统工具替代原 ob-query，按证据接地回答问题。何时触发:"查一下"、"找一找"、"回忆"、"想看某主题"、"当时怎么定的"、"检索"。
---

# traft-query 技能

快速查询 vault 知识点：从 `.md`（`project/` 项目、`area/` 知识领域、`resource/` 资源、`weekly/` 周报、`archive/` 归档）检索并回答。vault 路径用 `obsidian vault info=path` 获取；直接文件系统搜索比调 Obsidian CLI 快得多。

**职责边界**：
- 负责：只读检索与回答——全文搜索、frontmatter/标签过滤、按文件名找文档、证据接地综合。
- 不负责：新增/修改 vault 文档（`traft-obsidian` 写入规范）、与 Obsidian 应用交互（`traft-obsidian-cli`）、任务/临时任务管理（`traft-task`/`traft-todos`）。超出边界直接转交，不硬接。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 查知识点 | "查一下"、"找一找"、"回忆"、"想看某主题"、"检索" | 触发 |
| 查项目决策/文档 | "当时怎么定的"、"这个需求结论是什么"、"prd/adr 里写的" | 触发 |
| 查笔记/周报 | "上周周报写了啥"、"这个研究笔记记了什么" | 触发 |
| 写入/修改文档 | "记一下"、"改一下这篇文档" | 不触发，转交 `traft-obsidian` |
| 应用交互 | "在 Obsidian 打开 xxx"、"换个主题" | 不触发，转交 `traft-obsidian-cli` |
| 闲聊/泛泛提问 | "随便聊聊"、"你怎么看" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. 先检索再回答；检索输出是候选路径，不是答案本身。
2. 全文搜索用 `grep -rl`/`grep -rn`（带行号），优先搜 `project/`；按 frontmatter 字段搜用 `grep "^字段名:"` 锚定行首。
3. 渐进披露：先读每条命中的 `summary` 与元数据判断相关性——相关才 `read` 全文；不相关跳过，不读整篇。
4. 综合回答时注明出处（vault 相对路径）与置信度。
5. 无命中 → 明确说"vault 中没有相关内容"，不编造。

### 2.2 禁止执行(NEVER DO)
1. 不伪造引用、引文、页码、日期。
2. 不用 `obsidian search` 搜索——`grep` 快 10-100 倍。
3. 不用 `ob-query`——已移除，用本技能 grep 方法替代。
4. 不凭 snippet 脑补内容，检索后必须读文件确认。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：vault 路径（`obsidian vault info=path`）、关键词与搜索范围。
- 缺失时：
  - vault 路径未知 → 先获取，不猜测。
  - 检索无命中 → 换英文/近义词/`folder` 范围重试一次，再报无。
  - 命中过多 → 先用 summary/元数据过滤，再读全文。

## 3. 知识底座（CONTEXT）

### 3.1 vault 目录结构

```
/obsidian-vault/
├── project/      # 项目文档（按项目名分目录）
├── area/         # 知识领域
├── weekly/       # 周报
├── archive/      # 归档
├── meta/         # 派生数据（log 等）
└── resource/     # 参考文档
```

### 3.2 检索命令速查

| 目的 | 命令 |
|------|------|
| 全文搜索（推荐） | `grep -rl "关键词" /path/to/vault/project` |
| 全文 + 行号 | `grep -rn "关键词" /path/to/vault/project --include='*.md'` |
| 按 `type` 搜 | `grep -rl "^type: 方案" /path/to/vault/project --include='*.md'` |
| 按 `status` 搜 | `grep -rl "^status: 定稿" /path/to/vault --include='*.md'` |
| 按标签搜 | `grep -rl "tags:.*#overlay" /path/to/vault --include='*.md'` |
| 按项目归属搜 | `grep -rl "^project: logsim" /path/to/vault/project --include='*.md'` |
| 按文件名搜 | `find /path/to/vault -name '*关键词*' -name '*.md'` |
| 组合（限定目录） | `grep -rl "overlay" /path/to/vault/project --include='*.md'` |
| 带上下文 | `grep -n "overlay" /path/to/vault/project/general_process/wiki/08-xxx.md` |

### 3.3 分工
- 写入/修改文档 → `traft-obsidian`；应用交互 → `traft-obsidian-cli`；任务 → `traft-task`；临时任务 → `traft-todos`。
- 任务以 `project/<项目>/requirements/` 下带 `task` tag 的 note 为准；项目决策/需求以 `project/` 下 prd/adr/progress 为准。
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 定范围与命令
- 动作：确定搜索目录与关键词；按 3.2 选命令（全文/frontmatter/文件名/组合）。
- 完成标志：命令与范围明确，能执行。

### Step 2: 检索
- 动作：执行 grep/find；候选路径列表入下一步。
- 完成标志：拿到候选路径；无命中 → 换词/换范围重试一次，仍无则直接报"vault 中没有相关内容"。

### Step 3: 渐进披露
- 动作：读每条命中的 `summary`/元数据判断相关性；相关才 `read` 全文。
- 完成标志：确认了相关的文档，未读无关全文。

### Step 4: 综合回答
- 动作：基于读到的内容回答；每条要点注明出处（vault 相对路径）与置信度。
- 完成标志：每条要点可追溯到具体文档，无编造。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
## 结论
<直接回答用户问题>
## 依据
- <要点>: <vault 相对路径>（置信度: 高/中/低）
## 未命中
<换词重试后仍无 → 明确说明 vault 中无相关内容>
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 结论 | 先结论后原因，直接回答用户问题 |
| 依据 | 每条可追溯到 vault 相对路径，不给猜测；无法定位到页的表述给"来自 X 主题"级说明 |
| 未命中 | 换英文/近义词/范围重试一次后再写；检索不到 ≠ 没有 |

### 5.3 交付前自检
- [ ] 先检索后回答，未凭记忆/印象作答
- [ ] 每条要点有出处路径，无编造引用/引文/日期
- [ ] 无命中时已换词重试一次并如实说明
- [ ] 写入/应用交互类请求已转交对应技能，未硬接

## 6. 示例

### 6.1 好的示例
**输入**：查一下 overlay 方案当时怎么定的
**输出**：
```text
## 结论
overlay 方案采用 project 下的 prd 定稿方案，关键技术选型为 X。
## 依据
- 选型 X: project/general_process/wiki/08-OverlayFS原理与项目实践.md（置信度: 高）
- 决策记录: project/general_process/prd/xxx.md 的 ADR-3（置信度: 高）
## 未命中
无
```
（先 grep 检索候选 → 读 summary 过滤 → 读全文 → 带路径回答）

### 6.2 差的示例
**输入**：查一下 overlay 方案当时怎么定的
**输出**：直接凭印象作答，无检索、无出处路径；或用 `obsidian search` 搜索。
（违反先检索再回答、证据接地；`obsidian search` 比 grep 慢 10-100 倍）
