---
description: 发布流程(研发流程阶段⑤)。验证全绿后,提交 → 合并主分支 → 版本升级(SemVer)→ 打 tag 上线。触发 git-guidelines 的「流程三:合并上线与版本升级」。/tcraft-release = 开始发布流程;/tcraft-release commit = 只做提交;跳阶段 = 直接指定步骤。
argument-hint: [commit | merge | version | tag]
---

触发 **git-guidelines**(本 plugin)的发布流程。

## 执行

读 git-guidelines SKILL.md 的「流程三:合并上线与版本升级」,按序执行,每步确认:

1. **提交**:格式化 → 更新 CHANGELOG → commit → push(推送前确认)。
2. **合并主分支**:合入受保护分支(master/main),走 PR + review,不直推。
3. **版本升级**(特定合并触发):按本次变更类型递增 SemVer——feat→MINOR / fix→PATCH / BREAKING→MAJOR;改版本真源 + CHANGELOG 发版收尾 + 展示草稿确认。
4. **打 tag 上线**:`git tag -a v<x.y.z> -m "Release <x.y.z>"`,推送 tag 前确认。

## 参数

- 无参数:从当前 git 状态判断从哪一步开始(有未提交 → 提交;已提交未合并 → 合并;已合并 → 版本升级)。
- `commit` / `merge` / `version` / `tag`:只做指定步骤。

## 前置

- 确认当前分支通过验证(测试 + review),无未提交冲突。
- 版本真源从项目探测(`version.json` / `pyproject.toml` / `package.json`),见 git-guidelines 前置。

## 约定

- **每步确认**:合并、改版本、打 tag、推送都是不可逆/外部动作,逐个确认。
- **以项目规范为准**:分支保护、发版流程从 CLAUDE.md / 规范文档读,不凭记忆。
