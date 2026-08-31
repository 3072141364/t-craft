# vibe-code 技能集

vibe coding 研发流程 + 代码工具技能集，面向 omp（oh-my-pi）harness。**skill 意图自动触发，命令显式调用**，按研发流程 + 代码工具组织。

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
| `traft-code-graph` | 技术图绘制（架构/流程/时序/UML/C4，包装 fireworks-tech-graph） |

## 命令（`/xxx`，explicit）

`/traft-requirements`　`/traft-code-review`　`/traft-branch`　`/traft-commit`

> 说明：技能名用 `traft-*`，命令名用 `tcraft-*`（t-craft 的产品名），两套独立注册，不冲突。

## 安装

```
/marketplace add <你的GitHub用户名>/t-craft
/marketplace install vibe-code@t-craft
/marketplace install fireworks-tech-graph@t-craft   # traft-code-graph 的依赖,同一 marketplace
```

**本地先测**（不推送）：`/marketplace add .`（或仓库绝对路径）→ 安装 `vibe-code` 与 `fireworks-tech-graph` 两个插件。

更新：`/marketplace update t-craft` → `/marketplace install --force vibe-code@t-craft`。
