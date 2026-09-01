---
name: traft-obsidian-query
description: vault 内容检索技能——用 grep/glob 等文件系统工具搜索 vault 文档，替代原 ob-query 工具。
---


# START

vault 路径用 `obsidian vault info=path` 获取。直接文件系统搜索比调 Obsidian CLI 快得多。

## 检索方法

### 全文搜索（推荐）

```bash
grep -rl "关键词" /path/to/vault/project
grep -rl "关键词" /path/to/vault --include='*.md'
```

适用场景：按正文内容找文档。

### 按 frontmatter 属性搜索

```bash
# 搜特定 type
grep -rl "^type: 方案" /path/to/vault/project --include='*.md'

# 搜特定 status
grep -rl "^status: 定稿" /path/to/vault --include='*.md'

# 搜标签
grep -rl "tags:.*#overlay" /path/to/vault --include='*.md'

# 搜项目归属
grep -rl "^project: logsim" /path/to/vault/project --include='*.md'
```

### 按文件名/路径

```bash
# 找文件名包含关键词
find /path/to/vault -name '*关键词*' -name '*.md'

# 找特定目录下所有文件
ls /path/to/vault/project/general_process/
```

### 组合搜索

```bash
# 搜索特定目录下的特定关键词
grep -rl "overlay" /path/to/vault/project --include='*.md' | head -5

# 带上下文搜索
grep -n "overlay" /path/to/vault/project/general_process/wiki/08-OverlayFS原理与项目实践.md | head -10
```

## vault 目录结构

```
/obsidian-vault/
├── project/      # 项目文档（按项目名分目录）
├── area/         # 知识领域
├── weekly/       # 周报
├── archive/      # 归档
├── meta/         # 派生数据（log 等）
└── resource/     # 参考文档
```

## 检索步骤

1. 确定搜索范围（哪个目录、什么关键词）
2. 选对命令（`grep -rl` 全文 / `grep "^key:"` frontmatter / `find -name` 文件名）
3. 读命中文件内容确认相关性
4. 综合回答，注明出处


# RULES

## ALWAYS DO
- 全文搜索用 `grep -rl` 或 `grep -rn`（带行号），搜 `project/` 目录最多。
- 按 frontmatter 字段搜用 `grep "^字段名:"` 锚定行首。
- 检索后读文件确认内容，不凭 snippet 脑补。
- 无命中 → 明确说"vault 中没有相关内容"，不编造。

## NEVER DO
- 不要用 `obsidian search` 搜索——`grep` 快 10-100 倍。
- 不要用 `ob-query`——已被移除，用本 skill 的 grep 方法替代。