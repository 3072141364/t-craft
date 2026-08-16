---
description: 项目文档统一入口(研发阶段②/④)。把需求要点或一句话需求落成规格化文档到 Obsidian vault:prd(需求/方案规格)、adr(设计决策)、test(测试)、review(评估审查);需求状态接 progress.md。按文档类型读 project-doc skill 的附属文档(prd/adr/test/review)。无参数 = 对当前需求落 prd;`/tcraft-project-doc prd|adr|test|review` = 指定类型。
argument-hint: [prd | adr | test | review | 一句话需求]
---

触发 code-guidelines 附属文档 **project-doc.md** 的项目文档流程。这是研发流程阶段②(方案设计)的入口,阶段④评估也由此接(见 review)。

## 参数

- 无参数:对当前对话中已对齐的需求(或 brainstorm 产出的需求要点)落 **prd**(需求/方案文档)。若对话里还没有需求,先问用户"要落什么方案"。
- `prd` / `adr` / `test` / `review`:指定文档类型,读对应附属文档执行。
- `<一句话需求>`(如 `/tcraft-project-doc 给导出加 PDF 格式`):对该需求落 prd(若需求含糊,提示先走 brainstorm 深挖)。

## 执行

读 project-doc skill 的 `SKILL.md`(路径 `../tcraft-project-doc/SKILL.md`)选类型,再读其附属文档(路径 `../tcraft-project-doc/references/{prd,adr,test,review}.md`)。核心流程:

1. **前置:发现项目约定**——读项目 CLAUDE.md、探测标准位置、读 obsidian-kb 的 vault 约定(需求 prd 路径/模板),以文件实际内容为准。
2. **取输入**(prd)——读 brainstorm 产出的需求要点(若上游走过);否则从用户给的需求描述取。不重新采访。
3. **起草**——按对应类型文档的骨架;prd 按读者分章(用户读 + AI 须知),候选方案/权衡是头脑风暴过程,不进文档。
4. **落盘**——调 obsidian-kb 写 `projects/<名>/requirements/<需求名>/<对应文档>.md`(模板在 skill 仓库 `assets/templates/`),prd 落盘时把 progress.md status 改为 `②方案`。代码仓库留指针(`> 方案见 Obsidian: [[需求名]]`)。
5. **自审**——扫占位/矛盾/歧义/范围,修完再交付。
6. **用户审**——交付后请用户审,要改则改 + 重跑自审。

## 约定

- **HARD-GATE**:prd 用户确认前不进实现、不写代码。
- **不重新采访**:综合已对齐内容,不再问一轮需求问题(需求含糊则提示先走 brainstorm)。
- **落盘走 obsidian-kb**:不自行写文件到 vault。
- **以项目文件实际内容为准**:项目约定从 CLAUDE.md / 规范文档读,不凭记忆。
