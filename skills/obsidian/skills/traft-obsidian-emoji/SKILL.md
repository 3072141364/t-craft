---
name: traft-obsidian-emoji
description: emoji 速查技能——直接读 emoji-cheatsheet.md 文件，替代原 ob-emoji 工具。
---


# START

emoji 速查表在 `skills/obsidian/skills/traft-obsidian-emoji/emoji-cheatsheet.md`。

## 查法

```bash
# 按分类查（如 section=gitmoji）
grep -A 20 "## 提交类型(Gitmoji)" skills/obsidian/skills/traft-obsidian-emoji/emoji-cheatsheet.md

# 搜特定 emoji 含义
grep "🔥" skills/obsidian/skills/traft-obsidian-emoji/emoji-cheatsheet.md

# 搜特定含义找 emoji
grep -i "重构" skills/obsidian/skills/traft-obsidian-emoji/emoji-cheatsheet.md
```

## 常用分类

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


# RULES

## ALWAYS DO
- emoji 查表直接读 `emoji-cheatsheet.md` 文件。
- emoji 只作标题/章节视觉对照，不进 Obsidian 标签本身。

## NEVER DO
- 不要用 `ob-emoji` 工具——已被移除，用本 skill 的 grep 方法替代。