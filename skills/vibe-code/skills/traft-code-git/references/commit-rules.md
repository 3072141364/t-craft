# Commit 写作细则

> traft-code-git 的附属文档:commit message 的格式、类型选择与写作原则。

## 核心原则

- **原子提交**:一次提交只做一件事。功能一个提交、格式化一个提交、修 bug 一个提交--混在一起的提交没法单独 revert、没法 review、changelog 也难归类。
- **频繁提交**:小步提交换来细粒度历史,出问题能精确定位、按提交二分(bisect)。
- **message 写「为什么」**:commit 本身(diff)记录了改了什么,message 补充意图与上下文。复述 diff 的 message 是噪音。
- **公共历史不可改写**:推送到公共分支后,修正靠新提交(revert),不靠 reset/force push。

## 格式

```
<emoji> <type>(<scope>): <subject>

<可选 body:为什么这么改、决策上下文、备选方案为何不选>

<可选 footer:破坏性变更、关联 issue>
```

- **emoji**:行首 gitmoji,与 type 语义对应(见下表),一提交一个,不堆砌。type->emoji 完整映射向 obsidian-kb 附属文档 emoji-helper.md 查询。
- **type**:Conventional Commits 类型,小写。
- **scope**(可选):改动影响的模块,如 `config`、`api`。
- **subject**:祈使句、不加句号、一行说清(约 50 字符内)。

## type 选择

| type | 何时用 | emoji | 示例 |
|------|--------|-------|------|
| feat | 新功能 | ✨ | `✨ feat(export): 导出支持 PDF 格式` |
| fix | 修 bug | 🐛 | `🐛 fix(submit): 修复重复提交` |
| docs | 只改文档 | 📝 | `📝 docs: 更新 README 安装说明` |
| style | 格式调整,不影响功能 | 🎨 | `🎨 style: 统一缩进` |
| refactor | 重构,非新功能非修复 | ♻️ | `♻️ refactor(parser): 抽出词法扫描` |
| perf | 性能优化 | ⚡️ | `⚡️ perf(cache): 命中率提升的查询走缓存` |
| test | 增/改测试 | ✅ | `✅ test: 补边界值用例` |
| build | 构建系统 / 依赖 | 🔨 | `🔨 build: 升级 ruff 到 0.6` |
| chore | 杂务(不影响 src 与 test) | 🔧 | `🔧 chore: 清理过期脚本` |
| hotfix | 线上紧急修复 | 🚑️ | `🚑️ hotfix(auth): 回滚 token 校验` |
| release | 发版 / 版本变更 | 🔖 | `🔖 release: v2.0.0` |
| security | 安全相关 | 🔒️ | `🔒️ security: 修复依赖 CVE` |

拿不准时的判断:用户能感知 -> feat/fix;只有维护者能感知 -> refactor/chore/build;纯格式 -> style。同一改动多个 type 都沾边时,选**主要意图**,不为混合改动发明新 type--更好的答案是拆提交。

## body 与 footer

- **body 写决策上下文**:为什么用这个方案、放弃了哪些备选、绕过了什么第三方 bug。这是代码读不出来的信息,最有长期价值。
- **footer**:
  - 破坏性变更:`BREAKING CHANGE: <说明>`(或 subject/类型后加 `!`,如 `feat!(api):`)。
  - 关联 issue:`Closes #123` / `Refs #45`。

示例:

```
♻️ refactor(task): 用策略模式替换任务分发 switch

原 switch 分支已达 12 个,新增任务类型要改三处。改为策略注册表后
新类型只需注册一个类。未选 visitor 是因为任务层级只有一层。

BREAKING CHANGE: AbstractTask 的 dispatch() 签名变更
Closes #88
```

## 与 CHANGELOG / PR 的呼应

- **CHANGELOG 呼应**:同一变更的 commit type 与 CHANGELOG 类别语义一致(feat 提交用 ✨,CHANGELOG 该条归 ✨ Added 也用 ✨)。细则见 [changelog.md](changelog.md)。
- **PR 标题**:沿用 commit 格式;PR 保持小而聚焦,大 PR 难审且易藏 bug。

## 反例

| 反例 | 问题 | 改法 |
|------|------|------|
| `update` / `修改` / `fix bug` | 没说改了哪、为什么 | 带上 type + scope + 具体对象 |
| `修复了登录页的登录按钮点击没反应的问题并且顺便调整了配色` | 一提交干两件事 | 拆成 fix + style 两个提交 |
| `改了 a.ts b.ts c.ts` | 复述 diff,没有信息量 | 写意图:为什么改这三个文件 |
| subject 写过去式 `fixed` | 与 git 语气不一致 | 祈使句 `fix` |
