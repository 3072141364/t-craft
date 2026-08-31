---
name: traft-guideline
description: traft技能组导航入口--维护研发流程六阶段路由表，接到开发任务按阶段激活对应技能；询问 traft 相关问题时帮助选择技能。何时激活："traft是什么？"，"我想用traft做XXX"，"开始做个功能"，"走研发流程"，"我现在在哪个阶段"，"接下来该干嘛"。
---

# traft技能组指南
traft(全称t-craft)，是一套自用的工程技能体系，涉及vibe coding、知识库管理(obsidian)、研究调研等场景的技能集合。


## 研发流程路由（开发线）

接到开发任务（feat / bugfix）按六阶段推进。当前阶段优先从需求的 progress.md 状态判断（状态真源），没有需求文件夹时从对话语境推断；每阶段结束把 status 推进到下一阶段，并提示进入下一阶段。

| 阶段 | 做什么 | 激活技能 | 产出 |
|------|--------|---------|------|
| ① 头脑风暴 | 搞清楚需求是什么、要做什么、**不做什么** | `traft-requirements`（查 vault 旧方案走 `traft-obsidian`） | 需求要点，落 prd.md「需求」部分 |
| ② 方案设计 | 整理并落盘方案 | `traft-code-docs`（要配图走 `traft-code-graph`） | prd.md「方案」部分 + adr.md |
| ③ 实现 | 写代码（落地 prd） | `traft-code-implement`（主）；`traft-code-intelligence`（查证）、`traft-code-comment`（注释）；遇 bug 走 `traft-code-debug` | 代码 + adr.md |
| ④ 验证 | 先评审：影响面 -> 全量 -> 修复 -> 冒烟 | `traft-code-review`（双轴审查）；测试 / 审查记录落盘走 `traft-code-docs` | test.md + review.md |
| ⑤ 发布 | 提交 -> 合并主分支 -> peer review -> 上线 | `traft-code-git` | 无 |
| ⑥ 沉淀 | 提炼可复用内容进 skill 仓库 | `traft-obsidian`（wiki / 卡片 / 踩坑） | wiki / 卡片 / 可复用技能 |

### 横切技能（按需，不限阶段）

| 技能 | 何时用 |
|------|--------|
| `traft-code-intelligence` | 写 / 改 / 理解 / review 代码时的查证路由（gitnexus / LSP / read 工具组） |
| `traft-code-debug` | 排查问题、定位根因（③④ 常驻） |
| `traft-code-graph` | 技术图（架构 / 流程 / 泳道 / UML / C4） |
| `traft-code-make` | 项目命令体系路由：格式化 / 测试 / lint / 构建 / 清理，一条 make 命令 |

## 知识库
| 技能 | 定位 | 触发场景 |
|------|------|----------|
| `traft-obsidian` | vault 入口 | 知识库文档增删改查，按内容路由到 traft-code-docs / research / weekly |

## 调研线
| `traft-code-graph` | 图表绘制 | 文章思路、实验流程图绘制 |

## 日程管理
| `traft-todos` | 周级临时小任务 | Tasks checkbox 记 todo(勾掉即完成)、生成周报、结转下周 |
| `traft-task` | 项目任务与需求进展 | 建任务、查任务、每周评估、月归档 |
