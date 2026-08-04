# Changelog

t-craft 的变更记录。遵循 [Keep a Changelog](https://keepachangelog.com/)。**本项目不设版本号**;以 `[Unreleased]` 累积,发布(推送 / 里程碑)时转为日期条目。

---

## [Unreleased]

### ✨ Added

- **`brainstorm`** skill + `/brainstorm` 命令(从占位实现):需求深挖与头脑风暴,研发流程阶段①。弹性一次一问 + 推荐答案,内嵌 5-Whys / first-principles 追问工具(按需),联动 obsidian-query 查旧方案,产出需求要点(对话内)。
- **`spec-doc`** skill + `/spec-doc` 命令:标准文档生成 skill,两形态。方案文档段已实现(开发前,落 vault 方案卡,骨架按读者分章:用户读[需求背景/方案设计/项目收益/行动清单/验收标准] + AI 须知[范围外/代码变更清单/测试决策]);评估测试文档段(开发后,给 peer review)后补。与 brainstorm 接力:要点→方案文档。
- **`obsidian-query`** skill + `/obsidian-query` 命令(原名 vault-query 占位,改名实现):省 token 查询 vault。每文档 frontmatter `summary` + 3-tier 分级读(无关跳过 / 弱相关只读 summary / 强相关精读全文),只读不改。
- **`dev-flow`** skill + `/dev-flow` 命令:研发流程调度器。识别当前阶段(git 状态 + 对话推断,识别不了问用户)→ 激活对应 skill → 完成后提示进下一阶段。六阶段映射表:①头脑风暴→②方案设计→③实现→④审计/评估→⑤提交→⑥沉定。阶段可跳跃。
- 卡片模板加 frontmatter `summary` 字段(8 个模板全加,供 obsidian-query 3-tier 查询用)。

### 🔧 Changed

- **`obsidian-kb`** 模块重构:① 模块三(查询)改为调用 `obsidian-query` 做 3-tier 省 token 查询,不重复实现;② 模块一(方案沉淀)骨架从「背景/目标/候选方案/权衡/决策/后续」改为 spec-doc 新骨架(用户读5节 + AI 须知)+ 加 summary 维护;③ 删模块二(升级文档),因升级卡片已删。
- **卡片模板精简**:8 个 → 3 个,只保留方案 / 术语 / 周记。删会议 / 决策 / 升级 / 踩坑 / 问题修复(按需再加,不预设)。`init_vault.sh` 目录结构删 `日程/日记`;INDEX 模板列表、`vault-conventions.md`、标签速查表同步精简。
- `marketplace.json`:`./eval-report` → `./spec-doc`、`./vault-query` → `./obsidian-query`、code-skills 加 `./dev-flow`。
- `CLAUDE.md`:TODO 占位描述更新为现状(已实现 + 评估段后补)。

### 🗑️ Removed

- **`eval-report`** 占位 skill:职责并入 `spec-doc` 评估测试文档段(后补),避免重复。
- **`vault-query`** 占位 skill:改名 `obsidian-query` 实现,旧目录删除。
- 卡片模板:会议 / 决策 / 升级 / 踩坑 / 问题修复(精简,按需再加)。

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
