# t-craft

个人自用的工程技能体系，打包为 omp（oh-my-pi）**marketplace** + **本地 link 插件**。本地自研插件（vibe-code / obsidian / gitnexus）用 `omp plugin link` 装到源码路径（走 omp-plugins native 加载、改动即时生效），外部源插件（frontend-design 等）走 marketplace。每个 plugin 内 skill（意图自动触发）+ 规则（rule，常驻/按需）。

## Plugin 一览

| plugin | 来源 | 内容 |
|--------|------|------|
| `vibe-code` | `./skills/vibe-code`（link） | vibe coding 研发流程 + 代码工具（13 技能 + 9 条规则） |
| `obsidian` | `./skills/obsidian`（link） | obsidian 知识库：6 个技能 + frontmatter hook |
| `gitnexus` | `./skills/gitnexus`（link） | GitNexus 代码智能：调用链 / 影响面 / PR 审查 / 重构 / bug 排查（7 技能 + MCP 配置） |
| `frontend-design` | github(子路径): `anthropics/claude-code` → `plugins/frontend-design` | 前端/UI 设计技能（独立视觉/字体/配色，避免 AI 模板感） |

## vibe-code（研发流程 + 代码工具）

**技能**（intent-triggered），按研发流程六阶段 + 横切组织：

| 技能 | 定位 |
|------|------|
| `traft-guideline` | 导航入口 / 六阶段路由（调度） |
| `traft-requirements` | ① 需求深挖，产需求要点 |
| `traft-code-docs` | ② 离码文档（prd / adr / test / review / progress） |
| `traft-code-implement` | ③ 方案实现（读 prd、先思考、简洁、外科手术式修改） |
| `traft-code-review` | ④ 双轴审查（Standards 规范 / Spec 需求） |
| `traft-code-git` | ⑤ git 管理（分支 / commit / changelog / 发布） |
| `traft-code-intelligence` | 代码查证路由（gitnexus / LSP / read） |
| `traft-code-comment` | 注释规范（非必要不注释、结构化标记） |
| `traft-code-debug` | 问题分析 / bug 定位 |
| `traft-code-make` | 项目命令体系路由（format / test / lint / build） |
| `traft-code-graph` | 技术图绘制（路由 archify，`npx skills add tt-a1i/archify -g` 安装） |
| `traft-perfetto-trace` | 通用事件可视化（Chrome Trace Event JSON schema → ui.perfetto.dev，含查询 SQL 速查） |
| `traft-create-skill` | 创建新技能（结构/命名/禁绝对路径/脚本优先原则 + 内置模板 + 注册同步） |

**规则**（rules，随插件分发，`skills/vibe-code/rules/`）：

| 规则 | 触发 | 内容 |
|------|------|------|
| `code-intel-tools` | always-apply | 代码读取工具优先级 gitnexus > LSP > grep |
| `polish-expression` | always-apply | 大白话/英文文档 → 润色成清晰中文表达 |
| `py-data-model` | always-apply | 数据模型优先级：项目约定 > pydantic > dataclass |
| `py-dict-instead-of-if-elif` | always-apply | 同性质映射用 dict 而非 if/elif 链 |
| `py-version-syntax` | always-apply | 语法/类型注解匹配项目 Python 版本 |
| `zh-answer` | always-apply | 中文作答，术语/命令保留原文 |
| `py-env-tools` | rulebook（按需） | 环境工具优先级：项目约定 > uv > poetry > …；conda 非必要不用 |
| `py-format-tools` | rulebook（按需） | 格式化：项目约定 > ruff（≤120） |
| `py-logging` | rulebook（按需） | 日志：项目约定 > loguru > 内置 logging |

## obsidian（知识库）

| 技能 | 定位 |
|------|------|
| `traft-obsidian` | vault 知识库管理（卡片 / 双链 / emoji 规范） |
| `traft-obsidian-cli` | obsidian CLI 命令参考（何时用 CLI vs 文件系统） |
| `traft-obsidian-emoji` | emoji 速查（直接读 emoji-cheatsheet 文件） |
| `traft-task` | 任务管理（视图+生命周期） |
| `traft-todos` | 周级临时小任务（Tasks checkbox，勾掉即完成） |
| `traft-query` | vault 快速查询知识点 / 证据接地（grep 替代原 ob-query） |

工具：`traft-query`（vault 检索）＋ `traft-obsidian-emoji`（emoji 速查）＋ `traft-obsidian-cli`（CLI 命令参考）; `frontmatter` hook 校验。

## gitnexus（代码智能）

7 个技能：`gitnexus-cli` / `gitnexus-exploring` / `gitnexus-impact-analysis` / `gitnexus-debugging` / `gitnexus-pr-review` / `gitnexus-refactoring` / `gitnexus-guide`。

依赖：`npm install -g gitnexus`；插件自带 `.mcp.json` 注册 `gitnexus mcp` 服务器（确保 `~/.omp/agent/mcp.json` 的 `enabledServers` 含 `gitnexus`）；对要用它的仓库跑 `gitnexus analyze` 建索引。

## 安装（新用户）

本地自研插件走 **link**（`omp plugin link` 指向本地源码，走 omp-plugins native 加载）：

```bash
git clone https://github.com/3072141364/t-craft.git
cd t-craft
omp plugin link skills/vibe-code
omp plugin link skills/obsidian
omp plugin link skills/gitnexus
```

外部源插件走 marketplace：

```
/marketplace add 3072141364/t-craft
/marketplace install frontend-design@t-craft
```

**验证**：新开会话问模型"系统提示里有几条 always-apply 规则"（应为 6 条 + 3 条 rulebook）。

**特点与注意**：

- link 到本地源码 → 改 `skills/<plugin>/` 下内容**即时生效**，不用 bump 版本重装。
- link 是本地绝对路径，**新用户需重新 clone + link**；仓库更新后 `git pull` 即同步插件内容。
- marketplace.json 仍保留本地插件条目（供他人在别的环境用 marketplace 方式安装），本机不用这条路，避免 `claude-plugins` 源的外围 disabled 显示。

## 仓库布局

```
t-craft/
├── .omp-plugin/
│   └── marketplace.json        # marketplace 目录（外部源插件 + 分发用）
├── skills/
│   ├── vibe-code/              # plugin: vibe-code
│   │   ├── rules/*.md          # 规则（always-apply / rulebook）
│   │   ├── skills/<name>/SKILL.md
│   │   ├── README.md / package.json
│   ├── obsidian/               # plugin: obsidian
│   │   ├── tools/obsidian/index.ts
│   │   ├── skills/<name>/SKILL.md
│   │   └── package.json
│   └── gitnexus/               # plugin: gitnexus
│       ├── skills/<name>/SKILL.md
│       ├── .mcp.json / README.md / package.json
```

## 设计原则

- **研发流程六阶段路由**：由 `traft-guideline` 调度，每阶段读对应 skill 的 `skill://` 全文执行；`progress.md` 是阶段状态真源。
- **以项目文件实际内容为准**：分支模型、版本真源、格式化命令等从项目上下文（CLAUDE.md / AGENTS.md 等）发现，不硬编码。
