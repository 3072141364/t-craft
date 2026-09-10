---
name: traft-homepage
description: vault 主页(Home)初始化/维护技能。主页是 vault 根的一篇 **`Home.components`**(Obsidian Components 网格仪表盘, 时钟/统计/按钮/最近修改 + 任务看板), 不是 md；新用户拷贝插件模板即可初始化。何时触发:"初始化主页","建主页","新用户主页","首页","home","主页没了","聚合视图"。
---

# traft-homepage 技能

vault 主页（Home）初始化/维护：主页是 vault 根的一篇 **`Home.components`**（Obsidian Components 网格仪表盘：时钟 + 统计卡片 + 功能/导航按钮 + 最近修改文件 + **任务看板**），**不是 markdown**。

**职责边界**：
- 负责：主页初始化（拷贝模板）、主页维护（组件/统计卡片/看板引用）。
- 不负责：任务视图内容配置细节（改 `archive/component/task-component.components` 归本技能维护范围，但任务数据归 `traft-task`）、其他 vault 文档（`traft-obsidian`）。超出边界直接转交，不硬接。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 初始化主页 | "初始化主页"、"建主页" | 触发 |
| 新用户 | "新用户主页" | 触发 |
| 主页异常 | "主页没了" | 触发 |
| 看主页/聚合视图 | "首页"、"home"、"聚合视图" | 触发 |
| 任务数据管理 | "建任务"、"任务进度" | 不触发，转交 `traft-task` |
| 闲聊/泛泛提问 | "随便聊聊" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. 主页是 `Home.components`，**不是 md**——不建 `Home.md`。
2. 主页用 `reference` 引用 `archive/component/task-component.components`——初始化**必须两步都拷**，否则任务看板空白。
3. 统计卡片（card/button/count）的 `query` 在组件 ⚙️ 里配（如 状态=进行中）；模板里 query 已清空避免错值。

### 2.2 禁止执行(NEVER DO)
1. 不直接改 `task-component.components` 之外的主页组件文件内容来修任务视图（任务视图改 `archive/component/task-component.components`）。
2. 初始化不跳过 `Home.components` 与 `task-component.components` 两步拷贝。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：插件模板（`templates/Home.components`、`templates/task-component.components`）。
- 缺失时：模板缺失 → 从插件包恢复，如实告知。

## 3. 知识底座（CONTEXT）

### 3.1 结构
```
Home.components (grid 仪表盘)
├─ 时钟
├─ 统计卡片: ✉️待办任务 / 🧠知识领域 / 📁项目 / 📅周记 / 📋任务总数
├─ 功能按钮(新建任务/查任务等)、导航按钮、提醒卡片
├─ 任务看板 → reference archive/component/task-component.components
│            (表格/看板/日历/画廊/甘特)
└─ 最近修改文件(list)
```

### 3.2 关键文件
- 插件 `templates/Home.components` → vault 根 `Home.components`。
- 插件 `templates/task-component.components` → `archive/component/task-component.components`（主页任务看板引用它）。
- 插件 `templates/task.md` → 建任务用（可选）。
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 初始化（任何电脑）
- 动作：拷贝插件 `templates/Home.components` → vault 根 `Home.components`；拷贝插件 `templates/task-component.components` → `archive/component/task-component.components`；可选拷贝 `templates/task.md`。
- 完成标志：两步拷贝完成（否则任务看板空白）。

### Step 2: 打开验证
- 动作：打开 `Home.components` 即主页，核对任务看板非空白。
- 完成标志：主页正常显示，任务看板有内容。

### Step 3: 维护
- IF 改任务视图 → 改 `archive/component/task-component.components`。
- IF 加新组件 → 建在 `archive/component/`，主页里加对应 component 或 reference。
- IF 统计卡片错值 → 在组件 ⚙️ 里配 query。
- 完成标志：改动完成且主页刷新正常。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
## 变更
- <文件全局路径>：<拷贝/新增/修改>
## 验证
<主页打开结果：任务看板是否正常>
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 变更 | 文件全局路径 + 操作 |
| 验证 | 主页实际打开结果，不口述 |

### 5.3 交付前自检
- [ ] `Home.components` 与 `task-component.components` 均已拷（或说明现状）
- [ ] 未建 `Home.md`（主页不是 md）
- [ ] 任务看板验证非空白

## 6. 示例

### 6.1 好的示例
**输入**：初始化主页
**输出**：
```text
## 变更
- /vault/Home.components：拷贝自模板
- /vault/archive/component/task-component.components：拷贝自模板
## 验证
主页打开正常，任务看板显示表格视图。
```

### 6.2 差的示例
**输入**：初始化主页
**输出**：只拷了 `Home.components`，任务看板空白；或建了个 `Home.md`。
（违反 2.2②——两步拷贝必须都做；主页不是 md）
