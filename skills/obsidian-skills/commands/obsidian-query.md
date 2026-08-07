---
description: 查 Obsidian vault(省 token)。按标签/关键词粗筛,读 frontmatter summary 判相关性,3-tier 分级读(无关跳过/弱相关只读 summary/强相关精读全文)。/obsidian-query <查询词> = 查 vault 相关笔记。
argument-hint: <查询词>
---

触发 **obsidian-query** skill(同 plugin,obsidian-skills)的 3-tier 省 token 查询流程。

## 参数

- `<查询词>`(必填):要查什么。如 `/obsidian-query 之前怎么做认证`、`/obsidian-query PDF 导出踩坑`。

## 执行

按 obsidian-query skill 完整流程走(发现 vault → 粗筛 → 按 summary 3-tier 分级读 → 沿链接扩展 → 分级返回),不复述于此。约定:只读不改 vault、省 token 是核心约束、读不到 vault 路径则停止并提示不猜测。
