---
name: traft-obsidian
description: obsidian知识库管理技能, 用户开发项目的离码文档、研究调研文档、工作周报文档都在这里管理。何时激活："当用户要求增、删、改、查知识库文档时" "查询或更新项目文档时，包括但不限于决策文档adr、方案文档prd、测试文档test，进度文档progress","当用户要求新增周报任务，跟新进度", "帮我整理论文要点并落盘"，"沉淀这个知识点"。
---


# START 
用户使用obsidian管理自己的知识库，目前主要分为几类`开发项目文档`、`研究调研笔记`、`周报进程`。

- obsidian 用文档管理知识库，一篇文档 = 一篇 `.md`。
- 每篇文档都必须有 frontmatter。
- 充分利用obsidian的双链功能。
- 文档的增删改查直接使用read和write工具即可，和普通文件无差别。
- 适当使用emoji，增加文档可读性，可参考 `reference/emoji-cheatsheet.md`(或 `skill://traft-obsidian/reference/emoji-cheatsheet.md`)。

# RULES

## ALWAYS DO
- vault 路径由 `ob-cli` 工具自动发现（`obsidian vault info=path`，单 vault 自动解析活动库）；无需手动记录环境变量。
- 涉及到开发项目的，激活 `traft-code-docs` skill。
- 涉及到调研、论文阅读的，激活 `traft-research` skill。
- 涉及到周报的，激活 `traft-weekly` skill。


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

**需求文档**（type 为 `prd`）再追加：
- `requester`：需求方对接人>=1（提出需求的人/团队）
- `deadline`：截止日期（YYYY-MM-DD）

**可选**：`aliases`（链接别名）、`cssclasses`（样式类）、自定义属性。

## 标签

- inline：`#tag`、嵌套 `#nested/tag`。
- frontmatter：`tags:` 列表。
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





