---
description: Obsidian vault 管理入口(obsidian-kb skill)。初始化 vault、需求落盘、知识沉淀、标签维护、快速问答、建周报。无参数 = 按当前对话意图自动路由到对应模块;带参数 = 指定模块。查 vault 用 /tcraft-obsidian-query;论文走 /tcraft-paper。
argument-hint: [init | 落盘 | 沉淀 | 标签 | 问答 | 周报]
---

触发 **obsidian-kb** skill 的对应模块。

## 执行

读 obsidian-kb SKILL.md,按模块执行:

- **无参数**:按当前对话意图自动路由(写方案→落盘,记卡片→沉淀,整理标签→标签,问固定操作→问答,建周报→周报)。
- `init` → **模块零**(初始化 vault)
- `落盘` → **模块一**(需求方案落盘:建需求文件夹 + prd/progress)
- `沉淀` → **模块三**(卡片沉淀)
- `标签` → **模块六**(标签维护)
- `问答` → **模块五**(快速问答,answer-index)
- `周报` → **模块四**(周报,或直接 /tcraft-weekly)

## 约定

- **落盘/写卡前展示草稿确认**。
- vault 路径从 `OBSIDIAN_VAULT` env / `.claude/skills-config.json` / CLAUDE.md 发现;读不到直接问用户。
- 查 vault 历史用 /tcraft-obsidian-query(模块二,3-tier 省 token)。
