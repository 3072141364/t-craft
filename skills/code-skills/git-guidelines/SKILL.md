---
name: git-guidelines
description: 按项目规范执行 Git 工作流(带 CHANGELOG / gitmoji / 分支命名约定)。何时用:做任何 git 操作时进这里——它比裸 git 多的是流程编排与规范:"提交 / commit"→扫描变更 + 格式化 + 更新 CHANGELOG + gitmoji 提交信息 + 推送一条龙;"切 / 新建分支"→按项目分支模型给命名建议再建;"更新 changelog / 收尾 unreleased / 发版整理变更"→按 Keep a Changelog + 附属 references/changelog.md;"撤销 / 回退"→在 restore/reset/revert 里选对;还覆盖合并 / 冲突 / tag 发版 / stash / rebase / cherry-pick / bisect / .gitignore / readme。分支与提交规范先读项目 CLAUDE.md,gitmoji 向 obsidian-kb emoji-helper.md 查。
---

# Git Guidelines

整个 Git 体系的通用准则 + 可执行工作流。两个层次:**知识层**(概念、命令、决策表,回答"该用哪个命令")与**流程层**(切分支、提交代码两个高频工作流)。**附属文档**(渐进披露,用到才读):

- [references/commit.md](references/commit.md) -- commit 写作细则:格式、type 选择、原子提交原则、body/footer 用法、反例。起草 commit message 时读它。
- [references/changelog.md](references/changelog.md) -- CHANGELOG 维护细则:格式、类别 emoji、条目写作、追加/发版收尾/批量整理。写 CHANGELOG 时读它。
- [references/branch.md](references/branch.md) -- 分支命名规范:分支模型语义表、命名规则(`<类型>/<简短描述>`)、切出基线、操作命令。切分支 / 起分支名时读它。
- [references/readme.md](references/readme.md) -- README 写作细则:门面定位、结构(快速开始为正文)、与 CLAUDE.md/CHANGELOG 分工。写 / 更新 README 时读它。

## 何时触发

- **切分支**:"切分支""切换分支""新建分支""开个分支"等。
- **提交代码**:"提交代码""提交一下""commit""提交并推送"等。
- **维护 CHANGELOG**:"更新 changelog""写变更记录""整理本次改动""把 unreleased 收尾""发版了整理变更"等 -- 按附属文档执行。
- **写 README**:"写 readme""更新 readme""补项目说明"等 -- 按附属文档执行。
- **Git 操作咨询/执行**:撤销、回退、合并、冲突、stash、rebase、cherry-pick、tag、远程、别名、.gitignore、配置等。

不要在用户只是查看文件、做普通编辑、闲聊时触发。

## 核心概念:四区模型

所有 Git 操作都发生在这四个区域之间,想清楚"改动现在在哪个区、要去哪个区",命令就不用背:

```
工作区 --git add--> 暂存区 --git commit--> 本地仓库 --git push--> 远程仓库
(Working Dir)      (Stage/Index)         (Repository)            (Remote)
     ^--git restore-- ^--git reset HEAD--   ^--git revert/reset-- ^--git pull/fetch--
```

- **快照而非差异**:commit 保存的是文件快照,不是增量 diff。
- **分布式**:每个开发者本地都有完整仓库(含全部历史),离线可提交。
- **HEAD**:指向当前分支最新 commit 的指针;`git status` 的三种输出对应改动的三个位置:
  - `Changes not staged for commit`:改动在工作区,需 `git add`。
  - `Changes to be committed`:改动在暂存区,需 `git commit`。
  - `nothing to commit, working tree clean`:可 push。

## 前置:读取项目约定(不硬编码)

本 skill 跨项目复用。每次触发先发现项目约定:

1. **读项目 `CLAUDE.md`**:提取分支模型(分支类型、保护规则、是否 squash merge)、格式化命令、CHANGELOG 规则、远程仓库名称。若引用了规范文档(如 `docs/development.md`),一并读。
2. **约定优于配置**:CHANGELOG 探测根目录 `CHANGELOG.md`;格式化命令探测 `Makefile`。
3. **可选描述文件**:`.claude/skills-config.json` 之类显式覆盖。

以文件实际内容为准,不凭记忆。项目未指定时用默认:

- 分支类型:`feat`(新功能)/ `bugfix`(修未发布缺陷)/ `hotfix`(修已发布缺陷,从 tag 切)。
- 受保护分支:`master`/`main` 禁直推。
- 格式化:项目 `make format` 或等价命令。

**协作分工**:
- 附属文档 [references/commit.md](references/commit.md)(commit 细则)、[references/changelog.md](references/changelog.md)(CHANGELOG 细则)、[references/branch.md](references/branch.md)(分支命名规范)、[references/readme.md](references/readme.md)(README 细则):本 SKILL.md 只留要点,细则用到才读。
- commit/PR 标题的 emoji 向 obsidian-kb 附属文档 emoji-helper.md 查询(路径 `../../obsidian-skills/obsidian-kb/references/emoji-helper.md`)。
- 提交前格式化命令的发现走 `code-guidelines` 的附属文档 make-shortcut(本 plugin 内)。

## 流程一:切分支

### 1. 收集分支命名素材
- **用户口述**:用户描述了要做什么。
- **当前代码变更**:若用户未明说,用 `git status` 和 `git diff` 推断用途。

### 2. 给出 3-5 个分支名备选
按附属文档 [references/branch.md](references/branch.md) 的命名规则生成 `<类型>/<简短描述>` 备选(前缀小写、英文连字符、可附 issue 编号、纯 ASCII 不加 emoji),生成 3-5 个不同侧重,用 AskUserQuestion 呈现。

### 3. 创建分支
用户选定后:
- **feat / bugfix**:从受保护分支最新状态切出。`git fetch origin`,`git checkout master && git pull`,`git checkout -b <选定分支名>`。
- **hotfix**:从对应版本 tag 切出(询问用户基于哪个版本),`git checkout -b <分支名> v<版本>`。

### 注意
- 若当前在受保护分支且有未提交变更,创建分支前确认是否带到新分支(`checkout -b` 会带过去)。
- 不自动 push 新分支,除非用户要求。

## 流程二:提交代码

**顺序**:扫描变更 -> 格式化 -> (CHANGELOG) -> 提交 -> 推送(确认)。

### 1. 扫描代码变更
```bash
git status
git diff            # 工作区 vs 暂存区
git diff --cached   # 暂存区 vs 最近 commit
git log --oneline -5
```
据此判断变更性质(新功能/修复/重构/文档/构建),用于 commit type 选择。

### 2. 格式化代码
先询问用户是否格式化(默认建议是)。跑项目格式化命令(从 CLAUDE.md / Makefile 读,或走 `code-guidelines` 附属文档 make-shortcut 路由)。格式化改动纳入本次提交。

### 3. 更新 CHANGELOG(项目要求时)
若项目 CLAUDE.md 要求 CHANGELOG(探测到 `CHANGELOG.md` 即视为要求),**读附属文档 [references/changelog.md](references/changelog.md)** 按其「流程一:追加变更到 [Unreleased]」执行:把步骤 1 的变更摘要分类起草、展示确认后写入。若变更纯属格式化/重构等无行为影响,可不写条目但告知用户。

### 4. 提交
- `git add` 相关文件。
- **读附属文档 [references/commit.md](references/commit.md)** 起草 commit message:格式 `<emoji> <type>(<scope>): <subject>`、type 选择、原子提交原则。要点:一次提交只做一件事,message 写「为什么」而非罗列改了什么;type->emoji 完整映射向 obsidian-kb 附属文档 emoji-helper.md 查询。示例:`✨ feat(config): 新增配置加载模块`。

展示确认后 `git commit`。

### 5. 推送(需确认)
提交完成后,**推送前必须再次确认**(推送是外部副作用)。用 AskUserQuestion 询问"是否推送到 origin"。
- 同意:`git push`(新分支未设上游用 `git push -u origin <分支名>`)。
- 不同意:停在本地,告知已提交未推送。

### 注意
- 若当前在受保护分支,提醒"禁直推,请先切工作分支",引导走流程一。
- 若 git 未配置 user.name/email,提示配置(见「配置与别名」)。
- 不自动创建 PR(本流程只到 push);可提示用户去托管平台创建 PR。PR 保持小而聚焦,大 PR 难审且易藏 bug。

## 流程三:合并上线与版本升级

**顺序**:合并主分支 -> 版本升级(特定合并触发)-> 打 tag 上线。每步确认。

### 1. 合并主分支
- 合入受保护分支(master/main),走 PR + review,**不直推**。
- 合并前确保:当前分支通过验证(测试 + review)、无未提交改动、基于主分支最新(`git fetch && git merge origin/master`)。
- 合并用 squash(默认)或 merge,以项目 CLAUDE.md 为准。

#### Peer review(可选环节,项目 CLAUDE.md 声明则强制)
- 默认流程不强制 peer review(单人 / 小项目可自行合并);但部分项目在 CLAUDE.md 声明有 peer review 环节,此时**未经人工审批不得合并主分支**,即使分支验证全绿也必须等 reviewer 通过。
- 声明方式:项目 CLAUDE.md 的「合并 / 发布约定」段写明「合并主分支需 peer review 审批」。
- 执行时:读项目 CLAUDE.md 判断是否声明该环节;声明了就提示用户找 reviewer 审批,不自动合并;未声明则按默认流程走。

### 2. 版本升级(特定合并触发)
**合入主分支的发布合并,按本次变更类型递增 SemVer**(版本真源从项目探测:`version.json` / `pyproject.toml` / `package.json`):

| 变更类型 | 递增 | 示例 |
|---------|------|------|
| BREAKING / 破坏性 | MAJOR +1 | `1.2.3 -> 2.0.0` |
| feat(新功能,向后兼容) | MINOR +1 | `1.2.3 -> 1.3.0` |
| fix / 其他 | PATCH +1 | `1.2.3 -> 1.2.4` |

- 从合并进来的提交类型判断(commit type / PR 标签)。
- **只做版本号递增**(改版本真源),发版收尾的 CHANGELOG `[Unreleased]` 转正按附属文档 [references/changelog.md](references/changelog.md) 的「流程二:发版收尾」。
- 递增前展示草稿确认;初始开发(0.y.z)的破坏性变更走 MINOR。

### 3. 打 tag 上线
- `git tag -a v<x.y.z> -m "Release <x.y.z>"`,推送 tag 前确认(见「tag 与发版 git 操作」)。
- 上线动作(部署/发布)按项目规范执行。

## 分支模型与命名

分支语义、命名规则、切出基线与操作命令见附属文档 [references/branch.md](references/branch.md)。要点:分支类型默认 `feat/bugfix/hotfix`(项目 CLAUDE.md 的模型优先)、分支名纯 ASCII 不加 emoji、feat/bugfix 从受保护分支切、hotfix 从 tag 切。

## 远程协作

```bash
git remote add origin <url>     # 关联远程仓库
git remote -v                   # 查看远程
git remote rename old new       # 重命名
git remote remove origin        # 移除
git push -u origin <branch>     # 推送并设上游(首次)
git fetch origin                # 只取回更新,不动工作区(安全)
git pull                        # fetch + merge(可能有冲突)
git push --force                # 强推(慎用;改写公共历史前必须团队确认)
```

**fetch 与 pull 的取舍**:想先看看远程发生了什么再决定,用 `fetch`(配合 `git diff origin/<branch>` 对比);确定要同步进当前分支,用 `pull`。`git fetch origin <branch>:<local>` 可把远程分支拉到本地新分支而不切换。

## 撤销与找回:选对命令

先问「改动在哪一层、要不要保留历史」:

| 场景 | 命令 | 说明 |
|------|------|------|
| 丢弃工作区修改 | `git restore <file>`(旧写法 `git checkout -- <file>`) | 未 add 的改动没了就没了 |
| 取消暂存(保留工作区) | `git restore --staged <file>`(旧写法 `git reset HEAD <file>`) | 改动退回工作区 |
| 回退已提交(协作安全) | `git revert <id>` | 生成一个反向 commit,不改写历史,**公共分支首选** |
| 回退到指定版本(本地) | `git reset --soft\|--mixed\|--hard <id>` | 见下表 |
| 找回"丢了"的提交 | `git reflog` | 记录 HEAD 的每次移动,reset 过头也能找回 |

reset 三种模式:

| 模式 | HEAD | 暂存区 | 工作区 |
|------|------|--------|--------|
| `--soft` | 回退 | 保留 | 保留(改动聚在暂存区,适合重新 commit) |
| `--mixed`(默认) | 回退 | 回退 | 保留(改动退回工作区) |
| `--hard` | 回退 | 回退 | 回退(**丢弃全部改动,慎用**) |

原则:**已推送的公共历史用 revert,不用 reset --hard / force push**。

## 进阶操作

```bash
git stash                        # 保存工作现场(切分支前手头有活)
git stash list                   # 查看现场列表
git stash pop                    # 恢复最近现场并删除记录
git stash drop <stash@{n}>       # 删指定现场;git stash clear 清空
git cherry-pick <id>             # 把指定提交"复制"到当前分支(hotfix backport)
git rebase <branch>              # 变基:把本分支提交挪到目标分支顶端(线性历史)
git revert <id>                  # 撤销指定提交(安全)
git bisect start                 # 二分查找引入 bug 的提交
```

**merge 与 rebase 的取舍**:要保留真实分支拓扑、给协作留痕,用 merge;要干净的线性历史、分支是私人未推送的,用 rebase。**不 rebase 已推送的公共分支**。

## 冲突解决流程

1. `git pull`(或 merge)后 Git 提示冲突文件(`git status` 里的 `both modified`)。
2. 打开冲突文件,处理 `<<<<<<<` / `=======` / `>>>>>>>` 标记:保留该留的,删标记。
3. `git add <file>` 标记已解决。
4. `git commit` 完成合并(rebase 冲突则是 `git rebase --continue`)。
5. **解决后必须测试**再继续;和改动涉及者沟通,避免同类冲突反复。

## .gitignore

```text
*.log              # 忽略所有 .log
node_modules/      # 忽略目录
doc/*.txt          # doc 下的 txt(不含子目录)
doc/**/*.txt       # doc 下所有(含子目录)txt
.env               # 环境配置
.DS_Store          # 系统文件
!README.md         # 取反:即使匹配前面的规则也不忽略
```

注意:已被跟踪的文件不受 .gitignore 影响,需先 `git rm --cached <file>`。仓库级通用忽略(编辑器、系统文件)放全局 `~/.config/git/ignore` 或 `core.excludesFile`,不塞进项目。

## 配置与别名

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --list                     # 查看配置(--local/--global/--system 分层)
git config --global alias.st status   # 别名:st=status, co=checkout, br=branch, ci=commit
git help <command>                    # 命令手册;git help -a 列全部命令
```

多项目不同身份时,去掉 `--global` 在仓库内单独配置。

## tag 与发版 git 操作

发版时 CHANGELOG 收尾(`[Unreleased]` 转正)按附属文档 [references/changelog.md](references/changelog.md) 的「流程二:发版收尾」执行;本节只管 git 对象(tag 不可变,**每步确认**):

```bash
git tag -a v<x.y.z> -m "Release <x.y.z>"    # 打附注 tag(轻量 tag 不带信息,发版用附注)
git tag                                     # 列 tag;git show v<x.y.z> 看详情
git push origin v<x.y.z>                    # 推单个 tag(需确认)
git tag -d v<x.y.z>                         # 删本地 tag(未推送前)
git checkout -b release/<x> v<x.y.z>        # 从 tag 建 release 分支(hotfix backport 用)
```

tag 一旦推送不得修改;需修订则发新 tag。

## 工作流模型

| 模型 | 特点 | 适用 |
|------|------|------|
| 集中式工作流 | 大家都推 main,简单直接 | 单人 / 小项目 |
| 功能分支工作流 | 每个功能独立分支 + PR review | 多数团队默认 |
| Git Flow | main/develop/feature/release/hotfix 全套,规范但重 | 大项目、多版本并行维护 |

项目用哪种以 CLAUDE.md 为准;没说就按功能分支工作流理解,不必强套 Git Flow。

## 通用约定

- **每步确认**:涉及外部动作(commit、push、tag)前,展示将要做的操作给用户确认,不擅自执行。
- **以项目规范为准**:分支模型、格式化命令、CHANGELOG 要求以 CLAUDE.md 实际内容为准,启动时读取,不凭记忆。
- **改写历史要克制**:公共分支只 revert 不 reset/force push;私人分支 rebase 自由。
- **失败要明确**:git 命令出错就停下并告知,不继续后续步骤。

## 附:命令速查

```bash
# 日常
git status && git diff && git log --oneline -5
git add <files> && git commit -m "<emoji> <type>(<scope>): <subject>"

# 切分支
git fetch origin && git checkout master && git pull
git switch -c feat/<desc>                # feat/bugfix 从受保护分支
git switch -c hotfix/<desc> v<ver>       # hotfix 从 tag

# 远程
git push -u origin <branch>              # 确认后
git fetch origin && git diff origin/<branch>   # 先看再合

# 撤销
git restore <file>                       # 弃工作区修改
git restore --staged <file>              # 取消暂存
git revert <id>                          # 协作安全撤销
git reflog                               # 找回丢失提交

# 现场 / 挑提交
git stash && git stash pop
git cherry-pick <id>

# tag(发版,每步确认)
git tag -a v<x.y.z> -m "Release <x.y.z>"
git push origin v<x.y.z>
```
