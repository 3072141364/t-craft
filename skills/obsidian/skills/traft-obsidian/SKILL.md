---
name: traft-obsidian
description: obsidian知识库管理技能, 用户开发项目的离码文档、研究调研文档、工作周报文档都在这里管理。何时激活："当用户要求增、删、改、查知识库文档时" "查询或更新项目文档时，包括但不限于决策文档adr、方案文档prd、测试文档test，进度文档progress","当用户要求新增周报任务，跟新进度", "帮我整理论文要点并落盘"，"沉淀这个知识点"。
---


# START 
知识库用 **PARA** 组织，vault 顶层四类 + 归档：
- `project/`：一个具体项目（≈ 一个 git repo），该项目**所有事情**（需求/离码文档/笔记）都放这一层；每需求一文件夹 `20290212-需求名/`；可嵌套子项目。
- `area/`：**知识领域**（agent、docker、论文…），**平铺**，靠 `tags` 归类（如 `tags: [area, agent]`）。
- `resource/`：兴趣/学习主题，**平铺**，`tags` 分类，层级不深。
- `weekly/`：日常进度 / 周报；**每月底归档**到 `archive/weekly/YYYY-MM/`。
- `archive/`：内部复刻 `project/resource/area/weekly/`，另含 `template/`（常用模板）；归档用 `archived: true` 标记 + 移入对应目录（**双轨**）。

**project 与 area 无隶属关系**：项目用到某知识点，或知识点案例在项目里，用**双链** `[[…]]` 互引，不加父子字段。

- 每篇文档都必须有 frontmatter。
- 充分利用obsidian的双链功能。
- 文档的增删改查直接使用read和write工具即可，和普通文件无差别。
- 适当使用emoji，增加文档可读性，用 `traft-obsidian-emoji` skill 查（如 section=weekly/vault）。

# RULES

## ALWAYS DO
- vault 路径由 `obsidian vault info=path` 自动发现；无需手动记录环境变量。
- 涉及到开发项目的，激活 `traft-code-docs` skill。
- 涉及到调研、论文阅读的，归到 `area/`（知识领域），查询用 `traft-obsidian-query` skill。
- 涉及到任务管理的，激活 `traft-task` skill。


## NEVER DO



# SYNTAX

Obsidian Flavored Markdown 速查，写 vault 文档时按需用。

## frontmatter

文档必须带 YAML frontmatter（`---` 包围，位于文件顶部）。写 vault 文档会被 `frontmatter` hook 校验，缺失或字段不全会被拦截。

**通用必填**：
- `title`：文档标题
- `type`：文档类型（方案 / 技术 / 流程 / 术语 / wiki / 周记 / prd / adr / test / review / progress）
- `created` / `updated`：创建时间 / 最后修改时间（YYYY-MM-DD）
- `confidence`：置信度 0-100 整数，100=已核实事实；推断/未验证须调低
- `status`：状态（进行中 / 草稿 / 完成 / 已归档 等）
- `tags`：至少一个标签
- `summary`：一句话摘要

**`project/` 文档追加**：
- `project`：项目归属名

**任务文档**（type 为 `任务`）追加必填：
- `priority`：优先级（P0 / P1 / P2）
- `owner`：负责人
- `project`：项目归属名
- `start`：开始时间（ISO 时间戳）
- `doneTime`：结束时间（ISO 时间戳）
- `tags` 须含 `task`

**需求文档**（type 为 `prd`）再追加：
- `requester`：需求方对接人>=1（提出需求的人/团队）
- `deadline`：截止日期（YYYY-MM-DD）

**溯源字段**（知识领域 / 高置信度主张用）：
- `source`：来源（URL / 引用标识）；知识文档（`area/` 或 `术语`/`wiki`/`技术`）必填，置信度≥90 的主张必填
- `authority`：权威性（official / primary / secondary / community / unknown）；`area/` 知识文档必填

**可选**：`aliases`（链接别名）、`cssclasses`、`archived`（逻辑归档，默认 false）、`issueType`（需求/项目类型：feature/bug/enhancement）、`createTime`/`doneTime`（ISO 时间戳，项目用）、自定义属性。

## 操作日志（hook 自动维护）

`meta/log.md`：`ops-log` hook 在每次 write/create/append/prepend/rename/delete 后自动追加一行（时间 + 操作 + 目标 + 摘要），位于 vault `meta/`（派生数据，不进 frontmatter 校验 / 检索索引）。

## 标签

- inline：`#tag`；嵌套 `#nested/tag`（**非必要不用嵌套**，优先扁平标签）。
- frontmatter：`tags:` 列表，**自由多值**：PARA 类别（project/area/resource/journal）+ 领域（docker/agent/…）+ 任意主题，不设白名单。
- 规则：字母、数字（非首字符）、下划线、连字符、斜杠；**标签不含 emoji**（emoji 只作标题/章节的视觉对照，见 emoji 速查表）。

## Wikilinks（双链）

主链接机制，Obsidian 自动跟踪重命名：

- `[[笔记名]]` - 基本链接
- `[[笔记名|显示文字]]` - 自定义显示
- `[[笔记名#标题]]` - 链向标题
- `[[笔记名#^block-id]]` - 块引用
- `[[#同笔记标题]]` - 同笔记内标题

块 id：段落后加 `^block-id`，或列表/引用后单独一行加。

**重命名 / 移动必须同步更新双链**：Obsidian 只在应用运行且开启"自动更新内部链接"时才自动跟随重命名；CLI / agent 直接改文件名**不会**自动更新。所以重命名文档后，用 grep 全库检索并替换所有对该文档的引用：
- `[[旧名]]`、`[[旧名|别名]]`、`[[旧名#标题]]`、`[[旧名#^块]]`、`![[旧名]]` → 改为新名
- 仍指向旧名的引用视为失效双链，必须一次性替换，不是"等 Obsidian 自己修"。

## Embeds（嵌入）

wikilink 前加 `!`：

- `![[笔记名]]` - 嵌入整篇
- `![[笔记名#标题]]` - 嵌入章节
- `![[图片.png|300]]` - 图片，可设宽
- `![[文档.pdf#page=3]]` - PDF 指定页

## Callouts（标注块）

`> [!类型]` 语法：

- `> [!note]` - 基本
- `> [!warning] 自定义标题` - 带标题
- `> [!faq]- 默认折叠` - `-` 折叠 / `+` 展开

常用类型：note、tip、warning、info、example、quote、bug、danger、success、failure、question、abstract、todo。

## 其他

- 高亮：`==文字==`
- 注释：`%%隐藏%%`（不渲染）
- 数学：`$行内$`、`$$块$$`
- Mermaid 图：mermaid 代码块
- 脚注：`[^1]` + `[^1]: 说明`





