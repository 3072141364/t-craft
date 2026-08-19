---
name: code-guidelines
description: t-craft 编码总入口——把编码任务路由到对应能力,并挂 karpathy 行为准则。何时用:接到写 / 改代码任务时先进这里,它做三件默认行为不会做的事:①按改动语言激活对应子 skill(Python→python-guidelines、C++→cpp-guidelines、bash→bash-guidelines,各带项目专属格式化 / 审查清单);②按意图路由到附属文档——需求深挖走 brainstorm.md、代码理解 / 追调用 / 影响面走 code-intelligence.md(codegraph→gitnexus→grep 优先级)、跑"格式化 / 测试 / lint / 构建 / 装依赖"走 make-shortcut.md、搭 .editorconfig / 装格式化工具走 format.md、写方案 / 设计 / spec 走独立子 skill project-doc;③行为准则 karpathy-guidelines.md(先想再写、外科手术式改动、目标驱动)。本 skill 是路由器,不重复模型默认已会的命名 / 注释 / 拆函数常识。
---

# 编码总入口(路由器)

这是 t-craft 的**编码路由器**,不是编码教程。见名知义、拆函数、命名自解释、少写注释这些,模型默认已经做得好,本 skill 不重复。它只做默认行为不会主动做的事:**接到编码任务 → 查语言 → 激活对应子 skill / 按意图读附属文档**。

## 第一步:语言路由(每次编码任务先做)

看 `git diff --stat` / 待改文件后缀 / 项目 CLAUDE.md,确定改动语言,激活对应语言子 skill,用其准则与附属文档干活:

| 语言 | 子 skill | 带什么(默认做不到的) |
|------|----------|---------------------|
| Python | `python-guidelines` | ruff/mypy 配置真源、可变默认参数 / 闭包延迟绑定等审查清单 |
| C++ | `cpp-guidelines` | clang-format 配置、RAII / use-after-move / 生命周期审查清单 |
| bash | `bash-guidelines` | set -euo pipefail 加固、`rm -rf $DIR/*` 空变量等陷阱清单 |
| 其他 | (无子 skill) | 套模型默认编码常识即可 |

多语言混合改动,按文件分别套对应子 skill。

## 第二步:按意图路由到附属文档(渐进披露,用到才读)

| 意图 | 读哪篇 |
|------|--------|
| 接需求、动手前深挖真实意图 / 约束 / 验收 | [references/brainstorm.md](references/brainstorm.md) |
| 找符号 / 追调用 / 理解功能 / 评估改动影响 | [references/code-intelligence.md](references/code-intelligence.md)(codegraph → gitnexus → grep/LSP) |
| 跑项目命令(格式化 / 测试 / lint / 构建 / 初始化 / 清理 / 装依赖) | [references/make-shortcut.md](references/make-shortcut.md) |
| 搭格式化环境 / 写 .editorconfig / 一键装工具 | [references/format.md](references/format.md)(语言专项格式化在各子 skill 的 format.md) |
| 做技术决策 / 动手改代码的行为准则 | [references/karpathy-guidelines.md](references/karpathy-guidelines.md)(先想再写、外科手术式、目标驱动) |
| 审代码对照异味基线(喂 `/tcraft-code-review`) | [references/code-smells.md](references/code-smells.md)(Fowler 12 味) |
| 要留 TODO/FIXME/HACK 等状态标记 | [references/code-markers.md](references/code-markers.md)(8 个标准前缀 + 管理约定;别随手写中文标记,统一前缀才能被 grep / CI 巡检) |
| 写方案 / 设计 / spec / 记决策 / 写评估报告 | 独立子 skill `project-doc`(离码文档落 vault) |

## 项目约定发现(不硬编码)

落到具体项目时,把路由接到该项目的约束上(格式化命令、类型检查配置、模块布局、语言版本兼容):

1. **读项目 `CLAUDE.md`**:提取语言版本(如 Python 3.8 / C++17)、格式化命令、类型检查工具、目录约定。
2. **以文件实际内容为准**,匹配既有代码风格,不凭记忆。

## 与 review 的分工

- **写代码时**:走本路由器 → 语言子 skill,预防性地写好。
- **审代码时**:用对应语言子 skill 的 `references/review.md` 抓工具管不到的逻辑 bug(可变默认参数 / 生命周期 / 并发等)。
