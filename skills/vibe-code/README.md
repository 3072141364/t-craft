# vibe-code 技能集

vibe coding 研发流程 + 代码工具技能集，面向 omp（oh-my-pi）harness。**skill 意图自动触发**，按研发流程 + 代码工具组织。

> 技能名统一用 `traft-*` 前缀（个人品牌）；obsidian 知识库（`traft-obsidian`）与周报/todo（`traft-todos`）已拆到独立的 `obsidian` 插件，不在此列。

## 技能（intent-triggered）

| 技能 | 用途 |
|------|------|
| `traft-guideline` | 导航入口 / 研发流程六阶段路由 |
| `traft-requirements` | ① 需求深挖，产出需求要点 |
| `traft-code-docs` | ② 离码文档（prd / adr / test / review / progress） |
| `traft-code-implement` | ③ 方案实现（读 prd、先思考、简洁、外科手术式修改） |
| `traft-code-review` | ④ 双轴审查（Standards 规范 / Spec 需求） |
| `traft-code-git` | ⑤ git 管理（分支 / commit / changelog / 发布） |
| `traft-code-intelligence` | 代码查证路由（gitnexus / LSP / read 工具组） |
| `traft-code-comment` | 注释规范（非必要不注释、结构化标记） |
| `traft-code-debug` | 问题分析 / bug 定位 |
| `traft-code-make` | 项目命令体系路由（格式 / 测试 / lint / 构建） |
| `traft-code-graph` | 技术图绘制（架构/流程/时序/UML/C4，路由 archify，`npx skills add tt-a1i/archify -g`） |
| `traft-perfetto-trace` | 通用事件可视化（Chrome Trace Event schema → ui.perfetto.dev；耗时/进展/重合度 + 查询 SQL） |
| `traft-create-skill` | 创建新技能（结构/命名/禁绝对路径/脚本优先原则 + 内置模板 + 注册同步） |

## 规则（rules，随插件分发）

见仓库根 README「vibe-code 规则」表：7 条 always-apply（comment-minimal / code-intel-tools / polish-expression / py-data-model / py-dict-instead-of-if-elif / py-version-syntax / zh-answer）+ 3 条 rulebook（py-env-tools / py-format-tools / py-logging）。

## 安装

本地（推荐，改动即时生效）：

```
git clone <你的GitHub用户名>/t-craft
cd t-craft
omp plugin link skills/vibe-code
```

marketplace（备用分发）：`/marketplace add <你的GitHub用户名>/t-craft` → `/marketplace install vibe-code@t-craft`。

更新：link 方式 `git pull` 即同步；marketplace 方式 bump 版本后 `/marketplace update t-craft` → `/marketplace install --force vibe-code@t-craft`。
