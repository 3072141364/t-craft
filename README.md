# t-craft

个人自用的工程技能体系，打包成 omp（oh-my-pi）**marketplace**，跨电脑统一安装。一个 marketplace 挂多个 **plugin**（按需），每个 plugin 内 skill（意图自动触发）+ 命令（显式调用）。

## Plugin 一览

| plugin | 来源 | 内容 |
|--------|------|------|
| `traft` | `./skills/traft` | 研发流程 + 代码工具 + obsidian 知识库 + 周报（13 技能 + 5 命令） |
| `gitnexus` | `./skills/gitnexus` | GitNexus 代码智能：调用链 / 影响面 / PR 审查 / 重构 / bug 排查（7 技能 + MCP 配置） |
| `fireworks-tech-graph` | github: `yizhiyanhua-ai/fireworks-tech-graph` | 自然语言生成技术图（`traft-graph` 的依赖） |

## traft（研发流程 + 知识库）

**技能**（intent-triggered），按研发流程六阶段 + 横切 + 知识库组织：

| 技能 | 定位 |
|------|------|
| `traft-guideline` | 导航入口 / 六阶段路由（调度） |
| `traft-brainstorm` | ① 需求深挖，产需求要点 |
| `traft-project-docs` | ② 离码文档（prd / adr / test / review / progress） |
| `traft-code-implement` | ③ 方案实现（读 prd、先思考、简洁、外科手术式修改） |
| `traft-code-review` | ④ 双轴审查（Standards 规范 / Spec 需求） |
| `traft-git-flow` | ⑤ git 管理（分支 / commit / changelog / 发布） |
| `traft-code-intelligence` | 代码查证路由（gitnexus / LSP / read） |
| `traft-code-comment` | 注释规范（非必要不注释、结构化标记） |
| `traft-debug` | 问题分析 / bug 定位 |
| `traft-make` | 项目命令体系路由（format / test / lint / build） |
| `traft-obsidian` | vault 知识库管理 |
| `traft-weekly` | 周报 / 周记 |
| `traft-graph` | 技术图绘制（包装 fireworks-tech-graph） |

**命令**（`/xxx`，explicit）：

`/traft-brainstorm`　`/traft-code-review`　`/traft-weekly`　`/traft-branch`　`/traft-commit`

> 说明：技能名用 `traft-*`，命令名用 `tcraft-*`（t-craft 的产品名），两套独立注册，不冲突。

## gitnexus（代码智能）

7 个技能：`gitnexus-cli` / `gitnexus-exploring` / `gitnexus-impact-analysis` / `gitnexus-debugging` / `gitnexus-pr-review` / `gitnexus-refactoring` / `gitnexus-guide`。

依赖：`npm install -g gitnexus`；插件自带 `.mcp.json` 注册 `gitnexus mcp` 服务器（确保 `~/.omp/agent/mcp.json` 的 `enabledServers` 含 `gitnexus`）；对要用它的仓库跑 `gitnexus analyze` 建索引。

## 安装（跨电脑）

```
/marketplace add 3072141364/t-craft
/marketplace install traft@t-craft
/marketplace install gitnexus@t-craft
/marketplace install fireworks-tech-graph@t-craft
```

**本地先测**（不推送）：`/marketplace add .`（或仓库绝对路径）→ 安装上面三个。

更新：改动 plugin 后 bump 版本（`skills/<plugin>/package.json` + marketplace 条目），再 `/marketplace update t-craft` + `/marketplace install --force <plugin>@t-craft`。

> 注意：omp 的 marketplace 克隆会缓存；版本号不变时 `update`/`install` 不重新拉取。改内容务必 bump 版本，否则已装机器跑 `upgrade` 不会更新。

## 仓库布局

```
t-craft/
├── .omp-plugin/
│   └── marketplace.json        # marketplace 目录（3 个 plugin）
├── skills/
│   ├── traft/                  # plugin: traft
│   │   ├── skills/<name>/SKILL.md
│   │   ├── commands/*.md
│   │   ├── README.md / package.json
│   └── gitnexus/               # plugin: gitnexus
│       ├── skills/<name>/SKILL.md
│       ├── .mcp.json / README.md
```

## 设计原则

- **skill 意图触发，命令显式调用**：同一件事两条路，先想"明确走流程（命令）还是交意图匹配（skill）"。
- **研发流程六阶段路由**：由 `traft-guideline` 调度，每阶段读对应 skill 的 `skill://` 全文执行；`progress.md` 是阶段状态真源。
- **以项目文件实际内容为准**：分支模型、版本真源、格式化命令等从项目上下文（CLAUDE.md / AGENTS.md 等）发现，不硬编码。
