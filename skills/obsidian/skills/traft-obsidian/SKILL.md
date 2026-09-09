---
name: traft-obsidian
description: obsidian知识库管理技能, 用户开发项目的离码文档、研究调研文档、工作周报文档都在这里管理。何时激活："当用户要求增、删、改、查知识库文档时" "查询或更新项目文档时，包括但不限于决策文档adr、方案文档prd、测试文档test，进度文档progress","当用户要求新增周报任务，跟新进度", "帮我整理论文要点并落盘"，"沉淀这个知识点"。
---

# traft-obsidian 技能

obsidian 知识库管理：开发项目的离码文档、研究调研文档、工作周报文档都在这里管理。知识库用 **PARA** 组织，vault 顶层四类 + 归档。

**职责边界**：
- 负责：vault 文档的增删改查、PARA 组织、frontmatter 合规、双链维护、归档。
- 不负责：项目离码文档的模板化落盘流程（`traft-code-docs`）、vault 检索回答（`traft-query`）、Obsidian 应用交互（`traft-obsidian-cli`）、任务管理（`traft-task`）。超出边界直接转交，不硬接。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 增删改查文档 | "增、删、改、查知识库文档" | 触发 |
| 项目文档 | "查询或更新项目文档（adr/prd/test/progress）" | 触发（涉及开发项目转 `traft-code-docs`） |
| 整理落盘 | "帮我整理论文要点并落盘"、"沉淀这个知识点" | 触发 |
| 周报/进度 | "新增周报任务"、"更新进度" | 触发（周报转 `traft-todos`） |
| 检索问答 | "查一下 xxx 知识" | 不触发，转交 `traft-query` |
| 应用交互 | "在 Obsidian 打开 xxx" | 不触发，转交 `traft-obsidian-cli` |
| 闲聊/泛泛提问 | "随便聊聊" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. **每篇文档都必须有 frontmatter**（字段见 3.2），写 vault 文档会被 `frontmatter` hook 校验。
2. **充分利用双链**：`[[…]]` 互引，重命名/移动必须同步更新所有双链引用（见 3.4）。
3. 文档的增删改查直接使用 read/write 工具即可，和普通文件无差别。
4. 适当使用 emoji 增加可读性——用 `traft-obsidian-emoji` skill 查（如 section=weekly/vault）。
5. vault 路径由 `obsidian vault info=path` 自动发现；无需手动记录环境变量。
6. 路由：开发项目 → `traft-code-docs`；调研/论文归 `area/`，查询用 `traft-query`；任务管理 → `traft-task`。

### 2.2 禁止执行(NEVER DO)
1. 不写无 frontmatter 的 vault 文档。
2. 重命名/移动后不更新 `[[旧名]]` 引用（视为失效双链，必须一次性替换，不是"等 Obsidian 自己修"）。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：文档内容与归属（project/area/resource/weekly/archive）。
- 缺失时：归属不明 → 按 3.1 PARA 结构判断并向用户确认，不随意放置。

## 3. 知识底座（CONTEXT）

### 3.1 PARA 结构
- `project/`：一个具体项目（≈ 一个 git repo），该项目**所有事情**（需求/离码文档/笔记）都放这一层；每需求一文件夹 `20290212-需求名/`；可嵌套子项目。
- `area/`：**知识领域**（agent、docker、论文…），**平铺**，靠 `tags` 归类（如 `tags: [area, agent]`）。
- `resource/`：兴趣/学习主题，**平铺**，`tags` 分类，层级不深。
- `weekly/`：日常进度/周报；**每月底归档**到 `archive/weekly/YYYY-MM/`。
- `archive/`：内部复刻 `project/resource/area/weekly/`，另含 `template/`（常用模板）；归档用 `archived: true` 标记 + 移入对应目录（**双轨**）。
- **project 与 area 无隶属关系**：项目用到某知识点，或知识点案例在项目里，用**双链** `[[…]]` 互引，不加父子字段。

### 3.2 frontmatter

**通用必填**：
- `title`：文档标题
- `type`：文档类型（方案 / 技术 / 流程 / 术语 / wiki / 周记 / prd / adr / test / review / progress）
- `created` / `updated`：创建时间 / 最后修改时间（YYYY-MM-DD）
- `confidence`：置信度 0-100 整数，100=已核实事实；推断/未验证须调低
- `status`：状态（进行中 / 草稿 / 完成 / 已归档 等）
- `tags`：至少一个标签
- `summary`：一句话摘要

**`project/` 文档追加**：`project`：项目归属名

**任务文档**（type 为 `任务`）追加必填：`priority`（P0/P1/P2）、`owner`、`project`、`start`、`doneTime`（ISO 时间戳）、`tags` 须含 `task`

**需求文档**（type 为 `prd`）再追加：`requester`（需求方对接人>=1）、`deadline`（YYYY-MM-DD）

**溯源字段**（知识领域/高置信度主张用）：`source`（URL/引用标识；`area/` 或 `术语`/`wiki`/`技术` 必填，置信度≥90 必填）、`authority`（official/primary/secondary/community/unknown；`area/` 必填）

**可选**：`aliases`、`cssclasses`、`archived`（逻辑归档，默认 false）、`issueType`（feature/bug/enhancement）、`createTime`/`doneTime`、自定义属性。

### 3.3 操作日志（hook 自动维护）
`meta/log.md`：`ops-log` hook 在每次 write/create/append/prepend/rename/delete 后自动追加一行（时间 + 操作 + 目标 + 摘要），位于 vault `meta/`（派生数据，不进 frontmatter 校验/检索索引）。

### 3.4 Obsidian Flavored Markdown 速查

**标签**：inline `#tag`，嵌套 `#nested/tag`（**非必要不用嵌套**，优先扁平）；frontmatter `tags:` 自由多值（PARA 类别 + 领域 + 任意主题，不设白名单）；规则：字母、数字（非首字符）、下划线、连字符、斜杠；**标签不含 emoji**。

**Wikilinks（双链）**：
- `[[笔记名]]` 基本链接 / `[[笔记名|显示文字]]` 自定义显示 / `[[笔记名#标题]]` 链向标题 / `[[笔记名#^block-id]]` 块引用 / `[[#同笔记标题]]` 同笔记内标题
- 块 id：段落后加 `^block-id`，或列表/引用后单独一行加
- **重命名/移动必须同步更新双链**：Obsidian 只在应用运行且开启"自动更新内部链接"时才自动跟随重命名；CLI/agent 直接改文件名**不会**自动更新。重命名后用 grep 全库检索并替换：`[[旧名]]`、`[[旧名|别名]]`、`[[旧名#标题]]`、`[[旧名#^块]]`、`![[旧名]]` → 新名。

**Embeds（嵌入）**：wikilink 前加 `!`——`![[笔记名]]` 整篇 / `![[笔记名#标题]]` 章节 / `![[图片.png|300]]` 图片设宽 / `![[文档.pdf#page=3]]` PDF 指定页。

**Callouts（标注块）**：`> [!类型]`——`> [!note]` 基本 / `> [!warning] 自定义标题` 带标题 / `> [!faq]- 默认折叠`（`-` 折叠 `+` 展开）。常用类型：note、tip、warning、info、example、quote、bug、danger、success、failure、question、abstract、todo。

**其他**：高亮 `==文字==`；注释 `%%隐藏%%`；数学 `$行内$`、`$$块$$`；Mermaid 图；脚注 `[^1]` + `[^1]: 说明`。

- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 判断归属
- 动作：按 3.1 PARA 判断文档归属（project/area/resource/weekly/archive）；开发项目文档转 `traft-code-docs`。
- 完成标志：归属明确。

### Step 2: 落盘/修改
- 动作：用 read/write 工具操作；frontmatter 按 3.2 填齐（hook 会校验）；emoji 用 `traft-obsidian-emoji` 查。
- 完成标志：frontmatter 齐全、hook 校验通过。

### Step 3: 维护双链与归档
- IF 重命名/移动 → grep 全库替换所有 `[[旧名]]` 变体。
- IF 归档 → `archived: true` 标记 + 移入 `archive/` 对应目录（双轨）。
- 完成标志：双链无失效引用；归档双轨完成。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
## 变更
- <文件全局路径>：<增/删/改/移，frontmatter 校验通过>
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 变更 | 文件全局路径 + 操作类型；重命名列出已替换的双链数 |

### 5.3 交付前自检
- [ ] frontmatter 字段齐全（通用必填 + 类型追加），hook 通过
- [ ] 重命名/移动后双链已全库替换
- [ ] 归属符合 PARA，归档走双轨
- [ ] 涉及开发项目/查询/应用交互已转交对应技能

## 6. 示例

### 6.1 好的示例
**输入**：沉淀一篇 docker 网络的知识点
**输出**：
```text
## 变更
- /vault/area/docker/docker网络基础.md：新增，frontmatter 校验通过（type: 技术, source: 官方文档）
```

### 6.2 差的示例
**输入**：沉淀一篇 docker 网络的知识点
**输出**：无 frontmatter 直接写文件；或放错归属（如放 `project/` 下无项目归属）。
（违反 2.1①②——frontmatter 必填、归属按 PARA）
