---
name: traft-homepage
description: vault 主页(Home)管理技能。vault 根必须有一篇 `home.md` 主页，嵌入组件视图(如 archive/component/tasks.components)聚合任务/知识/资源入口。何时触发:"加主页","改主页","把组件显示到主页","首页","home","聚合视图"。
---

# vault 主页（Home）

vault 根须有一篇 **`home.md`**，作为知识库主页，**嵌入组件视图**聚合入口。

## home.md 结构
```markdown
---
title: Home
type: wiki
status: 常驻
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
confidence: 100
tags: [area, home]
summary: 知识库主页
---
# 🏠 主页

## 任务（tasks.components 视图）
![[archive/component/tasks.components]]

## 入口
- 知识领域 → `area/`
- 项目 → `project/`
- 周记/日常 → `weekly/`
- 归档 → `archive/`
```

要点：
- `home.md` 在 **vault 根**；frontmatter 走 traft-obsidian 规范（hook 校验）。
- **嵌入组件**用 `![[<路径>.components]]`（如 `![[archive/component/tasks.components]]`），Obsidian 渲染该组件视图（表格/看板/日历/画廊/甘特）。
- 组件文件在 `archive/component/`（不在 vault 根）。

## 换电脑建主页
1. 拷贝插件 `templates/tasks.components` → vault `archive/component/`。
2. 建 `home.md`（上面结构）嵌入 `![[archive/component/tasks.components]]`。
3. 打开 `home.md` 看聚合视图。

## 规则
- 主页只做**入口聚合**（嵌入组件 + 链接），不塞正文。
- 加新组件：建在 `archive/component/`，在 `home.md` 里 `![[...]]` 嵌入。
- 改视图：直接改对应 `.components` 文件（或 `tasks.components`）。
