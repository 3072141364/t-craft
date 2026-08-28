# Git 命令与知识速查(git-commands)

> traft-git-flow 的附属文档:git 操作命令参考。拉取/推送/同步代码、切分支、撤销、stash、rebase、冲突解决等场景读本文。分支命名与提交规范分别见 [branch-rules.md](branch-rules.md) 与 [commit-rules.md](commit-rules.md),此处只列命令。

## 核心概念

- **版本控制**:记录文件的修改历史。
- **分布式**:每个开发者本地都有一份完整仓库,不依赖服务器即可提交。
- **快照**:保存的是文件的快照,而非差异。
- **分支**:并行开发,互不影响。
- **合并**:把不同分支的修改合并到一起。
- **远程仓库**:把代码托管在服务器上,作为协作中枢。

## 工作流程(三区 + 远程)

| 区域 | 说明 | 进入方式 |
|---|---|---|
| 工作区 Working Directory | 你编辑的目录 | `checkout` 检出文件 |
| 暂存区 Stage | add 后待提交的变更 | `git add` |
| 本地仓库 Repository | 已提交的历史 | `git commit` |
| 远程仓库 Remote | 服务器托管 | `git push` / `fetch` |

数据流向:

```text
工作区 --git add--> 暂存区 --git commit--> 本地仓库 --git push--> 远程仓库
远程仓库 --git fetch/clone--> 本地仓库 --git checkout--> 工作区
远程仓库 --git pull(拉取并合并)--> 本地仓库 --git merge--> 工作区
```

## 安装与配置

安装:Windows 官网下载 <https://git-scm.com/download/win>;macOS `brew install git`;Linux `sudo apt install git`。

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.editor "code --wait"
git config --list          # 查看全部配置
```

## 基础操作

### 初始化 / 克隆 / 远程
```bash
git init                 # 初始化本地仓库
git clone <url>          # 克隆远程仓库
git remote -v            # 查看远程仓库
```

### 添加 / 提交
```bash
git add <file>           # 将文件加入暂存区
git add .                # 添加所有更改
git commit -m "<msg>"    # 提交到本地仓库
```

### 查看状态与历史
```bash
git status               # 查看工作区状态
git log                  # 查看提交历史
git log --oneline        # 精简提交历史
```

### 撤销操作
```bash
git restore <file>              # 撤销工作区更改(丢弃未暂存改动)
git restore --staged <file>     # 撤销暂存区更改(取消 add)
git reset HEAD <file>           # 取消暂存区文件(等价 restore --staged)
git reset --hard <id>           # 回退到指定版本(丢弃之后所有改动,慎用)
```

## 分支操作

```bash
git branch                       # 查看本地分支(* 标当前)
git branch <name>                # 创建分支
git switch <name>                # 切换分支(新命令)
git checkout <name>              # 切换分支(旧命令)
git merge <name>                 # 合并指定分支到当前分支
git branch -d <name>             # 删除分支(-D 强删未合并的)
```

分支管理关系:`feature` 分支开发完成 → 合并进 `dev` → 合并进 `main`(受保护分支只接收合并,不直接开发)。完整命名规范见 [branch-rules.md](branch-rules.md)。

## 远程仓库操作

```bash
git remote add origin <url>      # 关联远程仓库
git remote -v                    # 查看远程仓库
git push -u origin <branch>      # 推送分支并建立跟踪
git pull                         # 拉取并合并(等于 fetch + merge)
git pull origin <branch>         # 拉取指定分支更新
git fetch                        # 只获取远程更新,不合并
git remote remove origin         # 移除远程仓库
git push --force                 # 强制推送(会覆盖远程历史,慎用)
```

## 进阶操作

```bash
git stash                # 保存当前工作现场(临时搁置未提交改动)
git stash list           # 查看搁置的改动列表
git stash pop            # 恢复最近一次搁置的现场并删除该记录
git tag                  # 打标签(版本标记)
git cherry-pick <id>     # 摘取指定提交到当前分支
git rebase <branch>      # 变基(把当前提交重放到目标分支之上)
git revert <id>          # 撤销指定提交(生成新提交,安全,不丢历史)
git bisect start         # 二分查找引入问题的提交
```

## 常用 .gitignore 规则

```gitignore
# 忽略所有 .log 文件
*.log
# 忽略 node_modules 目录
node_modules/
# 只忽略根目录的 build
/build
# 忽略根目录的 dist
/dist/
# 忽略所有 .class 文件
*.class
# 忽略所有隐藏文件与 .DS_Store
.*
.DS_Store
# 反选:排除(不忽略)特定文件
!keep.log
```

规则要点:`/`开头只匹配仓库根目录;`目录/`结尾忽略整个目录;`!`取反重新包含。

## 提交规范(Conventional Commits)

格式:`<type>(<scope>): <subject>`。

| type | 用途 | 示例 subject |
|------|------|------|
| feat | 新增功能 | `add user login` |
| fix | 修复 bug | `submit bug` |
| docs | 文档更新 | `update README` |
| style | 代码格式,不影响功能 | `format code` |
| refactor | 重构,不改行为 | `optimize logic` |
| perf | 性能优化 | `cache lookup` |
| test | 添加测试 | `add unit test` |
| build | 构建系统/依赖 | `upgrade deps` |
| chore | 杂项,不影响 src 与 test | `update deps` |
| revert | 撤销变更 | `revert feat login` |

完整细则(emoji、body/footer、反例)见 [commit-rules.md](commit-rules.md)。

## 工作流模型

| 模型 | 结构 | 优点 | 适合 |
|------|------|------|------|
| 集中式 | 单主分支,开发者直接提交 | 简单 | 小团队、小项目 |
| 功能分支 | `main` + 每功能一个 `feature/*` 分支合并回主分支 | 清晰、隔离 | 合作项目 |
| Git Flow | `main` + `develop` + `feature`/`release`/`hotfix` 分层 | 通用、规则完备 | 大型项目、有发布周期 |
| Forking | 私有 fork → 提 PR → 上游合并 | 开源友好 | 开源/社区项目 |

## 常用别名配置

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline"
git config --global alias.last "log -1 HEAD"
git config --global alias.rb rebase
git config --global alias.unstage "reset HEAD --"
```

## 冲突解决流程

合并/拉取产生冲突时:

1. `git pull`(或 merge / rebase)触发冲突。
2. 打开冲突文件,手动解决标记(`<<<<<<<` / `=======` / `>>>>>>>`)区段。
3. `git add <file>` 标记已解决。
4. `git commit`(rebase 场景用 `git rebase --continue`)。

原则:**改完文件 → add → commit**,三步走,不跳过任何一步。rebase 冲突时也可 `git rebase --abort` 放弃本次变基。
