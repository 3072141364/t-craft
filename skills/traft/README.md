# traft 技能集

t-craft 的工程技能集，面向 omp（oh-my-pi）harness。**skill 意图自动触发，命令显式调用**，按研发流程 + 知识库组织。

## 技能（intent-triggered）

| 技能 | 用途 |
|------|------|
| `traft-guideline` | 导航入口 / 研发流程六阶段路由 |
| `traft-brainstorm` | ① 需求深挖，产出需求要点 |
| `traft-project-docs` | ② 离码文档（prd / adr / test / review / progress） |
| `traft-code-implement` | ③ 方案实现（读 prd、先思考、简洁、外科手术式修改） |
| `traft-code-review` | ④ 双轴审查（Standards 规范 / Spec 需求） |
| `traft-git-flow` | ⑤ git 管理（分支 / commit / changelog / 发布） |
| `traft-code-intelligence` | 代码查证路由（gitnexus / LSP / read 工具组） |
| `traft-code-comment` | 注释规范（非必要不注释、结构化标记） |
| `traft-debug` | 问题分析 / bug 定位 |
| `traft-make` | 项目命令体系路由（格式 / 测试 / lint / 构建） |
| `traft-obsidian` | vault 知识库管理 |
| `traft-weekly` | 周报 / 周记 |
| `traft-graph` | 技术图绘制（架构/流程/时序/UML/C4，包装 fireworks-tech-graph） |

## 命令（`/xxx`，explicit）

`/traft-brainstorm`　`/traft-code-review`　`/traft-weekly`　`/traft-branch`　`/traft-commit`

## 安装

```
/marketplace add <你的GitHub用户名>/t-craft
/marketplace install traft@t-craft
/marketplace install fireworks-tech-graph@t-craft   # traft-graph 的依赖,同一 marketplace
```

**本地先测**（不推送）：`/marketplace add .`（或仓库绝对路径）→ 安装 `traft` 与 `fireworks-tech-graph` 两个插件。

更新：`/marketplace update t-craft` → `/marketplace install --force traft@t-craft`。
