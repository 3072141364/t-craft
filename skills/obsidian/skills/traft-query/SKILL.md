---
name: traft-query
description: vault 检索/查询技能。从 obsidian vault 的 project/area/resource/weekly/archive 快速检索知识、项目离码文档、研究笔记、周报，并按证据接地回答问题。何时触发:"查一下"、"找一找"、"回忆"、"想看某主题"、"当时怎么定的"、"检索"。
---

# 查询 vault 知识库

从 vault 的 `.md`（`project/` 项目、`area/` 知识领域、`resource/` 资源、`weekly/` 周报、`archive/` 归档）中检索并回答。

## 流程
1. **检索**：调用 `ob-query` 工具，`query` 给自然语言关键词；可加 `folder` 限定子目录、`top` 控制结果数（默认 5）。返回带 frontmatter 元数据（type/置信度/状态/项目/标签）+ `summary`。
2. **渐进披露（先摘要，再展开）**：先读每条结果的 `summary` 与元数据判断相关性——相关才 `read` 全文；不相关直接跳过，不读整篇。
3. **综合回答**：基于读到的内容回答；注明出处（`vault 相对路径`）与置信度。

## 规则（证据接地）
- **先检索再回答**；检索输出是候选路径，不是答案本身。
- **注明出处**：每条要点标来源路径；无法定位到页的表述给"来自 X 主题"级说明。
- **禁止编造**：不伪造引用、引文、页码、日期；检索无命中就说"vault 中没有相关内容"。
- **区分已定/未定**：项目文档里的决策/需求以 `project/` 下 prd/adr/progress 为准；任务以 `project/<项目>/` 下带 `task` tag 的 note 为准。

## 边界
- 只读查询；要新增/修改 vault 文档，走 `traft-obsidian`（写入规范）。
- 检索不到 ≠ 没有；可换英文/近义词/`folder` 范围重试一次后再报无。
