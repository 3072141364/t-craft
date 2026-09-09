---
name: traft-code-git
description: 代码仓库管理规范。帮助用户处理 分支命名、commit编辑、更新changelog更新、readme更新 问题时激活该技能。示例:"我要切换分支，推荐一组备选分支名", "根据当前改动，给出合适的commit信息", "更新changelog", "更新readme文档", "拉取、推送、同步代码", "使用git工具"。
---

# traft-code-git 技能

代码仓库管理：分支切换、commit、changelog、readme、推送/同步、冲突解决、发版标签、重置基线。具体规则在参考文档中，遵循**渐进式披露**——用到哪个规则才去参考文档查阅，不一次性加载。

**职责边界**：
- 负责：git 操作流程与审批——切分支、commit 建议、changelog/readme 更新、推送、冲突解决、发版标签、重置基线。
- 不负责：格式化/测试等 make 命令（`traft-code-make`）、代码审查结论（`traft-code-review`）。提交由用户触发，本技能不主动提交。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 切分支 | "我要切换分支，推荐一组备选分支名" | 触发 |
| commit | "根据当前改动，给出合适的commit信息" | 触发 |
| 文档更新 | "更新changelog"、"更新readme文档" | 触发 |
| 同步代码 | "拉取、推送、同步代码"、"使用git工具" | 触发 |
| 格式化/测试 | "跑下测试"、"格式化" | 不触发，转交 `traft-code-make` |
| 闲聊/泛泛提问 | "随便聊聊" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. 用户要求切新分支时，明确背景（用户口述 + 当前未提交变更 `git status` / `git diff`），给出 3-5 个备选，用户审批通过再切换。若当前在受保护分支且有未提交变更，创建前确认是否带到新分支（`switch -c` 会带过去）。
2. 不改变 git 状态的命令允许直接执行，如 `git status` / `git diff` / `git log` 等；会改变 git 状态的命令打印出来给用户审批。
3. 规则渐进式披露：用到哪个规则，去 3.1 对应参考文档查阅，不一次性加载。

### 2.2 禁止执行(NEVER DO)
1. 不自动 push 新分支，除非用户要求。
2. 破坏性操作（`--hard` 重置等）不审批不执行。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：git 状态（用户口述 + `git status` / `git diff`）。
- 缺失时：未提交变更未知 → 先查 `git status` / `git diff`，不凭口述操作。

## 3. 知识底座（CONTEXT）

### 3.1 规则文档（渐进披露，用到再读）

| 功能定位 | 文档 |
| --- | --- |
| 分支模型语义与命名规则 | `references/branch-rules.md` |
| commit 信息编辑规范 | `references/commit-rules.md` |
| changelog 更新规范 | `references/changelog-rules.md` |
| readme 更新规范 | `references/readme-rules.md` |
| git 操作命令参考 | `references/git-commands.md` |

### 3.2 常见流程（详见 4. 工作流程）
切换分支 / 扫描代码变更 / 代码推送（常规 + amend）/ 解决冲突 / 发版标签 / 重置基线。
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### 流程 A: 切换分支
- 动作：`git status` 看当前分支与未提交变更 → 切前先问两点（**基分支**：从当前分支切还是从 `master`/`main` 切；**是否拉最新**：`git fetch origin` / `git pull` 或本地现状）→ `git branch -a` 结合 `references/branch-rules.md` 产出 3-5 个候选名 → 用户审批候选名 + 基分支 + 拉取选择；受保护分支或有未提交变更，确认是否带到新分支（不带则先 `git stash`）→ 执行（基于当前：`git switch` / `git switch -c`；基于主分支：`git switch -c <name> <基>`）→ `git branch` + `git status` 核对。
- 完成标志：已切到目标分支，基分支与拉取选择经用户确认。

### 流程 B: 扫描代码变更
- 动作：`git status` 看变更/未跟踪文件 → `git diff` / `git diff --staged` / `git diff HEAD` 看内容 → 按意图分组（每提交只做一件事，参考 `references/commit-rules.md`）→ 产出 commit message，格式 `<emoji> <type>(<scope>): <subject>`。
- 完成标志：变更已分组，commit message 产出。

### 流程 C: 代码推送
- 动作：`git status` 确认无未提交变更 → `git pull --rebase` 拉取最新 → 将执行的命令打印给用户审批（新分支 `git push -u origin <branch>`；已有分支 `git push`）。
- IF amend（把遗漏改动并入 HEAD）→ `git add` + `git commit --amend [--no-edit]`；若上次提交已推送则需强制推送：`git push origin --force-with-lease`（推荐）/ `--force`（慎用）；协作分支上优先用一次新提交，不建议 amend。
- 完成标志：推送完成且经用户审批；`git log --oneline -3` + `git status` 核对。

### 流程 D: 解决冲突
- 动作：识别冲突（`<<<<<<<` 标记 / `git status` Unmerged paths）→ VS Code 内逐块选择保留侧（Accept Current / Incoming / Both）或命令行 `git checkout --ours/--theirs <file>`（**rebase 语义相反**：`--ours` 是基底、`--theirs` 是你重放的提交）→ 处理完 `git add` → 提交（merge/pull：`git merge --continue`；rebase：`git rebase --continue`）；放弃用 `git merge --abort` / `git rebase --abort`。
- 完成标志：冲突全部解决并提交；`git log --oneline -3` + `git status` 核对。

### 流程 E: 发版标签
- 动作：确认版本号与目标提交（默认当前 HEAD）→ 按 `references/changelog-rules.md` 更新 CHANGELOG → 提交 changelog 后打附注标签 `git tag -a v<X.Y.Z> -m "<msg>"` → `git push origin v<X.Y.Z>`（或 `git push --tags`）。
- 完成标志：标签已打并推送；整改已发布标签先 `git tag -d` + `git push origin :refs/tags/...` 再重打。

### 流程 F: 重置基线
- 动作：`git status` 确认无未提交变更（`--hard` 会丢弃，先 `git stash` 或确认放弃）→ `git fetch origin` → 确认目标基线（`origin/<branch>` / 提交 id / tag）→ 选择重置模式并打印给用户审批：`--soft`（留暂存区）/ `--mixed`（默认，留工作区）/ `--hard`（彻底丢弃）。
- 完成标志：重置完成且经审批；`git log --oneline -3` + `git status` 核对。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
## 待审批命令
<将执行的 git 命令，逐条列出>
## 审批后执行
<结果核对：git log --oneline -3 / git status>
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 待审批命令 | 改变 git 状态的命令必须列出等审批；只读命令直接跑 |
| 结果核对 | 用 `git log`/`git status` 实际输出确认，不口述 |

### 5.3 交付前自检
- [ ] 改变 git 状态的命令已打印给用户审批
- [ ] 未自动 push（除非用户要求）
- [ ] 破坏性操作（--hard 等）已审批
- [ ] 规则按需查阅参考文档，未一次性加载

## 6. 示例

### 6.1 好的示例
**输入**：我要切个分支做订单导出
**输出**：
```text
## 待审批命令
git switch -c feat/order-export origin/main
备选名: feat/order-export / feat/export-csv / feature/order-export（详见 branch-rules）
```
（先出候选 + 基分支 + 审批，再执行）

### 6.2 差的示例
**输入**：我要切个分支做订单导出
**输出**：直接 `git checkout -b export` 执行，无候选名、无基分支确认、未审批。
（违反 2.1①——出候选、审批通过才切）
