# Changelog

t-craft 的变更记录。遵循 [Keep a Changelog](https://keepachangelog.com/)。**本项目不设版本号**;以 `[Unreleased]` 累积,发布(推送 / 里程碑)时转为日期条目。

---

## [Unreleased]

(待记录后续变更)

## 2026-08-02

### ✨ Added

- **`obsidian-kb`** skill:联通 Obsidian vault--初始化(`init_vault.sh`)、`card_type` 卡片概念、方案 / 升级沉淀、文档查询、卡片沉淀、标签维护、emoji-helper 联动、Bases 动态索引(`卡片库.base`)、fireworks-tech-graph 画图联动。
- **`make-shortcut`** skill:把开发意图路由到 make 目标(format / test / lint / build / init / clean)。
- **`code-format`** skill:格式化标准与工具(C++ Google / Python PEP8 ruff+mypy / bash shfmt / .editorconfig)+ `setup_format_tools.sh` 一键装工具。
- **`code-review`**(`/code-review` 命令):双轴(Standards / Spec)+ Fowler 异味基线,VCS 无关,出报告,bash / python / cpp 语言参考。
- **`brainstorm` / `eval-report` / `vault-query`** 三个 TODO 占位 skill(未实现)。
- 集成外部 plugin **`fireworks-tech-graph`**(技术图生成)。
- `scripts/setup-ubuntu.sh` / `setup-mac.sh`:本地常用 CLI 工具一键装。
- `REFERENCES.md`(参考仓库)、`MEMORY.md`(偏好 + 待办)、`docs/workflow-prompts.md`(六阶段预设提示词)。
- `code-intelligence` 加「环境与安装」段 + `setup_env.sh`(nvm + node + codegraph + gitnexus + LSP)+ gitnexus 子 skill 自动安装。

### 🔧 Changed

- `code-intelligence` 整篇改中文 + 需求 -> 工具矩阵 + 省 token / 提准确率原则 + 重构去冗余。
- 目录重构为 **per-plugin source**(anthropics 标准:`skills/<plugin>/`);`code-review` 归 code-skills(命令)、`make-shortcut` 归 code-skills。
- `marketplace.json` 按 per-plugin source 重写;`CLAUDE.md` / `README.md` 同步。

### 📝 docs

- `CLAUDE.md`:per-plugin 结构 + 新增 skill 流程 + TODO 注记。
- `README.md`:分类表、结构树、安装、本地工具、参考段重写。
