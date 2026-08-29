---
name: traft-git-flow
description: 代码仓库管理规范。帮助用户处理 分支命名、commit编辑、更新changelog更新、readme更新 问题时激活该技能。示例:"我要切换分支，推荐一组备选分支名", "根据当前改动，给出合适的commit信息", "更新changelog", "更新readme文档", "拉取、推送、同步代码", “使用git工具”。
---

# ALWAYS DO
- 用户要求切新分支时，明确背景(用户口述 + 当前未提交变更`git status` / `git diff`)，给出3-5个备选，用户审批通过再切换。若当前在受保护分支且有未提交变更,创建前确认是否带到新分支(`switch -c` 会带过去)。
- 不改变git状态的命令允许直接执行，如`git status` / `git diff` / `git log`等，会改变git命令打印出来给用户审批。

# NEVER DO
- 不自动 push 新分支,除非用户要求。


# 规则文档
traft-git-flow是管理git项目的技能，具体的规则在参考文档中，遵循渐进式披露原则，不要一次性加载，用到哪个规则就去参考文档中查阅。


| 功能定位 | 文档 | 
| --- | --- | --- |
| 分支模型语义与命名规则 | `references/branch-rules.md` | 
| commit 信息编辑规范 | `references/commit-rules.md` | 
| changelog 更新规范 | `references/changelog-rules.md` |
| readme 更新规范 | `references/readme-rules.md` |
| git 操作命令参考 | `references/git-commands.md` | 


## 常见工作流程

### 切换分支

目的:切到目标分支;新建分支时先定**基分支**与**是否拉最新**,再出候选名审批后动手。

1. `git status` 看当前分支与未提交变更;有变更再 `git diff` 看内容。
2. **切前先问两个点**(不默认):
   - **基分支**:从当前分支切,还是从 `master`/`main` 切?新功能通常基于主分支最新;当前分支有未合并的无关改动时,基于主分支更干净。
   - **是否拉最新**:要最新基线就先 `git fetch origin`(基于 `origin/<主>`)或 `git pull`(基于当前分支);不要就用本地现状。
3. `git branch -a` 列本地/远程分支,结合 `references/branch-rules.md` 命名规则产出 3-5 个候选名。
4. 用户审批候选名 + 基分支 + 拉取选择;受保护分支或有未提交变更,确认是否带到新分支(`switch -c` 会带过去,不带则先 `git stash`)。
5. 执行:
   - 基于当前分支:`git switch <name>`(已存在)/ `git switch -c <name>`(新建)。
   - 基于主分支:`git switch -c <name> <基>`(如 `git fetch origin` 后的 `origin/main`)。
6. `git branch` + `git status` 核对结果。

### 扫描代码变更

目的:梳理工作区未提交改动,为下一步 commit 归类。

1. `git status` 看变更/未跟踪文件。
2. `git diff` 看未暂存;`git diff --staged` 看已暂存;`git diff HEAD` 看相对上次提交的全部变更。
3. 按意图分组,每提交只做一件事(功能/修复/文档/重构),参考 `references/commit-rules.md`。
4. 产出 commit message,格式 `<emoji> <type>(<scope>): <subject>`。

### 代码推送

目的:把本地提交推到远程。按「NEVER DO」,推送前必须用户确认。分两种方式,常规推送与「追加到上次提交后强制推送」。

#### 方式一:常规推送(正常新提交 / 上次提交未推送)

1. `git status` 确认无未提交变更(有则先提交)。
2. `git pull --rebase`(或 `git pull`)拉取远程最新,避免推送被拒。
3. 把将执行的命令打印给用户审批:新分支 `git push -u origin <branch>`;已有分支 `git push`。
4. 冲突时按「解决冲突」流程处理。

#### 方式二:追加到上次提交后强制推送(amend)

目的:把遗漏/新产生的改动并入最近一次提交(HEAD),避免产生一条琐碎的二次提交。会改写本地历史,若上次提交已推送远程则需强制推送。

1. `git status` 看未暂存/未跟踪变更;`git diff` 看内容,确认这些改动确实属于上一次提交(而非新功能)。
2. `git add <file>`(或 `git add .`)暂存要并入的改动。
3. `git commit --amend [--no-edit]` 把暂存区改动并入 HEAD 提交并生成新的提交 id:
   - 默认会打开编辑器让你改 commit message。
   - `--no-edit` 保留原 message 不变。
   - `--amend` 只作用于最近一次提交(HEAD);要改更早的提交用 `git rebase -i`。
4. 若上次提交尚未推送远程,到此结束(`git log --oneline -3` 核对即可)。若已推送,改写的历史与远程不一致,需强制推送:
   - `git push origin --force-with-lease`(推荐,比 `--force` 安全:仅当远程仍是本地已知状态时才覆盖)。
   - `git push origin --force` 无条件覆盖,可能覆盖别人新推的提交,慎用。
5. `git log --oneline -3` + `git status` 核对结果。

风险提示:上次提交已推送且可能有同事基于它继续工作时不建议 amend——改写历史会让他们的提交失效。协作分支上优先用一次新提交。

### 解决冲突

目的:合并/拉取/变基产生冲突时,手动收敛为一次干净提交。一般在 VS Code 内解决。

1. 识别冲突:冲突文件内出现 `<<<<<<<` / `=======` / `>>>>>>>` 标记;`git status` 的 Unmerged paths 列出冲突文件。
2. VS Code 内解决:
   - 打开冲突文件,顶部/行内出现「接受当前更改 / 接受传入更改 / 接受两者」(Accept Current / Incoming / Both)按钮,逐块点选保留哪侧。
   - 想一次全用自己的或对方的:命令面板/右键选「Accept All Current」(全用自己的)或「Accept All Incoming」(全用对方的)。
   - 保存文件后该文件冲突被标记为已解决。
3. 命令行「全用自己的 / 全用对方的」(不习惯 GUI 时):
   - `git checkout --ours <file>` 保留 merge 场景当前分支(自己)的版本
   - `git checkout --theirs <file>` 保留 merge 场景被合并进来(对方)的版本
   - 全量处理:`git checkout --ours .` / `git checkout --theirs .`
   - 「rebase 语义相反」:rebase 中 `--ours` 是基底分支、`--theirs` 才是你重放的提交,用反会丢自己的改动。
   - 处理完 `git add <file>`(或 `git add .`)。
4. 全部解决后提交:
   - merge/pull:`git merge --continue`(或 `git commit`)
   - rebase:`git rebase --continue`
5. 放弃本次合并/变基:`git merge --abort` / `git rebase --abort`。
6. `git log --oneline -3` + `git status` 核对结果。

### 发版标签

目的:给发布版本打 tag。版本遵循 SemVer,changelog 先更新。

1. 确认版本号与目标提交(默认当前 HEAD)。
2. 按 `references/changelog-rules.md` 更新 CHANGELOG,新增版本条目。
3. 提交 changelog 变更后打附注标签:`git tag -a v<X.Y.Z> -m "<msg>"`。
4. `git push origin v<X.Y.Z>`(或 `git push --tags`)推送标签。
5. 整改已发布标签:先 `git tag -d v<X.Y.Z>` + `git push origin :refs/tags/v<X.Y.Z>`,再重打。

### 重置基线

目的:把当前分支重置到目标基线(远程最新/指定提交/tag),丢弃本地多余提交。破坏性操作,必须先审批。

1. `git status` 确认是否有未提交变更——`--hard` 会丢弃,先 `git stash` 或确认放弃。
2. `git fetch origin` 拉取远程最新状态。
3. 确认目标基线:`origin/<branch>` / 提交 id / tag。
4. 选择重置模式并打印给用户审批:`--soft`(变更留暂存区)、`--mixed`(默认,变更留工作区)、`--hard`(彻底丢弃,与基线一致)。
5. `git log --oneline -3` + `git status` 核对结果。


