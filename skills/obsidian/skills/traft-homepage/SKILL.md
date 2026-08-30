---
name: traft-homepage
description: vault 主页(Home)管理技能。主页是 vault 根的一篇 **`Home.components`**(Obsidian Components 组合视图)，不是 md 文档；它组合我们的组件视图(任务表格/看板/日历/画廊/甘特)，作为知识库入口。何时触发:"加主页","改主页","把组件显示到主页","首页","home","聚合视图","建 Home.components"。
---

# vault 主页（Home.components）

**主页 = vault 根的一篇 `Home.components`**——Obsidian Components 插件的一个**组合视图**（`multi` + `dynamicDataView` 组件，标签页切换），**不是 markdown**。

## 结构
`Home.components`（vault 根）是一个 `multi` 根组件 + 若干 `dynamicDataView` 子组件标签：
- 表格视图（任务 名称/状态/优先级/负责人/项目/起止）
- 看板（按 `priority` 分组）
- 日历（按 `start`）
- 画廊（title/status/priority/owner）
- 甘特图(起止)（`start`→`doneTime`）

当前主页组合的是任务视图（复用 `tasks.components`）。

## 换电脑建主页
1. 拷贝插件 `templates/Home.components` → vault 根 `Home.components`。
2. 拷贝插件 `templates/tasks.components` → `archive/component/`（任务组件源）。
3. 打开 `Home.components` 即主页（标签页切换各视图）。

## 规则
- 主页只做**组合视图**（聚合任务/入口），不加 md 正文。
- 要加新组件：在 `archive/component/` 建 `.components`，再把其视图并进 `Home.components`（`multi` 根下加 `dynamicDataView` 标签）。
- 改视图：直接改 `Home.components`（或对应 `archive/component/*.components`）。
- 组件文件在 `archive/component/`；Home.components 在 vault 根。
