---
name: spec-doc
description: 标准文档生成 skill,支持研发链路两种规格文档:①方案文档(开发前,把需求落成规格化设计方案,落 Obsidian vault)②评估测试文档(开发后,后补,给 peer review)。当用户要写方案/设计文档/PRD/spec、把需求或头脑风暴结果落成文档、brainstorm 后要落方案、要规格化需求文档时使用。与 brainstorm 接力:brainstorm 产需求要点(对话内),本 skill 接过要点生成方案文档(落盘)。
---

# Spec Doc(标准文档生成)

研发链路的文档生成 skill,支持两种规格文档:

| 形态 | 时机 | 产什么 | 状态 |
|---|---|---|---|
| **方案文档** | 开发前(阶段②) | 规格化设计方案,用户读主体 + AI 须知 | ✅ 本实现 |
| **评估测试文档** | 开发后(阶段④,`/code-review` 后) | 需求达成确认 + 回归影响 + 测试结论,给 peer review | ⚠️ 后补(见「形态二」占位) |

设计意图:研发链路里,需求要点(阶段① brainstorm,对话内)→ **方案文档(阶段②,本 skill 落盘)** → 实现(阶段③)→ 评估测试文档(阶段④,本 skill 后补)。文档是规格化的参考物,落 Obsidian vault,代码仓库只留指针。

## 何时触发

**显式 + 意图匹配**。以下场景触发:

- 用户要写方案/设计文档/PRD/spec:"把方案写下来""落个方案文档""写设计文档""要个 spec"。
- brainstorm 后落方案:需求要点已对齐,要落成正式文档。
- 要规格化需求文档:把含糊需求整理成可参考的规格物。

**不触发**:

- 还在深挖需求阶段(走 brainstorm,产出要点后再来本 skill)。
- 只看代码/闲聊/跑测试。
- 代码审查(走 `/code-review`)。

## 前置:读取项目约定(不硬编码)

本 skill 跨项目复用。每次触发先发现项目约定:

1. **读项目 `CLAUDE.md`**:提取模块布局、技术栈、规范文档位置、分支与提交规则。若引用规范文档一并读。
2. **约定优于配置**:探测标准位置(根目录 `README.md`、`docs/`、`package.json` / `pyproject.toml` 等)。
3. **可选描述文件**:`.claude/skills-config.json` 显式覆盖。
4. **读 obsidian-kb 的 vault 约定**(文档要落 vault):方案卡片路径 `项目/<名>/方案/`、模板见 `obsidian-kb/assets/templates/方案卡片.md`、`card_type:方案`。vault 路径从 `OBSIDIAN_VAULT` env / `.claude/skills-config.json` / CLAUDE.md 发现(详见 obsidian-kb skill)。

以文件实际内容为准,不凭记忆。

**可调用的子 skill**:`obsidian-kb`(obsidian-skills plugin 内)落盘方案文档、`brainstorm`(basic-skills)产需求要点(若上游未走)、`fireworks-tech-graph` 生成方案设计图。

## 形态一:方案文档(开发前)

### 定位

接过 brainstorm 的**需求要点**(目标/约束/验收标准/相关旧方案/范围外),或用户直接给的需求描述,**不重新采访**——只综合已对齐的内容(to-spec 思想:synthesis not interview)。产出规格化方案文档,落 vault。

### 骨架(按读者分章)

文档分两块读者:**用户读**(自己与同事)的主体内容,与**AI 读**(便于更好实现)的须知。候选方案/权衡是头脑风暴过程,不进文档——文档只记**最终方案 + 优缺点**。

```markdown
---
title: <方案名>
card_type: 方案
project: <项目名>
status: 草稿
date: <日期>
tags: []
aliases: []
---

# 📋 <方案名>

<!-- 用户读:自己与同事 -->

## 需求背景
清晰的问题陈述:用户面临什么问题,为什么值得解决,从用户视角。
含:目标一句话 + 成功标准(可量化)。

## 方案设计
**最终选定的方案**(不搬候选过程)。
- **设计描述**:怎么做。模块/接口/架构/API 契约/schema 变更。
  不含具体文件路径或代码片段(易过时);例外:prototype 产出的状态机/reducer/schema/type shape 可内联,标注来自 prototype。
- **方案设计图**(按需,增加表现力):需要架构/流程/泳道/C4 图时,联动 fireworks-tech-graph 生成 PNG,存 `项目/<名>/附件/`,嵌入 `![[图名.png]]`。图名带语义(如 `认证方案-架构图.png`)。不需要图就不画,不强行加。
- **方案优缺点**:pros/cons,直说。

## 项目收益
为什么值得做:价值/收益/达成什么。可量化。把"值得"讲清楚。

## 行动清单
怎么一步步做:阶段拆解/实现步骤序列。每步指向可验证目标(借 karpathy 的目标驱动:"步骤X -> 验证:[检查]")。
给用户看的怎么做,不是给 AI 的任务粒度。

## 验收标准
逐条可检查的完成判据:做了什么算做完。每条能验。
此节是阶段④ eval-report 逐条确认需求达成的依据。

<!-- AI 读:便于更好实现 -->

## AI 须知
写给 AI 的实现约束,统筹以下内容:
- **范围外**:明确不做什么,防蔓延。AI 实现时不越界。
- **代码变更清单**:改动模块/文件类、新增 vs 修改、依赖关系。开发前是预判(基于方案设计);开发中/后补全(实际改了哪些,可借 code-intelligence `detect_changes` / gitnexus `impact` 看真实影响)。
  | 模块/文件类 | 新增/修改 | 说明 | 依赖 |
  |---|---|---|---|
- **测试决策**:测哪些模块、用什么 seam(优先既有 seam、用最高 seam、理想一个)、prior art(代码库里类似测试)。只测外部行为不测实现细节。
- **其他实现约束**:项目 CLAUDE.md 的硬约束(保护分支、格式化命令、提交规范等)在「前置」读到后,摘要列此,AI 实现时遵守。
```

### 流程

1. **取输入**:读 brainstorm 产出的需求要点(对话内,若上游走过);否则从用户当前需求描述取。不重新采访。
2. **探索代码库**(若未探索):读相关代码/CLAUDE.md,用项目领域词表(若 vault 有 CONTEXT.md 词表)。尊重相关 ADR。
3. **勾测试 seam**:草拟测试切入点(优先既有、最高 seam),与用户确认(to-spec:check seams with user)。确认后写进「AI 须知」的测试决策。
4. **起草方案文档**:按上述骨架,按读者分章。用项目领域词,不写 boilerplate。
5. **落盘**:调 obsidian-kb 写到 `项目/<名>/方案/<方案名>.md`,`card_type:方案`,用方案卡片模板(模板已同步为本骨架)。代码仓库留指针(`> 方案见 Obsidian: [[方案名]]`)。
6. **自审**(借 brainstorm/to-spec spec 自审):扫占位(TBD/TODO/空节)/矛盾(节间冲突)/歧义(可两种解读)/范围(是否需拆成子方案);修完再交付,不复审。
7. **用户审**:交付后请用户审 spec 文件,要改则改 + 重跑自审。

### HARD-GATE

方案文档用户确认前,不进实现、不写代码。这条适用于每个方案——"简单"方案也要落文档(可短,但必须落 + 确认),因为简单处正是未经检验假设造成浪费的地方。

### AI 须知节的设计意图

把写给 AI 的约束统筹进一节,而非散落在文档里:用户读主体(背景/方案/收益/行动/验收)时不会被实现约束打断;AI 实现时聚焦读「AI 须知」拿到范围外、变更清单、测试决策、项目硬约束。读者意图分明,文档清爽。

## 形态二:评估测试文档(后补 · TODO)

> **状态:占位,未实现。** 以下是设计意图,待开发。

### 定位

开发完成、`/code-review` 后,产出评估/测试报告给 peer review:确认需求达成 + 无回归 + 列测试结论。与 `/code-review` 互补——code-review 查问题,本段确认达成。

### 将来做(to implement)

- [ ] **需求实现确认**:逐条对照方案文档的验收标准,确认做了、做对了。
- [ ] **回归影响评估**:用 code-intelligence(gitnexus `impact` / `detect_changes`)评估改动影响范围,确认不破坏其他功能。对照方案文档「AI 须知」的代码变更清单(预判 vs 实际)。
- [ ] **测试结论**:跑了哪些测试(`make test` / `make lint`,走 make-shortcut)、通过情况、覆盖了什么、缺什么。对照方案文档「AI 须知」的测试决策。
- [ ] **产出报告**:存 vault `项目/<名>/评估/<版本或主题>.md`(card_type:评估报告);含需求确认表 + 影响范围 + 测试结论 + 结论(可发布/需修)。
- [ ] 联动 obsidian-kb(存报告)、code-intelligence(影响分析)、make-shortcut(跑测试)、spec-doc 方案文档(对照验收标准与 AI 须知)。

## 通用约定

- **每步确认**:落盘前展示方案文档草稿给用户确认。
- **以项目文件实际内容为准**:项目约定从 CLAUDE.md / 规范文档读,不凭记忆。
- **不擅自进实现**:方案文档确认前不写代码。
- **落盘走 obsidian-kb**:不自行写文件到 vault,调 obsidian-kb 落盘,保证 frontmatter/路径/双链合规。
- **保持简洁**:不啰嗦,不写 boilerplate,用项目领域词。
- **按读者分章**:用户读主体 + AI 须知,不混杂。
- **失败要明确**:读不到 vault 路径/关键约定,停止并提示。

## 附:参考来源

- 规格化结构(problem/solution/user stories/implementation decisions/testing decisions/out of scope):mattpocock/skills `to-spec`。
- 方案文档落点(`项目/<名>/方案/`、`card_type:方案`、配图联动 fireworks):本仓库 obsidian-kb skill + `assets/templates/方案卡片.md`。
- spec 自审(占位/矛盾/歧义/范围)+ HARD-GATE:obra/superpowers `brainstorming` + 本仓库 brainstorm skill。
- 目标驱动(步骤指向可验证目标):本仓库 karpathy-guidelines skill。
