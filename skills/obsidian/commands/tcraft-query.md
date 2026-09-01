---
description: 查询 vault 知识库/文档。从 project/area/resource/weekly/archive 检索并按证据回答。
argument-hint: [查询语句]
---

用 `grep -rl` 搜索 vault（`.md`），命中后读相关路径再综合回答。

**规则**（证据接地）：
1. 先 `grep -rl "关键词" /path/to/vault` 检索，得到路径。
2. 读命中页再回答；答案注明出处（`路径`）。
3. 无命中 → 明确说"vault 中没有相关内容"，不编造。
4. 检索输出是证据，不是答案；禁止凭 snippet 脑补整页内容或伪造引用。
