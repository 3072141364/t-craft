---
name: dev-flow
description: 研发流程调度器。接需求后编排整条研发流程,识别当前处于哪个阶段,激活对应 skill。六阶段:①头脑风暴→②方案设计→③实现→④审计/评估→⑤提交→⑥沉淀。当用户说"开始做个功能""走研发流程""我现在在哪个阶段""接下来该干嘛""接了个需求要从哪开始"等,或接到 feat/bugfix 要编排流程时使用。快速识别阶段(从 git 状态/对话推断),识别不了就问用户。调度器,不重复各 skill 内容。
---

# Dev Flow(研发流程调度器)

研发流程的**调度器**:识别当前阶段 → 激活对应 skill → 完成后提示进下一阶段。不重复各 skill 的内容,只做编排。

设计意图:接到需求后,用户可能不清楚"现在该干嘛、用哪个 skill"。dev-flow 是入口:识别阶段(或问用户),激活对应 skill,让流程顺畅流转。各阶段的具体工作交给对应 skill,dev-flow 只管"你在哪、该激活谁、下一步去哪"。

## 何时触发

**显式 + 意图匹配**。以下场景触发:

- 用户说"开始做个功能""走研发流程""接了个需求""从哪开始"等。
- 用户问"我现在在哪个阶段""接下来该干嘛"。
- 接到 feat/bugfix,要编排整条流程。
- 中途想确认进度、跳阶段。

**不触发**:

- 用户已明确要用某个具体 skill(直接调那个 skill,不走调度器)。
- 只是看代码/闲聊/跑单个命令。

## 前置:读取项目约定(不硬编码)

本 skill 跨项目复用。每次触发先发现项目约定:

1. **读项目 `CLAUDE.md`**:取项目分支模型、版本真源、make 命令、格式化命令、规范文档位置。若引用规范文档一并读。
2. **约定优于配置**:探测标准位置(根目录 `README.md`、`docs/`、`package.json` / `pyproject.toml` 等)。
3. **可选描述文件**:`.claude/skills-config.json` 显式覆盖。

以文件实际内容为准,不凭记忆。

## 六阶段映射表

调度核心。每个阶段 → 对应 skill/命令 → 产什么 → 下一阶段。

| 阶段 | 做什么 | 激活的 skill / 命令 | 产什么 | 下一阶段 |
|---|---|---|---|---|
| ① 头脑风暴 | 深挖需求、对齐真实意图 | `brainstorm` / `/brainstorm`(basic-skills) | 需求要点(对话内,不落盘) | ② |
| ② 方案设计 | 把需求落成规格化方案文档 | `spec-doc` / `/spec-doc`(code-skills) | 方案文档(落 vault) | ③ |
| ③ 实现 | 按方案逐步实现 | `karpathy-guidelines`(准则)+ `code-intelligence`(查调用链)+ `make-shortcut`(跑构建/测试)+ `code-format`(格式化) | 代码改动 | ④ |
| ④ 审计/评估 | 查问题、确认需求达成+无回归 | `/code-review`(双轴审查)+ `spec-doc` 评估段(后补) | 审查报告 + 评估报告 | ⑤ |
| ⑤ 提交 | 格式化→CHANGELOG→版本→commit→push | `git-flow`(basic-skills) | commit + push | ⑥ |
| ⑥ 沉淀 | 可复用设计/思路/踩坑沉淀成卡片 | `obsidian-kb`(obsidian-skills) | 知识卡片(落 vault) | (流程结束) |

阶段④的评估测试文档(`spec-doc` 评估段)目前是后补占位,未实现;阶段④当前主要走 `/code-review`。

## 阶段识别机制(核心)

### 优先推断,推断不了再问

dev-flow 的第一动作是**识别当前阶段**。按以下信号推断,能定就定,定不了或歧义就问用户。

**从 git 状态推断**:

```bash
git status          # 有无未提交改动
git diff --stat     # 改动规模
git log --oneline -5  # 最近提交
```

- 无改动 + 对话里刚给需求 → ① 头脑风暴。
- 有需求要点 + 无方案文档 → ② 方案设计。
- 有方案文档(vault 里 `项目/<名>/方案/` 有卡)+ 有未提交改动 → ③ 实现 或 ④ 审计。
- 改动完成(代码 + 测试都过)+ 未提交 → ④ 审计 → ⑤ 提交。
- 改动已提交 + 未沉淀 → ⑥ 沉淀。

**从对话上下文推断**:

- 用户刚说"接了个需求要做 X" → ①。
- brainstorm 刚产了需求要点 → ②。
- spec-doc 刚落了方案文档 → ③。
- 实现完一段代码 → ④。
- /code-review 过了 → ⑤。
- git-flow 提交完 → ⑥。

**推断不了或歧义 → 问用户**:

用 AskUserQuestion 列 6 阶段让用户选当前在哪:

> 我没把握你现在在哪个阶段。你在?
> - ① 头脑风暴(深挖需求)
> - ② 方案设计(写方案文档)
> - ③ 实现(写代码)
> - ④ 审计/评估(查问题+确认需求)
> - ⑤ 提交(格式化+CHANGELOG+commit)
> - ⑥ 沉淀(把可复用的记进知识库)

### 识别后告知

识别出阶段后,一句话告知用户当前阶段 + 即将激活的 skill:

> 当前在 ③ 实现阶段。激活 karpathy-guidelines(行为准则)+ code-intelligence(查调用链)+ make-shortcut(跑测试)+ code-format(格式化)。

## 激活与流转

### 激活对应 skill

识别阶段后,**调用对应 skill**(调它,不是重写其内容)。dev-flow 只负责告诉用户"现在用 X skill",并把上下文(需求要点/方案文档路径/改动范围等)传给该 skill。

### 完成后提示进下一阶段

该 skill 完成后,提示用户进下一阶段,给过渡提示词(对齐 workflow-prompts.md):

| 完成阶段 | 提示进下一阶段 |
|---|---|
| ① 头脑风暴完(需求要点确认) | "需求要点已确认。进 ②:用 /spec-doc 把方案落 vault。" |
| ② 方案设计完(方案文档确认) | "方案已落 vault。进 ③:按方案实现,用 karpathy-guidelines 准则 + code-intelligence 查调用链。" |
| ③ 实现完(代码+测试过) | "实现完。进 ④:先 /code-review 双轴审查,再 spec-doc 评估段(后补)确认需求达成。" |
| ④ 审计/评估过(审查+评估都过) | "审查+评估都过。进 ⑤:用 git-flow 提交(格式化→CHANGELOG→版本→commit→push)。" |
| ⑤ 提交完(commit+push) | "已提交。进 ⑥:用 obsidian-kb 把可复用设计/思路/踩坑沉淀成卡片。" |
| ⑥ 沉淀完 | "流程结束。" |

### 阶段可跳跃

用户要直接跳到某阶段就跳(如"我已经有方案了,直接实现"→跳到③)。dev-flow 不强制线性走,识别到用户在某阶段就以那为起点。

## 通用约定

- **调度器,非实现者**:dev-flow 不重复各 skill 的内容,只识别+激活+流转。具体工作交给对应 skill。
- **每步确认**:激活 skill 前告知用户即将激活谁;阶段流转时提示下一阶段。
- **以项目文件实际内容为准**:项目约定从 CLAUDE.md / 规范文档读,不凭记忆。
- **阶段可跳跃**:不强制线性,识别到用户在某阶段就以那为起点。
- **失败要明确**:识别不了阶段且用户未答,停止并等用户答,不硬猜。

## 附:参考来源

- 阶段衔接思想:mattpocock/skills `engineering/`(research → domain-modeling → implement → tdd → diagnosing-bugs → code-review)。mattpocock 是线性执行链,t-craft 是 6 阶段调度,弱参考。
- 6 阶段定义:本仓库 [docs/workflow-prompts.md](../../../docs/workflow-prompts.md)。
- 各阶段 skill:本仓库 brainstorm / spec-doc / karpathy-guidelines / code-intelligence / make-shortcut / code-format / code-review / git-flow / obsidian-kb。
