---
name: dev-flow
description: 研发流程调度器——从 git 状态 / 对话推断你在六阶段的哪一环,激活对应 skill 并提示下一步。何时用:说"开始做个功能 / 走研发流程 / 接了个需求从哪开始 / 我现在在哪个阶段 / 接下来该干嘛",或接到 feat/bugfix 要编排整条流程时。六阶段:①头脑风暴(brainstorm)→②方案(project-doc 出 prd/adr)→③实现(code-guidelines)→④验证(影响面评估→全量测试→全量评估→修复→冒烟)→⑤发布(提交→合并主分支→SemVer 版本升级→上线)→⑥沉淀。它只做默认行为不会主动做的编排——识别阶段、串起各 skill、同步 progress.md 状态,不重复各 skill 内容。识别不了就问用户,不硬猜。
---

# Dev Flow(研发流程调度器)

研发流程的**调度器**:识别当前阶段 → 激活对应 skill → 完成后提示进下一阶段。不重复各 skill 的内容,只做编排。

设计意图:接到需求后,用户可能不清楚"现在该干嘛、用哪个 skill"。dev-flow 是入口:识别阶段(或问用户),激活对应 skill,让流程顺畅流转。各阶段的具体工作交给对应 skill,dev-flow 只管"你在哪、该激活谁、下一步去哪"。

> **双线定位**:dev-flow 是 t-craft **开发线**的调度中枢(需求→代码→发布);与之并行的是 **调研线**(`paper-study`:调研论文 + 调研技术)。两线独立推进,在**周报三流**(开发/论文/技术)汇合。dev-flow 不调度调研线;知识大脑 `obsidian-kb` 横贯两线(沉淀 + 快答)。

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
| ① 头脑风暴 | 接需求、讨论清楚真实意图/约束/验收 | `/tcraft-brainstorm`(命令,读 code-guidelines 附属文档 brainstorm.md)+ obsidian-kb 模块二(查旧方案) | 需求要点 + 需求文件夹 + progress.md(①) | ② |
| ② 方案设计 | 形成 prd 文档(+ 关键决策 adr) | `/tcraft-project-doc`(命令,读 project-doc skill 附属文档 prd.md / adr.md) | prd + adr(落 vault),progress(②) | ③ |
| ③ 实现 | 按方案开发;**动态调整 prd、补记 adr** | `code-guidelines`(编码总入口:查语言激活 `<lang>-guidelines`)+ code-intelligence(查调用链)+ project-doc(更新 prd / 补 adr) | 代码改动,progress(③) | ④ |
| ④ 验证 | 两档:影响面评估 → 全量测试 → 全量评估 → 修复完善 → 冒烟 | `/tcraft-code-review impact`(影响面)→ make-shortcut / test(全量)→ `/tcraft-code-review full`(全量评估)→ code-guidelines(修复)→ 冒烟;project-doc(test.md / review.md) | test.md + review.md 结论,progress(④) | ⑤ |
| ⑤ 发布 | 提交 → 合并主分支 → 版本升级 → 上线 | `git-guidelines`(commit + merge + 版本升级) | 已上线 + 版本升级,progress(⑤) | ⑥ |
| ⑥ 沉淀 | 可复用设计/思路/踩坑提炼进 skill 仓库 | `obsidian-kb`(obsidian-skills) | 知识提炼,progress(⑥) | (流程结束) |

### 阶段④验证:两档体系

验证分**两档**——全面档(全量测试 + 全量评估)是主体,轻量档(影响面评估 + 冒烟测试)在两头:

| 档位 | 测试 | code-review |
|------|------|-------------|
| 轻量档 | 冒烟测试(关键路径快速验) | 影响面评估(`/tcraft-code-review impact`) |
| 全面档 | 全量测试(`make test` 全量) | 全量评估(`/tcraft-code-review full`) |

**流程**:

1. **影响面评估**(轻):`/tcraft-code-review impact`(配 code-intelligence 影响面),确认改动影响哪些模块/调用链、不破坏其他功能。开发完第一步。
2. **全量测试**(重):make-shortcut 路由 `make test` / `make lint`,project-doc 落 `test.md` 结论。
3. **全量评估**(重):`/tcraft-code-review full` 双轴(Standards / Spec),project-doc 落 `review.md`。
4. **修复完善**:按 review 结论用 code-guidelines 修改,逐条确认解决。
5. **冒烟测试**(轻):发布前最后一道,只跑改动关键路径(全量已过,验证修复没引入新问题),通过才进发布。

> ④是验证循环:全量评估不过就停在「修复完善→冒烟」,直到全绿才进发布。

### 阶段⑤发布的子步骤

1. **提交**:`git-guidelines`(格式化 → CHANGELOG → commit → push)。
2. **合并主分支**:合入受保护分支(master/main),走 PR / 受保护分支规则。
3. **版本升级**:**特定合并触发**——发布到主分支的合并,按本次变更类型递增 SemVer(见「版本升级规则」),`git-guidelines` 执行。
4. **上线**:打 tag / release(发版流程见 git-guidelines)。

### 版本升级规则(特定合并触发)

合入主分支的发布合并,根据 PR / 本次提交的变更类型递增版本(版本真源从项目探测,见 git-guidelines 前置):

| 变更类型 | 递增 | 示例 |
|---------|------|------|
| BREAKING / 破坏性 | MAJOR +1 | `1.2.3 -> 2.0.0` |
| feat(新功能,向后兼容) | MINOR +1 | `1.2.3 -> 1.3.0` |
| fix / 其他 | PATCH +1 | `1.2.3 -> 1.2.4` |

- 由 **git-guidelines** 执行(改版本真源 + CHANGELOG 发版收尾 + tag),dev-flow 只触发。
- 初始开发(0.y.z)的破坏性变更走 MINOR;是否升级由用户确认,不擅自改。

### 需求进度同步

每个阶段完成、提示进下一阶段时,更新对应需求的 `progress.md` 的 `status`(obsidian-kb 附属文档 progress.md:状态真源,接六阶段)。阶段①建需求文件夹时同步建 progress.md;此后每流转一阶段改一次 `status`。

### 周维度:周报(不在六阶段内)

dev-flow 管**需求维度**;周报是**时间维度**的独立动作,不由六阶段调度:

- **每周起点**:用 obsidian-kb 建当周周记卡(`weekly/周记 <YYYY>-W<ww>.md`,规则见其附属文档 weekly.md),列三流(开发/论文/技术)计划。
- **本周中**:每完成一件事,先更新对应需求 progress.md,再在周报加 todo 项 + 沉淀指针。周报只链 progress,不重复记状态。
- **每周终点**:未完成项移入下周计划;本周归档。

## 每个环节的 skill 地图

| 环节 | 用的 skill / 命令 |
|------|-------------------|
| 头脑风暴 / 需求深挖 | `brainstorm`(code-guidelines 附属文档) |
| 查旧方案 / 历史 | `obsidian-kb`(模块二 query) |
| 方案 / prd / adr / test / review 文档 | `project-doc`(独立 skill,含 4 篇附属文档) |
| 编码 | `code-guidelines`(总入口)→ 查语言激活 `python/cpp/bash-guidelines` |
| 前端 / Web(demo / 小 SaaS / 汇报单页报告) | `web-guidelines`(轻量入口,3 篇附属:app-ui-design / design-craft / report-rendering) |
| 代码理解 / 调用链 / 影响面 | `code-intelligence`(code-guidelines 附属文档) |
| 跑构建 / 测试 / 格式化 | `make-shortcut`(code-guidelines 附属文档)+ 语言 format.md |
| 代码审查 | `/tcraft-code-review` |
| 提交 / 合并 / 版本升级 / 上线 | `git-guidelines` |
| 需求状态 | `progress.md`(obsidian-kb) |
| 周报 / 沉淀 | `obsidian-kb` |

## 阶段识别机制(核心)

### 优先推断,推断不了再问

dev-flow 的第一动作是**识别当前阶段**。按以下信号推断,能定就定,定不了或歧义就问用户。

**从 git 状态推断**:

```bash
git status          # 有无未提交改动
git diff --stat     # 改动规模
git log --oneline -5  # 最近提交
git branch --merged # 是否已合入主分支
```

- 无改动 + 对话里刚给需求 → ① 头脑风暴。
- 有需求要点 + 无 prd → ② 方案设计。
- 有 prd(vault `projects/<名>/requirements/<需求名>/prd.md`)+ 有未提交改动 → ③ 实现。
- 代码完成 + 测试没跑/没落 test.md → ④ 验证(从影响评估开始)。
- review.md 已落 + 未合并主分支 → ⑤ 发布(提交 → 合并 → 版本升级)。
- 已合并上线 + 未沉淀 → ⑥ 沉淀。

**从对话上下文推断**:

- 用户刚说"接了个需求要做 X" → ①。
- brainstorm 刚产了需求要点 → ②。
- project-doc 刚落了 prd → ③。
- 实现完一段代码 → ④。
- /tcraft-code-review 过了、冒烟过 → ⑤。
- git-guidelines 合并上线完 → ⑥。

**推断不了或歧义 → 问用户**:

用 AskUserQuestion 列 6 阶段让用户选当前在哪:

> 我没把握你现在在哪个阶段。你在?
> - ① 头脑风暴(讨论需求)
> - ② 方案设计(写 prd)
> - ③ 实现(开发,动态调整 prd / 补 adr)
> - ④ 验证(影响面评估 / 全量测试 / 全量评估 / 修复 / 冒烟)
> - ⑤ 发布(提交 / 合并主分支 / 版本升级 / 上线)
> - ⑥ 沉淀(提炼可复用知识)

### 识别后告知

识别出阶段后,一句话告知用户当前阶段 + 即将激活的 skill:

> 当前在 ③ 实现阶段。激活 code-guidelines:先查改动语言激活对应语言 guideline(Python/C++/bash),配 karpathy 行为准则、make-shortcut 跑测试;开发中动态调整 prd、补 adr 走 project-doc;查调用链读 code-intelligence。

## 激活与流转

### 激活对应 skill

识别阶段后,**调用对应 skill**(调它,不是重写其内容)。dev-flow 只负责告诉用户"现在用 X skill",并把上下文(需求要点/方案文档路径/改动范围等)传给该 skill。

### 完成后提示进下一阶段

该 skill 完成后,提示用户进下一阶段,给过渡提示词(对齐 workflow-prompts.md):

| 完成阶段 | 提示进下一阶段 |
|---|---|
| ① 头脑风暴完(需求要点确认) | "需求要点已确认。建需求文件夹 + progress.md(status ①),进 ②:用 /tcraft-project-doc 把方案落 prd(关键决策落 adr)。" |
| ② 方案设计完(prd 确认) | "prd 已落,progress.md 更新为 ②方案。进 ③:按方案实现,走 code-guidelines;开发中动态调整 prd、补记 adr 走 project-doc。" |
| ③ 实现完(代码完成) | "实现完,progress.md 更新为 ③实现。进 ④:先评估影响面,再全量测试、/tcraft-code-review、修复、冒烟。" |
| ④ 验证过(影响面确认 + 全量测试过 + review 过 + 冒烟过) | "验证全绿,progress.md 更新为 ④验证。进 ⑤:git-guidelines 提交 → 合并主分支 → 版本升级 → 上线。" |
| ⑤ 发布完(合并上线 + 版本升级) | "已上线,progress.md 更新为 ⑤发布。进 ⑥:用 obsidian-kb 把可复用设计/思路/踩坑提炼进 skill 仓库,更新 progress.md 为 ⑥沉淀。" |
| ⑥ 沉淀完 | "流程结束。" |

### 阶段可跳跃

用户要直接跳到某阶段就跳(如"我已经有方案了,直接实现"→跳到③)。dev-flow 不强制线性走,识别到用户在某阶段就以那为起点。

## 通用约定

- **调度器,非实现者**:dev-flow 不重复各 skill 的内容,只识别+激活+流转。具体工作交给对应 skill。
- **先列 TodoWrite 再执行(硬规则)**:走研发流程时,凡 **≥3 个步骤** 的活(跨阶段编排、一个阶段内多动作)动手前先用 `TodoWrite` 列待办,一次一项 `in_progress`、完成即 `completed`。阶段流转本身就是天然的 todo 边界——识别阶段后把该阶段的动作拆成 todo 项。让流程可见、可追踪。
- **每步确认**:激活 skill 前告知用户即将激活谁;阶段流转时提示下一阶段。
- **以项目文件实际内容为准**:项目约定从 CLAUDE.md / 规范文档读,不凭记忆。
- **阶段可跳跃**:不强制线性,识别到用户在某阶段就以那为起点。
- **失败要明确**:识别不了阶段且用户未答,停止并等用户答,不硬猜。

## 附:参考来源

- 阶段衔接思想:mattpocock/skills `engineering/`(research → domain-modeling → implement → tdd → diagnosing-bugs → code-review)。mattpocock 是线性执行链,t-craft 是 6 阶段调度,弱参考。
- 6 阶段定义:本仓库 [docs/workflow-prompts.md](../../../docs/workflow-prompts.md)。
- 各阶段 skill:本仓库 code-guidelines(编码总入口,附属文档含 brainstorm、code-intelligence)/ project-doc(独立子 skill,含 prd/adr/test/review)/ code-review / git-guidelines / obsidian-kb(progress.md 状态同步)。
