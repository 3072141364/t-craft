# Obsidian 语法速查

写 vault 笔记时按需查。基于 Obsidian Flavored Markdown,参考 [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) 的 `obsidian-markdown`。

## Properties(frontmatter)

文件顶部 YAML 块,Obsidian 在属性面板可视化管理:

```yaml
---
title: 我的笔记
date: 2026-08-02
tags:
  - project
  - active
aliases:
  - 别名
cssclasses:
  - custom-class
---
```

常用属性:`tags`(可搜索标签)、`aliases`(链接建议时的别名)、`cssclasses`(样式类)。自定义属性随意加。

## 标签

- inline:`#tag`、嵌套 `#nested/tag`。
- frontmatter:`tags:` 列表。
- 规则:字母、数字(非首字符)、下划线、连字符、斜杠。

## Wikilinks(内部链接)

主链接机制,Obsidian 自动跟踪重命名:

- `[[笔记名]]` - 基本链接
- `[[笔记名|显示文字]]` - 自定义显示
- `[[笔记名#标题]]` - 链向标题
- `[[笔记名#^block-id]]` - 块引用
- `[[#同笔记标题]]` - 同笔记内标题

块 id:段落后加 `^block-id`,或列表/引用后单独一行加。

## Embeds(嵌入)

wikilink 前加 `!`:

- `![[笔记名]]` - 嵌入整篇
- `![[笔记名#标题]]` - 嵌入章节
- `![[图片.png|300]]` - 图片,可设宽
- `![[文档.pdf#page=3]]` - PDF 指定页

## Callouts

`> [!类型]` 语法:

- `> [!note]` - 基本
- `> [!warning] 自定义标题` - 带标题
- `> [!faq]- 默认折叠` - `-` 折叠 / `+` 展开

常用类型:note、tip、warning、info、example、quote、bug、danger、success、failure、question、abstract、todo。

## 其他

- 高亮:`==文字==`
- 注释:`%%隐藏%%`(不渲染)
- 数学:`$行内$`、`$$块$$`
- Mermaid 图:` ```mermaid ` 代码块
- 脚注:`[^1]` + `[^1]: 说明`
