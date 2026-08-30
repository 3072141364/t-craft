---
name: traft-homepage
description: vault 主页(Home)初始化/维护技能。主页是 vault 根的一篇 **`Home.components`**(Obsidian Components 网格仪表盘, 时钟/统计/按钮/最近修改 + 任务看板), 不是 md；任何电脑拷贝插件模板即可初始化。何时触发:"初始化主页","建主页","换电脑主页","首页","home","主页没了","聚合视图"。
---

# vault 主页（Home.components）

**主页 = vault 根的一篇 `Home.components`**——Obsidian Components 网格仪表盘（时钟 + 统计卡片 + 功能/导航按钮 + 最近修改文件 + **任务看板**），**不是 markdown**。

## 任何电脑初始化主页
1. 拷贝插件 `templates/Home.components` → vault 根 `Home.components`。
2. 拷贝插件 `templates/task-component.components` → `archive/component/task-component.components`（主页"任务看板"引用它）。
3. 可选：拷贝 `templates/task.md` → 建任务用。
4. 打开 `Home.components` 即主页。

> 主页用 `reference` 引用 `archive/component/task-component.components`——**必须**两步都拷，否则任务看板空白。

## 结构
```
Home.components (grid 仪表盘)
├─ 时钟
├─ 统计卡片: ✉️待办任务 / 🧠知识领域 / 📁项目 / 📅周记 / 📋任务总数
├─ 功能按钮(新建任务/查任务等)、导航按钮、提醒卡片
├─ 任务看板 → reference archive/component/task-component.components
│            (表格/看板/日历/画廊/甘特)
└─ 最近修改文件(list)
```

## 维护
- 统计卡片(card/button/count)的 `query` 在组件 ⚙️ 里配（如 状态=进行中）；模板里 query 已清空避免错值。
- "任务看板"是引用 task-component，改任务视图改 `archive/component/task-component.components`。
- 加新组件：建在 `archive/component/`，主页里加对应 component 或 reference。
