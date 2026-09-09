---
name: traft-obsidian-emoji
description: emoji 速查技能——直接读 emoji-cheatsheet.md 文件，替代原 ob-emoji 工具。
---

# traft-obsidian-emoji 技能

emoji 速查：按分类/含义检索 emoji，直接读 `emoji-cheatsheet.md` 文件，替代原 ob-emoji 工具。

**职责边界**：
- 负责：emoji 查表（按分类、按 emoji、按含义）。
- 不负责：其他 vault 操作（`traft-obsidian`）。本技能只查表。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 查 emoji | "这个场景用什么 emoji"、"查下 emoji" | 触发 |
| 写文档配 emoji | 写 vault 文档时选 emoji | 触发 |
| 非 emoji 需求 | 增删改查文档 | 不触发，转交 `traft-obsidian` |
| 闲聊/泛泛提问 | "随便聊聊" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. emoji 查表直接读 `emoji-cheatsheet.md` 文件。
2. emoji 只作标题/章节视觉对照，**不进 Obsidian 标签本身**。

### 2.2 禁止执行(NEVER DO)
1. 不用 `ob-emoji` 工具——已被移除，用本技能 grep 方法替代。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：使用场景（分类）或含义/emoji。
- 缺失时：场景不明 → 先确认用途（标题/优先级/状态等）再查，不随意选。

## 3. 知识底座（CONTEXT）

- **速查表文件**：`skills/obsidian/skills/traft-obsidian-emoji/emoji-cheatsheet.md`。

### 3.1 常用分类查法

| 分类 | 查法 |
|------|------|
| type 图标（文档标题） | `grep "## type 图标"` |
| 周报优先级 | `grep "## 优先级"` |
| 周报类型 | `grep "## 类型(工作性质)"` |
| 章节语义 | `grep "## 章节语义"` |
| 人名身份 | `grep "## 人名"` |
| 状态标记 | `grep "## 状态与标记"` |
| Gitmoji 提交类型 | `grep "## 提交类型(Gitmoji)"` |
| 模块与功能 | `grep "## 模块与功能"` |
| 安全与警告 | `grep "## 安全与警告"` |
| 平台与环境 | `grep "## 平台与环境"` |

- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 定场景
- 动作：确认用途（标题/优先级/状态/提交等分类）。
- 完成标志：分类确定。

### Step 2: 查表
- 动作：按 3.1 查法 grep 速查表；或按 emoji 搜含义、按含义搜 emoji。
- 完成标志：找到匹配 emoji。

### Step 3: 交付
- 动作：给出 emoji 及适用说明。
- 完成标志：emoji 与用途匹配。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
<emoji>：<含义/适用>
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| emoji | 来自速查表，不编造 |
| 说明 | 与用户场景匹配 |

### 5.3 交付前自检
- [ ] emoji 来自速查表文件
- [ ] 未用 ob-emoji 工具

## 6. 示例

### 6.1 好的示例
**输入**：周报里 P1 任务用什么 emoji
**输出**：🟡：P1（重要不紧急）——来自速查表「优先级」分类。

### 6.2 差的示例
**输入**：周报里 P1 任务用什么 emoji
**输出**：凭印象写个"⭐"或调用 `ob-emoji`。
（emoji 未查表/用了已移除工具——违反 2.2①）
