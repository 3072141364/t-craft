---
name: emoji-helper
description: emoji 选择与应用助手。凡是想用 emoji 提升文字可读性时都用此 skill -- 编写/编辑 commit 信息、CHANGELOG 条目与类别标题、PR 标题、状态标注、文档与笔记,以及任何"给文字配 emoji"的场景。用户问"这个改动该用哪个 emoji""feat 配什么 emoji""给这段加个 emoji""commit 行首放什么",或其他 skill(changelog、git-flow 等)需要确定 commit 类型/CHANGELOG 类别/PR 标题对应 emoji 时,应调用本 skill 查询,而不在各 skill 内硬编码映射表。只要涉及给文字加 emoji 就触发,即使用户没显式说出"emoji"二字。
---

# emoji-helper

给一段内容选出语义正确的 emoji、按规范放到正确位置、校验用法合规。其他 skill 不再各自维护映射表,统一向本 skill 查询。规则是通用默认;项目特有约定从项目 CLAUDE.md 发现。

## 规范依据

- **通用默认规则**:见下文「核心原则」与「高频映射」。这是跨项目的合理默认。
- **项目特有约定**:读项目 `CLAUDE.md`,看是否有项目专属的 emoji 规则(如自定义类别 emoji、禁用某些 emoji)。有则覆盖默认。
- **完整速查表**:长尾场景查 `references/emoji-cheatsheet.md`(随本 skill 附带,不依赖项目)。

## 何时触发

- **用户直接问**:选 emoji、给文字配 emoji、确认某 type/类别对应哪个 emoji。
- **写 commit / CHANGELOG / PR 标题 / 状态标注 / 文档笔记**时,需要 emoji 前缀或点缀。
- **其他 skill 委托**:changelog 写条目、git-flow 写 commit/PR 标题时,emoji 选择交本 skill。

## 核心原则

- **语义对应**:emoji 必须贴合内容语义,不可张冠李戴(feat 用 ✨ 不用 🐛)。emoji 是给读者快速识别意图的线索,错配比不用更误导。
- **一处一个**:一个 commit 行首一个 emoji;一条 CHANGELOG 条目前一个 emoji;一个 PR 标题行首一个。不堆砌。
- **位置正确**:
  - commit 信息 -- emoji 放行首,后接 type,如 `✨ feat(config): 新增配置加载`。
  - CHANGELOG -- 类别标题带 emoji(`### ✨ Added`),条目前可再带一个与条目语义对应的 emoji。
  - PR 标题 -- 行首一个 emoji,与 squash 后的 commit 呼应。
- **不进分支名**:分支名保持纯 ASCII。emoji 会破坏部分 CI/shell/平台的兼容性与可读性。需要给分支配语义时用前缀(`feat/`、`bugfix/`),不用 emoji。
- **不进代码注释**:代码里不用 emoji。代码可读性靠命名与结构,不靠装饰。
- **与 commit 呼应**:同一次变更,commit 的 emoji 与 CHANGELOG 条目的 emoji 尽量对应。
- **不滥用**:emoji 服务可读性,不喧宾夺主。无行为影响的纯内部变更不强行配 emoji。关键信息永远用文字表达。

## 高频映射(内联,日常最常用)

长尾场景见 `references/emoji-cheatsheet.md`。

### commit 类型 -> gitmoji(遵循 [Gitmoji](https://gitmoji.dev/))

| Emoji | type | 含义 |
|------|------|------|
| ✨ | feat | 引入新功能 |
| 🐛 | fix | 修复缺陷 |
| ♻️ | refactor | 重构代码(不改行为) |
| 🎨 | style | 改进代码格式/结构 |
| ⚡️ | perf | 提升性能 |
| 🔥 | chore | 移除代码/文件 |
| 📝 | docs | 更新文档 |
| ✅ | test | 增加测试 |
| 🔧 | config | 修改配置文件 |
| 🔨 | build | 修改构建系统 |
| 👷 | ci | 修改 CI 配置 |
| 🔖 | release | 发版/打 tag |
| 🚀 | deploy | 部署相关 |
| ➕ | deps | 增加依赖 |
| ➖ | deps | 移除依赖 |
| ⬆️ | deps | 升级依赖 |
| ⬇️ | deps | 降级依赖 |
| 🔀 | merge | 合并分支 |
| 🚑️ | hotfix | 紧急修复 |
| 🔒️ | security | 修复安全问题 |
| 🌐 | i18n | 国际化/本地化 |
| ♿️ | a11y | 无障碍改进 |
| 🗃️ | db | 数据库相关 |

### CHANGELOG 类别 -> emoji(对应 [Keep a Changelog](https://keepachangelog.com/))

| 类别 | emoji | 含义 | 何时用 |
|------|------|------|--------|
| Added | ✨ | 新增功能 | 新模块、新 API、新能力 |
| Changed | 🔧 | 对已有功能的变更 | 行为调整、接口变动(非破坏) |
| Deprecated | 🗑️ | 即将移除的功能 | 标记弃用 |
| Removed | ❌ | 本版本移除的功能 | 真正移除(配合先前的 Deprecated) |
| Fixed | 🐛 | 缺陷修复 | 修 bug |
| Security | 🔒️ | 安全相关修复 | 安全漏洞修复 |

### 状态标注

| Emoji | 含义 |
|------|------|
| ✅ | 已完成/通过 |
| 🚧 | 进行中/WIP |
| ⏳ | 等待中/进行中 |
| ❌ | 阻塞/失败 |
| 🔜 | 待开始 |

## 工作流程

### 选 emoji(查询模式)

1. **理解语义**:弄清内容到底在表达什么。语义是选 emoji 的唯一依据。
2. **先查高频映射**:commit/CHANGELOG/状态三类直接查上面的内联表。
3. **长尾查速查表**:不在高频表里,读 `references/emoji-cheatsheet.md` 对应章节。
4. **校验规则**:用核心原则逐条过。
5. **返回**:给出 emoji,附一句理由与命中的规则。

### 应用 emoji(写入模式)

1. 按"选 emoji"流程定下 emoji。
2. 按位置规则放置。
3. 若与其他 skill 协作(如 git-flow 已给出 type、changelog 已给出类别),直接据其输入查表返回 emoji。
4. 输出可直接落笔的文字。

## 与其他 skill 的协作

本 skill 是 emoji 的唯一映射来源,其他 skill **不再硬编码映射表**:

- **changelog**:写 CHANGELOG 条目时,类别 emoji 与条目 emoji 向本 skill 查询。
- **git-flow**:写 commit 信息 / PR 标题时,type->gitmoji 向本 skill 查询。
- **任意 skill**:需要给输出文字加 emoji 时,调用本 skill。

## 输出约定

- **查询**:返回 emoji + 一句理由。例:`✨ -- 新增功能,对应 feat,放 commit 行首。`
- **应用**:返回已带 emoji 的成品文字。例:`✨ feat(config): 新增配置加载模块`。
- **不确定/无合适 emoji**:如实说明,不硬凑。纯内部噪声变更明确建议"不加 emoji"。
- **校验失败**(如想给分支名加 emoji):指出违规规则,给出合规做法。
