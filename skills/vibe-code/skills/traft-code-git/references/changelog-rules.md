# CHANGELOG 维护细则

> traft-code-git 的附属文档:记录代码变更内容,按 [Keep a Changelog](https://keepachangelog.com/) 维护。


## 项目约定 > skill约定

遵循当前项目的约定，不盲目添加。
   - 文档命名: 一般是根目录的 `CHANGELOG.md`(或 `CHANGES.md` / `HISTORY.md`), 或小写版本(如`changelog.md`)。
   - 当前项目如果没有维护变更文档，提示用户是否新建,不擅自行动。
   - 小标题: 优先基于版本号管理，其次按照日期维护，如 v0.0.1，2026-09-02。
   - 仅记录提交部分的变更，`.gitignore` 忽略的文件变更不做记录。
   - `README.md` `CLAUDE.md` `AGENTS.md` 关于CHANGELOG 规则条款 高于本文档规则。

## 格式(Keep a Changelog)

```markdown
# Changelog

文件头说明(格式遵循 Keep a Changelog,版本遵循 SemVer)。

## V1.0.1 (或2026-09-03)
- ✨ feat: 具体内容
- 🐛 fix: 具体内容
- ❌ remove: 具体内容

## V1.0.0 (或2026-09-02)
- ✨ feat: 具体内容
- 🐛 fix: 具体内容
- ❌ remove: 具体内容
```

## 条目写作要求

> 条目格式 <emoji>(可选) <type>: <content> 如✨ Added: 具体内容

   - emoji: 参考`./gitmoji.md`。默认带上emoji，除非用户禁用。
   - type: 参考`./gitmoji.md`。标签和 content需要具有一致性。
   - content: 写清改了什么、影响什么，控制内容长度，非必要不超过20个字。不写空话"优化了代码""修复若干问题"。
   - 一条一意: 一个变更一个条目,不合并无关改动。
   - 面向消费者视角: 描述用户/集成方能感知的变化,而非纯实现细节。


