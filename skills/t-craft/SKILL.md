---
name: t-craft
description: 工程技能体系总入口。t-craft(https://github.com/3072141364/t-craft)不是"教模型写代码",而是一套流程编排 + 规范落盘 + 双线并行的工程体系:开发线(dev-flow 调度六阶段)、调研线(paper-study 调研论文+技术)、知识大脑(obsidian-kb 横贯两线,沉淀+快答)。当用户说"t-craft""用 t-craft 技能""按 t-craft 规范"或首次接触生态时触发,展示技能清单并路由到对应子 skill。不覆盖具体子 skill 内容。
---

# t-craft 工程技能体系

t-craft 的定位是**帮你编排流程、落盘文档、沉淀知识、快答问题、触发规范**——不是教模型写代码(那些默认能力已够)。体系两条主线 + 一个知识大脑:

```
开发线(dev-flow 调度)  ─┐
                         ├─→ 周报三流(开发/论文/技术)汇合
调研线(paper-study)   ─┘

知识大脑(obsidian-kb)横贯两线:沉淀(写)+ 快答(读)
```

## 🔧 开发线(code-skills)

| 技能 | 定位(默认做不到的独特价值) | 触发场景 |
|------|------|----------|
| `dev-flow` | **开发线调度中枢**:识别你在六阶段哪一环,激活对应 skill 并提示下一步 | 接需求/开始做功能/"我现在在哪个阶段" |
| `code-guidelines` | **编码路由器**:查语言激活子 skill + 按意图路由到附属文档(需求深挖/代码理解/make 命令/行为准则) | 写/改代码时先进这里 |
| `python-guidelines` | Python 项目约定 + ruff/mypy 真源 + 易错点(可变默认参数/闭包延迟绑定) | 写/改 Python |
| `cpp-guidelines` | C++ 项目约定 + clang-format 真源 + 高危坑(RAII/use-after-move/UB) | 写/改 C++ |
| `bash-guidelines` | bash 加固清单(set -euo pipefail/trap)+ 陷阱(rm -rf 空变量/set -e 边界) | 写/改脚本 |
| `web-guidelines` | 轻量前端:①demo/小 SaaS ②汇报单页报告(图文并茂、表现力强) | 做小应用/汇报单页 |
| `project-doc` | 离码文档规格化(prd/adr/test/review)落 vault | 写方案/设计文档/测试报告 |
| `git-guidelines` | 按项目规范的 git 工作流(CHANGELOG/gitmoji/版本升级) | 任何 git 操作 |

## 🔬 调研线(research-skills)

| 技能 | 定位 | 触发场景 |
|------|------|----------|
| `paper-study` | **调研线**:调研论文(待读→粗读→精读→已读状态机)+ 调研技术(落 tech/) | 读论文/记笔记/调研某技术方向 |

## 🧠 知识大脑(obsidian-skills,横贯两线)

| 技能 | 定位 | 触发场景 |
|------|------|----------|
| `obsidian-kb` | **项目知识大脑**:①**自动快答**(问项目操作/约定/配置,先查 vault 直接答)②**主动沉淀**(干完活提醒记 wiki/踩坑)③项目 wiki(目录隔离 projects/<名>/{wiki,workflow,requirements}) | 问项目约定/沉淀知识/查旧方案/写周报 |

## 🎨 配图(fireworks-tech-graph)

| 技能 | 定位 |
|------|------|
| `fireworks-tech-graph` | 自然语言 → SVG/PNG 技术图(架构/流程/泳道/UML/C4),供 obsidian-kb 方案配图 |

## 使用方法

- **自动匹配**:系统按意图自动激活。写代码→dev-flow/code-guidelines;做汇报→web-guidelines;问项目约定→obsidian-kb 自动快答;读论文/调研→paper-study。
- **显式命令**:`/<skill-name>`(如 `/dev-flow`、`/tcraft-project-doc`)。

## 核心原则:通用方法论 + 项目约定发现

所有 skill 只含**通用方法论**,项目特定约定(路径/配置/版本真源)不硬编码,运行时按三层发现:①约定优于配置(探测标准位置)→ ②读项目 CLAUDE.md → ③可选 `.claude/skills-config.json` 覆盖。
