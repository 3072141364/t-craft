# Changelog

t-craft 的变更记录。遵循 [Keep a Changelog](https://keepachangelog.com/)。**本项目不设版本号**;以 `[Unreleased]` 累积,发布(推送 / 里程碑)时转为日期条目。

---

## [Unreleased]

### ✨ Added

- **三个分类 plugin 体系**:`code-skills`(代码 + 研发流程)、`obsidian-skills`(知识体系管理)、`research-skills`(科研管理);外部集成 `fireworks-tech-graph`(技术图)。
- **9 个 skill + 9 个 `/tcraft-*` 命令**:code-guidelines(编码总入口 + 7 篇附属)、project-doc(项目文档,含 prd/adr/test/review)、git-guidelines(随码文档,含 commit/changelog/branch/readme)、dev-flow(调度)、python/cpp/bash-guidelines(语言专项)、obsidian-kb(vault 统一管理)、paper-study(论文研究);命令覆盖全流程(`/tcraft-brainstorm` `/tcraft-project-doc` `/tcraft-code-review` `/tcraft-release` `/tcraft-dev-flow` `/tcraft-obsidian-kb` `/tcraft-obsidian-query` `/tcraft-weekly` `/tcraft-paper`)。
- **dev-flow 六阶段调度**:①头脑风暴 → ②方案设计 → ③实现 → ④验证(两档:影响面评估 / 全量评估 + 全量测试 / 冒烟)→ ⑤发布(提交 → 合并 → 版本升级 → 上线)→ ⑥沉淀;需求状态真源 `progress.md` 随阶段流转,周报只链不复制。
- **文档体系(随码 / 离码)**:随码文档归 git-guidelines(readme/changelog/commit/branch),离码文档归 project-doc(prd/adr/test/review,落 Obsidian vault);配套 `docs/commands.md`(命令速查)、`docs/workflow-prompts.md`(阶段提示词)、`docs/system-map.html`(体系全景)。
- **obsidian-kb 四职能**:初始化 / 需求落盘 / 文档查询(3-tier 省 token)/ 知识沉淀(项目→vault,通用→skill 仓库)/ 快速问答(answer-index)/ 周报与工作清单 / emoji。
- **Obsidian vault 模型**:英文目录(`projects`/`papers`/`tech`/`weekly`/`misc`/`archive`)+ 一需求一文件夹 + `cards.base` 动态视图;跨项目可复用知识提炼进 skill 仓库,模板归 skill 仓库。

### 🔧 Changed

- **本会话大规模重构**:skill 合并——emoji-helper / obsidian-query / obsidian-answers 并入 obsidian-kb,code-format / karpathy-guidelines / make-shortcut / spec-doc 并入 code-guidelines 附属文档;`research-skills` 独立承接论文研究;命令统一 `tcraft-` 前缀;dev-flow 阶段细化(④验证两档 / ⑤发布带版本升级);vault 英文化 + 需求文件夹;文档按随码/离码分工。

### 🗑️ Removed

- `basic-skills` plugin、`template/`、`MEMORY.md`。
- 独立 skill:code-format / karpathy-guidelines / make-shortcut / spec-doc / changelog / brainstorm / code-intelligence / obsidian-query / obsidian-answers / emoji-helper(全部并入总入口 skill 的附属文档或模块,保留历史于 git)。
