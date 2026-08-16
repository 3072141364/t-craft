# 分支命名规范(branch)

> git-guidelines 的附属文档:分支模型语义与命名规则。切分支、起分支名、评分支规范时读本文。项目 CLAUDE.md 的模型优先,未指定用本文默认。

## 分支模型(通用语义)

项目 CLAUDE.md 有分支模型就以它为准;没有时用这套默认:

| 分支 | 语义 | 切出基线 | 合回 |
|------|------|---------|------|
| `master`/`main` | 生产,随时可部署 | -- | develop / hotfix 合入,禁直推 |
| `develop` | 集成最新开发成果 | master | feature 定期合入 |
| `feature/<name>` | 新功能 | develop | develop |
| `release/<x>` | 发版提测 | develop | master + develop |
| `hotfix/<name>` | 线上紧急修复 | master(或 tag) | master + develop |

## 命名规则

格式:**`<类型>/<简短描述>`**。

- **类型前缀**:默认 `feat`(新功能)/ `bugfix`(修未发布缺陷)/ `hotfix`(修已发布缺陷,从 tag 切)。项目自定义类型以 CLAUDE.md 为准。
- **描述**:英文小写 + 连字符,简短达意(2-4 个词)。`feat/pdf-export` 好,`feat/feature-pdf-export-new` 差。
- **可附 issue 编号**:用户提及 issue 时附上,如 `feat/login-flow-123`。
- **纯 ASCII,不加 emoji**:emoji 用于 commit / CHANGELOG / PR 标题,不进分支名(避免 CI / shell 兼容问题;见 obsidian-kb 附属文档 emoji-helper.md)。

命名示例:`feat/pdf-export`、`fix/submit-double-click`、`hotfix/auth-token-rollback`、`release/1.x`。

## 切出基线

- **feat / bugfix**:从受保护分支(master/main)最新状态切出。`git fetch origin && git checkout master && git pull`,`git switch -c <分支名>`。
- **hotfix**:从对应版本 tag 切出(先问用户基于哪个版本),`git switch -c <分支名> v<版本>`。

## 分支操作

```bash
git branch                      # 列本地分支(* 标当前)
git branch -r / -a              # 远程 / 全部分支
git branch --merged             # 已合并进当前分支的分支(可安全删)
git switch <name>               # 切分支(新命令,语义清晰)
git switch -c <name>            # 创建并切换(等价 checkout -b)
git branch -m <old> <new>       # 重命名
git branch -d <name>            # 删除(-D 强删未合并的)
git checkout -b <local> origin/<remote>   # 从远程分支建本地分支
```

## 给分支名时(流程一配合)

生成 **3-5 个不同侧重的备选**让用户选(AskUserQuestion),别只给一个:
- 素材:用户口述 + 当前未提交变更(`git status` / `git diff`)推断用途。
- 若当前在受保护分支且有未提交变更,创建前确认是否带到新分支(`switch -c` 会带过去)。
- 不自动 push 新分支,除非用户要求。
