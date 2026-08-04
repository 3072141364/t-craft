---
description: 查 Obsidian vault(省 token)。按标签/关键词粗筛,读 frontmatter summary 判相关性,3-tier 分级读(无关跳过/弱相关只读 summary/强相关精读全文)。/obsidian-query <查询词> = 查 vault 相关笔记。
argument-hint: <查询词>
---

触发 **obsidian-query** skill 的 3-tier 省 token 查询流程。

## 参数

- `<查询词>`(必填):要查什么,如 `/obsidian-query 之前怎么做认证`、`/obsidian-query PDF 导出踩坑`。

## 执行

调用 `obsidian-query` skill(同 plugin,obsidian-skills)。按其完整流程走:

1. **前置:发现 vault 与项目约定**——读 CLAUDE.md、探测标准位置、读可选描述文件、发现 vault 路径(`OBSIDIAN_VAULT` env / `.claude/skills-config.json` / CLAUDE.md);读不到就问用户,不猜路径。
2. **Step 1 粗筛**——按 card_type/tags/关键词缩小候选范围。无 CLI 用 `rg`;有 CLI 用 `obsidian search`。不读全文,只列候选。
3. **Step 2 按 summary 判相关性(3-tier 读)**——对每个候选读 frontmatter `summary`,判三级:
   - **无关**:跳过,不读全文。
   - **弱相关**:只读 summary,判断是否要用。
   - **强相关**:精读全文。
   summary 缺失则退化读首段,标注提示补充。
4. **Step 3 沿链接扩展**(可选)——对强相关笔记,看链向谁/谁链向它,新发现按 Step 2 分级。有 CLI 用 `obsidian backlinks`;无 CLI 用 `rg "[[笔记名]]"`。
5. **Step 4 汇总返回**——分级返回:强相关(标题+路径+summary+摘要)/ 弱相关(标题+路径+summary)/ 无关跳过(只列标题)。不倾倒全文,省 token。

## 约定

- **只读不改 vault**:查询不修改任何笔记。
- **省 token 是核心约束**:无关跳过,弱相关只读 summary,强相关才精读。
- **以项目文件实际内容为准**:vault 路径/约定从配置/CLAUDE.md 读,不凭记忆。
- **失败要明确**:读不到 vault 路径且用户未提供 → 停止并提示,不猜测路径。
