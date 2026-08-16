# CHANGELOG 维护细则

> git-guidelines 的附属文档:把代码变更转化为面向消费者的变更记录,按 [Keep a Changelog](https://keepachangelog.com/) 维护。SKILL.md 的提交流程(流程二第 3 步)、发版 git 操作及用户直接要求"更新 changelog"时读本文执行。

## 项目约定发现(不硬编码)

1. **约定优于配置**:
   - CHANGELOG 文件:项目根目录的 `CHANGELOG.md`(或 `CHANGES.md` / `HISTORY.md`)。
   - 版本真源:依次探测 `version.json`、`pyproject.toml`(`[project]` 的 `version` 或 `dynamic`)、`package.json`。
2. **读项目 `CLAUDE.md`**:提取本项目的类别细则、emoji 约定、CHANGELOG 规则条款。若 CLAUDE.md 引用了规范文档(如 `docs/development.md`),一并读。
3. **可选描述文件**:若项目有 `.claude/skills-config.json` 之类显式覆盖,读之。

**找不到 CHANGELOG 文件**:提示用户是否新建,不擅自创建。

## 格式(Keep a Changelog)

```markdown
# Changelog

文件头说明(格式遵循 Keep a Changelog,版本遵循 SemVer)。

---

## [Unreleased]

待记录后续变更。

---

## [1.0.0] - 2026-08-01

### ✨ Added
- 具体条目……

### 🐛 Fixed
- ……
```

## 类别语义与 emoji

类别标题与条目前**带 emoji**,语义一一对应:

| 类别 | emoji | 何时用 |
|------|------|--------|
| Added | ✨ | 新增功能、新模块、新 API |
| Changed | 🔧 | 对已有功能的变更(行为调整、接口变动,非破坏) |
| Deprecated | 🗑️ | 标记即将移除 |
| Removed | ❌ | 本版本真正移除(配合先前的 Deprecated) |
| Fixed | 🐛 | 缺陷修复 |
| Security | 🔒️ | 安全相关修复 |

> emoji 应与同次变更的 commit 呼应(feat 提交用 ✨,CHANGELOG 该条归 Added 也用 ✨)。完整 emoji 速查以项目自带资料为准;若无,用上表默认。

## 条目写作要求

- **具体不空泛**:写清改了什么、影响什么。不写"优化了代码""修复若干问题"。
- **面向消费者视角**:描述用户/集成方能感知的变化,而非纯实现细节。
- **一条一意**:一个变更一条,不合并无关改动。
- **类别准确**:破坏性变更归 Changed(或 Removed);新增归 Added;修 bug 归 Fixed。

## 流程一:追加变更到 [Unreleased](日常)

1. **分析变更来源**:`git log`、`git diff`、`git status` 看本次改动;有范围则 `git log <from>..<to>`。
2. **分类与起草**:按类别归类,起草条目。过滤纯内部噪声(纯格式化、CI 调试)--这类不入 CHANGELOG,或合并为一条"内部:xxx"。
3. **展示确认**:把草稿展示给用户确认/调整,再写入 `[Unreleased]` 对应类别下。类别不存在则新建。
4. **保持格式**:不破坏文件整体结构(`---` 分隔、标题层级)。

## 流程二:发版收尾

1. 读版本真源(见「项目约定发现」)取即将发布的版本号与日期。
2. 把 `[Unreleased]` 段内容整体移动到新版本标题下:
   ```markdown
   ## [1.0.0] - 2026-08-01
   ### ✨ Added
   - ...
   ```
3. 在顶部新建空的 `[Unreleased]` 段。
4. 更新文件末尾的版本对比链接(新增该版本的 compare 链接,更新 `[Unreleased]` 指向)。

发版涉及的 git 对象(tag、release 分支)见 SKILL.md「tag 与发版 git 操作」。

## 流程三:从提交历史批量整理

1. `git log <起>..<止> --pretty=format:"- %s"` 或带文件变更。
2. 逐条分析、分类、转化为用户友好条目。
3. 过滤噪声(merge commit、纯 chore、WIP)。
4. 展示草稿给用户确认,再写入。

## 注意

- **以文件实际内容为准**:读 CHANGELOG 文件与项目 CLAUDE.md,不凭记忆。
- **不擅自动版本真源**:版本号递增由用户或提交流程决定,本文只在发版收尾时读版本号,不改它。
- **保持结构完整**:写入时维持 `---` 分隔与标题层级,不破坏既有条目。
- **写入前确认**:展示草稿给用户确认,不擅自落笔。
