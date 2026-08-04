---
description: 研发流程调度器。识别当前处于 6 阶段(①头脑风暴→②方案设计→③实现→④审计/评估→⑤提交→⑥沉淀)的哪一阶段,激活对应 skill,完成后提示进下一阶段。/dev-flow = 识别当前阶段并激活;/dev-flow <阶段号或名> = 跳到指定阶段。
argument-hint: [阶段号或名]
---

触发 **dev-flow** skill 的研发流程调度。

## 参数

- 无参数:自动识别当前阶段(从 git 状态 + 对话上下文推断),识别不了就问用户。识别后告知阶段 + 即将激活的 skill。
- `<阶段号或名>`(如 `/dev-flow 3`、`/dev-flow 实现`):跳到指定阶段,直接激活对应 skill。

## 执行

调用 `dev-flow` skill(同 plugin,code-skills)。按其完整流程走:

1. **前置:发现项目约定**——读 CLAUDE.md、探测标准位置、读可选描述文件,以文件实际内容为准。
2. **识别阶段**(无参数时):
   - 从 git 状态推断(`git status` / `git diff --stat` / `git log`)。
   - 从对话上下文推断(刚给需求/刚产要点/刚落方案/实现完/审查过/提交完)。
   - 推断不了或歧义 → 用 AskUserQuestion 列 6 阶段让用户选。
3. **告知阶段 + 激活 skill**:一句话告知当前阶段 + 即将激活的 skill。把上下文(需求要点/方案文档路径/改动范围)传给该 skill。
4. **流转提示**:该 skill 完成后,提示进下一阶段,给过渡提示词。

## 六阶段速查

| 阶段 | 激活 |
|---|---|
| ① 头脑风暴 | brainstorm / `/brainstorm` |
| ② 方案设计 | spec-doc / `/spec-doc` |
| ③ 实现 | karpathy-guidelines + code-intelligence + make-shortcut + code-format |
| ④ 审计/评估 | `/code-review` + spec-doc 评估段(后补) |
| ⑤ 提交 | git-flow |
| ⑥ 沉淀 | obsidian-kb |

## 约定

- **调度器,非实现者**:不重复各 skill 内容,只识别+激活+流转。
- **阶段可跳跃**:不强制线性,用户要跳就跳。
- **以项目文件实际内容为准**:项目约定从 CLAUDE.md 读,不凭记忆。
- **每步确认**:激活 skill 前告知即将激活谁。
