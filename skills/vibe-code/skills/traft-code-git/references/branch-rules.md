# 分支命名规范(branch)

> traft-code-git的附属文档:分支模型语义与命名规则。切分支、分支命名、评分支规范时读本文。

## 分支模型

| 分支类型 | 命名前缀 | 典型命名示例 | 用途说明 |
|---|---|---|---|
| 主分支 | `main`/`master` | `main` | 存放稳定发布版本 |
| 开发分支 | `develop` | `develop` | 集成开发中的功能分支 |
| 功能分支 | `feat/` | `feat/user-authentication` | 开发新功能 |
| 修复分支 | `fix/` | `fix/login-error` | 修复常规 bug |
| 紧急修复分支 | `hotfix/` | `hotfix/critical-security-issue` | 紧急修复生产环境问题 |
| 支持分支 | `support/` | `support/v1.0.x` | 维护旧版本 |
| 发布分支 | `release/`(可选) | `release/v1.2.0` | 准备新版本发布;是否使用看项目规定,一般直接打 tag |


## 命名规则

格式:**`<类型>/<简述>`**。

- 前缀: 开发分支都需要带有前缀，具体参考‘分支模型’表格，如feat/ fix/ hotfix/。
- 字母限制: 限定使用 英文小写字母(a-z)、连字符(/ -)、数字(1-9), 禁用emoji。 
- 长度限制: 简述部分要求严格控制长度(2-4 个词)。，`feat/pdf-export` 好,`feat/feature-pdf-export-new` 差。
- 关联任务编号(可选): 用户提及 issue 时附上,如 `feat/login-flow-123`。


命名示例:`feat/pdf-export`、`fix/submit-double-click`、`hotfix/auth-token-rollback`、`release/1.x`。

## 切出基线

- **feat / fix**:从受保护分支(master/main)最新状态切出。`git fetch origin && git checkout master && git pull`,`git switch -c <分支名>`。
- **fix**:按需从任意分支切出(如从 bug 出现的当前工作分支),保留 `fix/<描述>` 语义即可。
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
