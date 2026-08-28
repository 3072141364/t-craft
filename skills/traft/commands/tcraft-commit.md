---
description: 推荐 3-5 个 commit message 候选(默认只 header);加 --body 含 body(为什么这么改/决策上下文)。基于当前未提交变更按 commit 规范出候选,不提交。
argument-hint: [--body]
---

触发 `traft-git-flow` 的「扫描代码变更」流程,按 `references/commit-rules.md` 出候选。

## 参数
- 无参数:基于当前未提交变更出 3-5 个候选,**只含 header**(`<emoji> <type>(<scope>): <subject>`)。
- `--body`(或 `body`):候选额外含 body--为什么这么改、决策上下文、备选方案为何不选。

## 执行
1. `git status` 看未提交/未跟踪文件;`git diff` 看未暂存,`git diff --staged` 看已暂存,`git diff HEAD` 看全部。
2. 按意图分组,每候选只做一件事(feat / fix / docs / refactor / ...),参考 `skill://traft-git-flow/references/commit-rules.md` 选 type + emoji + scope + subject(祈使句、一行说清)。
3. 出 3-5 个候选 header,每个附一句依据;`--body` 时给每个候选补 body(决策上下文:为什么用这方案、放弃哪些备选)。
4. 展示给用户选;只在用户确认后用于 `git commit`,本命令不提交、不 push、不自动执行。

拿不准 type 时:用户能感知 -> feat/fix;只有维护者能感知 -> refactor/chore/build;纯格式 -> style;同一改动多 type 沾边选主要意图,更该拆提交。
