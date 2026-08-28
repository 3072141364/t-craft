---
description: 快速推荐 3-5 个分支名供审批,批准后切换。新建分支前用:基于当前 git 状态与分支命名规则出候选名,用户选定后切过去(受保护分支先切工作分支)。
argument-hint: [分支目标描述/需求名]
---

触发 `traft-git-flow` 的「切换分支」流程。

## 参数
- 无参数:对当前上下文(未提交变更/对话摘要)推荐候选分支名。
- `<分支目标描述>`(如 `/tcraft-branch 加导出 PDF`):针对该目标推荐候选名。

## 执行
读 `skill://traft-git-flow`,按「切换分支」流程走:

1. `git status` 看当前分支与未提交变更;有变更再 `git diff` 看内容。
2. **切前先问用户两个点**(不默认):
   - **基分支**:从当前分支切,还是从 `master`/`main` 切?(新功能通常基于主分支最新;当前分支有未合并的无关改动时,基于主分支更干净)
   - **是否拉最新**:要最新基线就先 `git fetch origin`(基于 `origin/<主>`)或 `git pull`(基于当前分支);不要就用本地现状。
3. `git branch -a` 列本地/远程分支,结合 `skill://traft-git-flow/references/branch-rules.md` 的命名规则产出 3-5 个候选名(每个附一句说明)。
4. 候选名 + 基分支 + 拉取选择一并展示审批;受保护分支或有未提交变更,确认是否带到新分支(`switch -c` 会带过去,不带则先 `git stash`)。
5. 执行:基于当前分支 `git switch <name>` / `git switch -c <name>`;基于主分支 `git switch -c <name> <基>`(如 `origin/main`);不自动 push,`git branch` + `git status` 核对。

每步输出草稿/结果给用户确认,不擅自改 git 状态。
