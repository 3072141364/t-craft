---
name: vault-query
description: "[TODO 占位·未实现] Obsidian vault 高效查询。每文档维护标签 + 一段全文概述;查询时按概述判相关性,无关跳过 / 弱相关只读概述 / 强相关精读全文,省 token。obsidian-kb 查询的省 token 策略。"
---

# Vault Query(占位 · TODO)

> **状态:占位,未实现。** 以下是设计意图,待开发。

## 定位

obsidian-kb 查询的**省 token 策略**:不每次读全文,按相关性分级读。核心想法(用户提出):每文档一段全文概述,查询时按概述判相关性,三级读。

## 将来做(to implement)

- [ ] **全文概述约定**:每张卡 / 方案 / 报告维护 `summary`(一行全文概述,放 frontmatter 或首段),写笔记时即守。
- [ ] **三级读策略**:查询时先按标签 + summary 判相关性 ->
  - **无关**:跳过,不读。
  - **弱相关**:只读 summary,判断是否要用。
  - **强相关**:精读全文。
- [ ] **查询流程**:标签/关键词缩小范围 -> 读候选的 summary 分级 -> 只精读强相关。
- [ ] 可能并入 obsidian-kb 查询模块,或独立 skill 供 obsidian-kb 调用(待定)。
- [ ] 配合 `卡片库.base`(按 card_type/project/status 过滤)先粗筛,再 summary 精筛。

## 与其他 skill 的关系

- 服务 obsidian-kb 的查询模块(模块三:文档查询)。
- brainstorm(阶段①查旧方案)、eval-report(查历史评估)都受益。
