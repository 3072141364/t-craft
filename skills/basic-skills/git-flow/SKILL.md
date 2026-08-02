---
name: git-flow
description: 分支与提交工作流助手。当用户发出显式指令管理分支、提交代码、更新变更记录或封版时使用此 skill -- 包括"切分支""切换分支""新建分支"(给分支名建议并创建)、"提交代码""提交一下""commit"(扫描变更、更新 CHANGELOG、询问版本号、格式化、提交、推送)、"更新 changelog""写变更记录"(调用 changelog skill 维护 [Unreleased])、"封版""封版之前的版本"(按 MAJOR 切换封版规则梳理待办:打 -final tag、建 release 分支、更新 CHANGELOG 等)。遵循项目 CLAUDE.md / 规范文档的分支与版本管理(受保护分支禁直推、feat/bugfix/hotfix 分支、squash merge、CHANGELOG 强制、SemVer),此 skill 负责把这些规范变成可执行的步骤。仅当用户明确表达上述意图时触发。
---

# Git Flow

把项目的研发规范转化为可执行的 Git 工作流动作。四个核心流程:**切分支**、**提交代码**、**更新 CHANGELOG**、**封版**。

## 何时触发

**显式触发**。仅当用户明确表达以下意图时使用:

- **切分支**:用户说"切分支""切换分支""新建分支""开个分支"等。
- **提交代码**:用户说"提交代码""提交一下""commit""提交并推送"等。
- **更新 CHANGELOG**:用户说"更新 changelog""写变更记录""整理本次改动"等。
- **封版**:用户说"封版""封版之前的版本""要发大版本了"等。

不要在用户只是查看 git 状态、做普通编辑、或闲聊时触发。

## 前置:读取项目规范(不硬编码)

本 skill 跨项目复用。每次触发先发现项目约定:

1. **读项目 `CLAUDE.md`**:提取本项目的分支模型(分支类型、保护规则、是否 squash merge)、版本真源、格式化命令、CHANGELOG 规则、封版规则。若 CLAUDE.md 引用了规范文档(如 `docs/development.md`),一并读。
2. **约定优于配置**:版本真源依次探测 `version.json` / `pyproject.toml` / `package.json`;CHANGELOG 探测根目录 `CHANGELOG.md`。
3. **可选描述文件**:`.claude/skills-config.json` 之类显式覆盖。

以文件实际内容为准,不凭记忆。若项目 CLAUDE.md 未定义某些约定,用下文默认。

**默认约定**(项目未指定时):
- 分支类型:`feat`(新功能)/ `bugfix`(修未发布缺陷)/ `hotfix`(修已发布缺陷,从 tag 切)。
- 受保护分支:`master`/`main` 禁直推。
- 版本:SemVer,真源为探测到的版本文件。
- CHANGELOG:Keep a Changelog,强制更新。
- 格式化:项目的 `make format` 或等价命令(从 CLAUDE.md / Makefile 读)。

**可调用的子 skill**:`changelog`(本 plugin 内)。提交流程中更新 CHANGELOG 时调用它,不自行实现。commit/PR 的 emoji 向 `emoji-helper`(本 plugin 内)查询。

## 流程一:切分支

### 1. 收集分支命名素材
- **用户口述**:用户描述了要做什么。
- **当前代码变更**:若用户未明说,用 `git status` 和 `git diff` 推断用途。

### 2. 给出 3-5 个分支名备选
按项目分支类型(默认 `feat/bugfix/hotfix`,以 CLAUDE.md 为准)生成 `<类型>/<简短描述>` 备选:
- 前缀小写,描述英文小写 + 连字符,简短达意。
- 可附 issue 编号(若用户提及)。
- **分支名保持纯 ASCII,不加 emoji**(emoji 用于 commit/CHANGELOG/PR 标题,不进分支名,避免 CI/shell 兼容性问题;见 `emoji-helper`)。
- 生成 3-5 个不同侧重的备选。

用 AskUserQuestion 呈现给用户选择。

### 3. 创建分支
用户选定后:
- **feat / bugfix**:从受保护分支(master/main)最新状态切出。`git fetch origin`,`git checkout master && git pull`,`git checkout -b <选定分支名>`。
- **hotfix**:从对应版本 tag 切出(询问用户基于哪个版本),`git checkout -b <分支名> v<版本>`。

创建后告知当前分支,提醒后续用"提交代码"流程提交。

### 注意
- 若当前在受保护分支且有未提交变更,创建分支前确认是否带到新分支(通常 `checkout -b` 会带过去)。
- 不自动 push 新分支,除非用户要求。

## 流程二:提交代码

**顺序很重要**:格式化 -> 更新 CHANGELOG -> 询问版本号 -> 提交 -> 推送(确认)。

### 1. 扫描代码变更
```bash
git status
git diff            # 未暂存
git diff --cached  # 已暂存
git log --oneline -5
```
据此判断变更性质(新功能/修复/重构/文档/构建),用于 CHANGELOG 分类与版本递增建议。

### 2. 格式化代码
先询问用户是否格式化(默认建议是)。若同意,跑项目格式化命令(从 CLAUDE.md / Makefile 读,如 `make format`)。格式化改动纳入本次提交。

### 3. 更新 CHANGELOG
强制步骤(项目规范通常要求 PR 合并必须有 CHANGELOG 更新)。

**调用 `changelog` skill 完成本步**。把步骤 1 的变更摘要传入,由它按 Keep a Changelog 规范读写 `CHANGELOG.md` 的 `[Unreleased]` 段。本 skill 不重复实现。

- 把变更性质与涉及文件告诉 changelog。
- changelog 起草条目后展示确认,确认后才写入。
- 若变更纯属格式化/重构等无行为影响,changelog 会标注"无行为影响",可不写条目但告知用户。

### 4. 询问是否跳版本号
读版本真源(见「前置」),展示当前版本。按 SemVer 给出递增建议:

| 变更类型 | 建议 | 示例 |
|---------|------|------|
| 修复 bug,API 不变 | PATCH +1 | `0.1.0 -> 0.1.1` |
| 新增功能,向后兼容 | MINOR +1,PATCH 归零 | `0.1.1 -> 0.2.0` |
| 破坏性 API 变更 | MAJOR +1,MINOR/PATCH 归零 | `1.2.3 -> 2.0.0` |
| 初始开发(0.y.z)破坏性变更 | MINOR +1 | `0.1.0 -> 0.2.0` |

用 AskUserQuestion 询问是否递增、按哪种。本 skill **只做版本号递增**(改版本真源),不执行封版。若选 MAJOR 递增,提醒"按规范应对旧主版本封版(打 -final tag + 建 release 分支),需另行处理(见流程四)"。用户确认后更新版本真源,纳入提交。

### 5. 提交
- `git add` 相关文件(代码 + CHANGELOG + 版本真源,若有改动)。
- 起草 commit message,格式 `<emoji> <type>(<scope>): <subject>`,**行首带 gitmoji**。type->emoji 向 `emoji-helper` 查询;常用对照:

| type | emoji | type | emoji |
|------|------|------|------|
| feat | ✨ | perf | ⚡️ |
| fix | 🐛 | style | 🎨 |
| refactor | ♻️ | test | ✅ |
| docs | 📝 | release | 🔖 |
| build | 🔨 | hotfix | 🚑️ |
| chore | 🔧 | security | 🔒️ |

示例:`✨ feat(config): 新增配置加载模块`。emoji 用法遵循 `emoji-helper`:一提交一个,语义对应,不堆砌。

展示确认后 `git commit`。

### 6. 推送(需确认)
提交完成后,**推送前必须再次确认**(推送是外部副作用)。用 AskUserQuestion 询问"是否推送到 origin"。
- 同意:`git push`(新分支未设上游用 `git push -u origin <分支名>`)。
- 不同意:停在本地,告知已提交未推送。

### 注意
- 若检测到当前在受保护分支,提醒"禁直推,请先切工作分支",引导走流程一。
- 若 git 未配置 user.name/email,提示配置。
- 不自动创建 PR(本流程只到 push);可提示用户去托管平台创建 PR。

## 流程三:更新 CHANGELOG

用户要求更新变更记录时(独立于提交流程),本流程只做 CHANGELOG 维护,不涉及 commit/push。

### 1. 调用 changelog skill
传入:
- 变更范围(本次改动 / 某段时间 / 某版本之后),未指定则默认"当前未提交 + 自上次提交以来"。
- 变更性质与涉及文件(若已知)。

changelog 会扫描变更、按 Keep a Changelog 分类起草、展示草稿确认后写入 `CHANGELOG.md` 的 `[Unreleased]`。

### 2. 完成
告知 CHANGELOG 已更新,可提示"后续可用'提交代码'流程连同代码一起提交"。

### 注意
- 本流程不改版本真源、不 commit、不 push -- 仅维护 CHANGELOG。若用户要提交,引导走流程二。
- 若用户想做"发版收尾"([Unreleased] 转正),涉及版本号与 tag,引导走流程四或由用户显式确认。

## 流程四:封版

用户要求封版时(通常准备发 MAJOR 大版本,需冻结旧主版本),按项目封版规则(从 CLAUDE.md / 规范文档读)梳理待办并逐步执行。封版低频但重要,涉及 tag(不可变),**每步都要确认**。

### 1. 梳理封版待办清单
读版本真源与项目封版规则,确认:
- 当前版本(如 `1.5.3`)与即将发布的新 MAJOR 版本(如 `2.0.0`)。
- 即将冻结的旧主版本号(如 `1.x`)。

展示封版待办清单(默认模板,按项目规则调整):

```
封版待办(冻结 1.x 主版本,准备发 2.0.0):

1. [ ] 确认 1.x 主版本所有待合并 PR 已处理完毕
2. [ ] 对 1.x 打封版 tag:v1.<最后PATCH>-final(如 v1.5.3-final)
3. [ ] 创建 release/1.x 分支(用于后续 hotfix backport)
4. [ ] 在 CHANGELOG.md 记录"1.x 主版本至此封版,后续仅安全/严重缺陷 hotfix"
5. [ ] 确认 2.0.0 的 [Unreleased] 已收尾为正式版本条目(调用 changelog 发版收尾)
6. [ ] 递增版本真源的 MAJOR,改为 2.0.0
7. [ ] 打发版 tag v2.0.0
8. [ ] (可选)推送 release/1.x 分支与各 tag 到 origin
```

用 AskUserQuestion 或列表让用户确认清单,可增删。

### 2. 逐步执行
按清单逐项执行,每步前确认:
- **打封版 tag**:`git tag -a v1.5.3-final -m "Freeze 1.x: final tag"`,推送前确认。
- **建 release 分支**:`git checkout -b release/1.x v1.5.3-final`。
- **更新 CHANGELOG**:调用 changelog,在对应版本条目下注明封版说明。
- **[Unreleased] 收尾**:调用 changelog 发版收尾,把 `[Unreleased]` 转为 `2.0.0` 正式条目。
- **递增版本真源**:MAJOR 递增,MINOR/PATCH 归零。
- **打发版 tag**:`git tag -a v2.0.0 -m "Release 2.0.0"`。

### 3. 推送(需确认)
封版 tag 与 release 分支是不可变/长期存在的远端对象,**推送前必须确认**。逐项确认推送:
- 是否推送 `v1.5.3-final` tag?
- 是否推送 `release/1.x` 分支?
- 是否推送 `v2.0.0` tag?

确认后分别 `git push origin <ref>`。

### 注意
- **封版 tag 不可变**:一旦推送不得修改;需修订则发新 tag。
- **只对 MAJOR 切换封版**:MINOR/PATCH 发版不封版。若用户在非 MAJOR 切换时说"封版",提醒走普通发版流程。
- **多个确认点**:清单确认、每步执行确认、推送确认 -- 不要跳过。
- **release 分支维护**:封版后该主版本仅接受 hotfix backport,不再合入新功能。

## 通用约定

- **每步确认**:涉及修改文件(CHANGELOG、版本真源)和外部动作(commit、push)前,展示将要做的操作给用户确认,不擅自执行。
- **以项目规范为准**:规则细节以 CLAUDE.md / 规范文档实际内容为准,启动时读取,不凭记忆。
- **失败要明确**:任何步骤失败(git 命令出错、文件不存在),停止并告知,不继续后续步骤。
- **保持简洁**:不啰嗦重复规范条文,直接执行动作,只在需要用户决策时才询问。

## 附:命令速查

```bash
# 切分支
git fetch origin && git checkout master && git pull
git checkout -b feat/<desc>            # feat/bugfix 从受保护分支
git checkout -b hotfix/<desc> v<ver>    # hotfix 从 tag

# 提交流程
git status && git diff
<format cmd>                            # 格式化(用户同意后;命令从 CLAUDE.md/Makefile 读)
# 调用 changelog skill:更新 CHANGELOG.md [Unreleased]
# 编辑版本真源(用户确认版本递增后)
git add <files>
git commit -m "<emoji> <type>(<scope>): <subject>"   # 行首带 gitmoji(向 emoji-helper 查询)
git push -u origin <branch>             # 用户确认后

# 封版(MAJOR 切换)
git tag -a v<x.y.z>-final -m "Freeze <x>: final tag"
git checkout -b release/<x> v<x.y.z>-final
# 调用 changelog:[Unreleased] 收尾为正式版本条目
# 递增版本真源的 MAJOR
git tag -a v<X.0.0 -m "Release <X>.0.0"
git push origin v<x.y.z>-final release/<x> v<X.0.0>     # 用户确认后
```
