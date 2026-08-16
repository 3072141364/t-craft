---
name: project-doc
description: 项目文档统一管理(离码文档,落 Obsidian vault)。研发流程阶段②④的文档环节。当用户要写方案/需求/PRD/spec、记录设计决策、写测试文档、产出评估审查报告时使用,按类型读对应附属文档:prd(需求/方案规格)、adr(关键设计决策)、test(测试计划+结论)、review(评估审查);需求状态接 obsidian-kb 的 progress.md。落盘走 obsidian-kb,模板在其 assets/templates/。与 git-guidelines(随码文档)对仗:git-guidelines 管仓库内文档,本 skill 管 vault 离码文档。
---

# Project Doc(项目文档统一管理)

项目文档是**离码文档**——与 `git-guidelines` 的随码文档(readme/changelog/commit/branch)对仗:落在 vault 的需求文件夹,代码仓库只留指针。

**附属文档**(渐进披露,按文档类型读):

- [references/prd.md](references/prd.md) -- 需求/方案规格:骨架(用户读 + AI 须知)、流程、HARD-GATE。写方案 / 需求 / PRD 时读。
- [references/adr.md](references/adr.md) -- 设计决策记录:一决策一张、备选与后果。记决策时读。
- [references/test.md](references/test.md) -- 测试计划 + 结论。写测试时读。
- [references/review.md](references/review.md) -- 评估审查:需求达成确认 + 回归。阶段④产出评估时读。

## 五类项目文档一览

| 文档 | 是什么 | 阶段 | 落点 | 模板(skill 仓库) | 规则 |
|------|--------|------|------|-------------------|------|
| **prd** | 需求/方案规格(用户读 + AI 须知) | ② | `projects/<名>/requirements/<需求名>/prd.md` | obsidian-kb `assets/templates/prd.md` | [references/prd.md](references/prd.md) |
| **adr** | 关键设计决策(一个决策一张,追加) | ②(实现前) | `.../adr.md` | obsidian-kb `assets/templates/adr.md` | [references/adr.md](references/adr.md) |
| **test** | 测试计划 + 结论 | ③④ | `.../test.md` | obsidian-kb `assets/templates/test.md` | [references/test.md](references/test.md) |
| **review** | 评估审查(需求达成确认 + 回归) | ④ | `.../review.md` | obsidian-kb `assets/templates/review.md` | [references/review.md](references/review.md) |
| **progress** | 需求状态真源(接 dev-flow 六阶段) | ①→⑥ | `.../progress.md` | obsidian-kb `assets/templates/progress.md` | obsidian-kb `references/progress.md` |

## 文档间的关系

```
① brainstorm  → 需求要点 + 建需求文件夹 + progress.md(①头脑风暴)
② project-doc → prd.md + adr.md,progress → ②方案
③ 实现        → progress → ③实现;动态调 prd、补 adr
④ 验证        → 影响评估 + 全量测试(test.md)+ review(review.md)+ 修复 + 冒烟,progress → ④验证
⑤ 发布        → 提交 + 合并主分支 + 版本升级 + 上线,progress → ⑤发布
⑥ 沉淀        → 可复用知识提炼进 skill 仓库,progress → ⑥沉淀
```

- **prd 是需求规格,adr 是决策,test/review 是证据**,progress 是状态——各自归位,不互相复制。
- 周报记「事情」只链 progress,不重复记状态(obsidian-kb `references/weekly.md`)。

## 何时触发

- 写方案 / 需求 / PRD / spec → **prd.md**
- 记录设计决策、权衡 → **adr.md**
- 写测试计划 / 测试结论 → **test.md**
- 需求达成确认 / 回归影响评估 → **review.md**
- 需求状态流转 → **progress.md**(obsidian-kb)

## 通用约定(所有项目文档)

- **落盘走 obsidian-kb**:不自行写 vault 文件,保证 frontmatter / 路径 / 双链合规。
- **每步确认**:落盘前展示草稿给用户确认。
- **以项目文件实际内容为准**:项目约定从 CLAUDE.md / 规范文档读,不凭记忆。
- **不擅自进实现**:prd 确认前不写代码。
- **按读者分章**:prd 用户读主体 + AI 须知,不混杂。
- **失败要明确**:读不到 vault 路径 / 关键约定,停止并提示。

## 附:参考来源

- 规格化结构(problem/solution/user stories/implementation decisions/testing decisions/out of scope):mattpocock/skills `to-spec`。
- 落盘路径与模板:本仓库 obsidian-kb skill + `assets/templates/`。
- HARD-GATE:obra/superpowers `brainstorming` + 本仓库 code-guidelines 附属文档 brainstorm.md。
- 目标驱动(步骤指向可验证目标):本仓库 code-guidelines 附属文档 karpathy-guidelines.md。
