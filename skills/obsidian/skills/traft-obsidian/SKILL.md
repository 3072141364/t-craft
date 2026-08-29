---
name: traft-obsidian
description: obsidian知识库管理技能, 用户开发项目的离码文档、研究调研文档、工作周报文档都在这里管理。何时激活："当用户要求增、删、改、查知识库文档时" "查询或更新项目文档时，包括但不限于决策文档adr、方案文档prd、测试文档test，进度文档progress","当用户要求新增周报任务，跟新进度", "帮我整理论文要点并落盘"，"沉淀这个知识点"。
---


# START 
用户使用obsidian管理自己的知识库，目前主要分为几类`开发项目文档`、`研究调研笔记`、`周报进程`。

- obsidian 使用卡片的形式进行管理，一张卡片等于一篇md文档。
- obsidian 的文档有三种路径格式，假设`OBSIDIAN_VAULT_PATH=/home/wz/文档/default/`,下面三个路径指向同一篇文档。
  - obsidian url：obsidian://open?vault=default&file=INDEX
  - 基于库的相对路径：INDEX
  - 绝对路径：/home/wz/文档/default/INDEX.md
- 每张卡片都必须有frontmatter。
- 充分利用obsidian的双链功能。
- 卡片的增删改查直接使用read和write工具即可，和普通文件无差别。
- 适当使用emoji，增加文档可读性，可参考 `reference/emoji-cheatsheet.md`(或 `skill://traft-obsidian/reference/emoji-cheatsheet.md`)。

# RULES

## ALWAYS DO
- 环境变量 `OBSIDIAN_VAULT_PATH` / `OBSIDIAN_VAULT` 记录了vault路径，如果没有，询问用户并记录到zshrc和bashrc。
- 涉及到开发项目的，激活 `traft-code-docs` skill。
- 涉及到调研、论文阅读的，激活 `traft-research` skill。
- 涉及到周报的，激活 `traft-weekly` skill。


## NEVER DO



# SYNTAX

Obsidian Flavored Markdown 速查，写 vault 卡片时按需用。

## frontmatter（每张卡必备）

文件顶部 YAML 块，Obsidian 在属性面板可视化管理：

```yaml
---
title: 卡片标题
card_type: 技术        # 方案 / 技术 / 流程 / 术语 / wiki / 周记
date: 2026-08-28
summary: 一两句话摘要，供快速判断卡片内容
tags:
  - 通用
  - 规范
---
```

常用属性：`tags`（可搜索标签）、`aliases`（链接建议时的别名）、`cssclasses`（样式类）；`card_type` 取值与图标对照见 `reference/emoji-cheatsheet.md`。自定义属性随意加。

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





