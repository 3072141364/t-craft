# Changelog

t-craft 的变更记录。遵循 [Keep a Changelog](https://keepachangelog.com/)。**本项目不设版本号**;以 `[Unreleased]` 累积,发布(推送 / 里程碑)时转为日期条目。

---

## [Unreleased]

### ✨ Added

- **`code-guidelines`** skill:跨语言编码行为准则(注释哲学、不写长函数、命名自解释、注释与文档分工、标记指针),作为父 skill 承载语言无关原理。新增「结构化注释标记」节指向 `references/code-markers.md`。
- **`python-guidelines`** skill:Python 语言专项编码约定(`#`/docstring 语法、snake_case 命名、类型注解替代注释、列表推导式/dataclass/AbstractTask 模板方法拆分),作为 `code-guidelines` 的子 skill,只补 Python 独有部分。
- **`cpp-guidelines`** skill:C++ 语言专项编码约定(`//`/Doxygen 语法、Google 命名风格、const/`[[nodiscard]]`/`optional`/`enum class` 替代注释、header-impl 拆分 + RAII + `static_assert` 编译期约束),作为 `code-guidelines` 的子 skill,只补 C++ 独有部分。
- **`references/code-markers.md`**:跨语言结构化注释标记基线(TODO/FIXME/NOTE/HACK/XXX/OPTIMIZE/REVIEW/DEPRECATED 八标记 + 逐标记「何时用/何时滥用」+ 管理约定:全大写冒号格式、内容具体不空泛、附 `@责任人 日期` 元信息、可 grep、定期清理 FIXME 优先)。不绑语言,Python `#`/C++ `//`/bash `#` 注释符随语言,前缀词固定。
- **`brainstorm`** skill + `/brainstorm` 命令(从占位实现):需求深挖与头脑风暴,研发流程阶段①。弹性一次一问 + 推荐答案,内嵌 5-Whys / first-principles 追问工具(按需),联动 obsidian-query 查旧方案,产出需求要点(对话内)。
- **`spec-doc`** skill + `/spec-doc` 命令:标准文档生成 skill,两形态。方案文档段已实现(开发前,落 vault 方案卡,骨架按读者分章:用户读[需求背景/方案设计/项目收益/行动清单/验收标准] + AI 须知[范围外/代码变更清单/测试决策]);评估测试文档段(开发后,给 peer review)后补。与 brainstorm 接力:要点→方案文档。
- **`obsidian-query`** skill + `/obsidian-query` 命令(原名 vault-query 占位,改名实现):省 token 查询 vault。每文档 frontmatter `summary` + 3-tier 分级读(无关跳过 / 弱相关只读 summary / 强相关精读全文),只读不改。
- **`dev-flow`** skill + `/dev-flow` 命令:研发流程调度器。识别当前阶段(git 状态 + 对话推断,识别不了问用户)→ 激活对应 skill → 完成后提示进下一阶段。六阶段映射表:①头脑风暴→②方案设计→③实现→④审计/评估→⑤提交→⑥沉定。阶段可跳跃。
- 卡片模板加 frontmatter `summary` 字段(8 个模板全加,供 obsidian-query 3-tier 查询用)。

### 🔧 Changed

- **`/code-review` 命令 Standards 轴加「结构化注释标记」审查项**:改动里遇 `TODO`/`FIXME`/`HACK`/`XXX`/`REVIEW` 等标记,按 `references/code-markers.md` 判断——本次改动**新引入**的 `FIXME`/`XXX`(已知缺陷/可疑)该报;预存的 `TODO` 不报(预存技术债不在本次范围)。
- `marketplace.json`:code-skills plugin `skills[]` 加 `./code-guidelines`、`./python-guidelines`、`./cpp-guidelines`。
- **`obsidian-kb` card_type 体系扩充**:从 方案/术语/周记 3 类扩到 6 类,新增 `技术`(技术知识/实践沉淀)、`流程`(可照着执行的规范操作)、`wiki`(概念/背景科普性解释)。card_type 表加"默认位置 + 文件名前缀"列,按需扩充、不强求每类有模板(当前方案/术语/周记有模板,余按需起草)。
- **`obsidian-kb` 项目需求卡结构调整**:项目内工作卡(方案/技术)统一归 `项目/<名>/需求/` 下,文件名带类型前缀(`feat-`/`bugfix-`/`debug-`/`hotfix-`/`tech-`/`style-`/`refactor-`/`perf-`/`docs-`/`chore-`/`test-`)平铺;原 `项目/<名>/方案/`、`feat/`、`debug/` 废弃。跨项目通用技术卡(如 crun、overlayfs)放 `通用/技术/`,不带前缀、不绑 project。项目下固定 `需求/` + `wiki/` + `reference.md`(外部资料链接),init 脚本只建 `项目/` 空壳,项目内结构按需建。
- **`obsidian-kb` 标签扁平化**:frontmatter `tags` 去前缀(`项目/general_process` → `general_process`),不再用 `项目/`、`类型/`、`状态/` 层级前缀;标签维护约定同步改"扁平无前缀"。
- **`obsidian-kb` 周报规范化**:checkbox 用 Tasks 插件 + Minimal 主题扩展符号,仅允许默认状态(`[ ]`/`[x]`/`[/]`/`[-]`)+ 计划类(`[>]`/`[<]`)共 6 个,不用 `[w]`/`[!]`/`[*]` 等;搁置/进行中用 `[-]`/`[/]`,不再用 ⏸️/🔄 emoji 行内标注。父项描述一件事、子项是拆出的步骤,全 `[x]` 父项才 `[x]` 否则 `[/]`;todo 项描述简短,详情归关联需求卡。
- **`obsidian-kb` 人员卡 + 人名 emoji**:建 `通用/人员.md`(init 生成空卡逐条维护),记中英文名(同一人 aliases 关联)+ 身份 emoji(👤其他同事/🧑‍💻组内同事/🦊我/🧑‍💼负责人/🤝外部/🧑‍🏫mentor/👥团队)。文档提到人名时用对应身份 emoji 前缀,人先登记到花名册。原"百立建"正名"白立建",卫泽恩(zane.wei)用 🦊。
- **`obsidian-kb` 通用卡内容纯净铁律**:放 `通用/` 的卡只记纯通用知识,正文不掺项目细节(路径/环境变量/自研封装/脚本引用)。判断标准"换个项目内容还成立吗"——成立才是通用卡;项目耦合内容归项目卡。链接是例外:通用卡与项目卡可双向 `[[wikilink]]` 互链做导航,但不污染通用卡正文;从项目工作提炼通用卡时也去项目化。
- **`obsidian-kb` 方案沉淀对齐 spec-doc**:模块一方案卡片骨架改为 spec-doc 新骨架——用户读(需求背景/方案设计/项目收益/行动清单/验收标准)+ AI 须知(范围外/代码变更清单/测试决策);加 frontmatter `summary` 维护。模块二文档查询改为转调 `obsidian-query` 做 3-tier 省 token 查询,不重复实现。
- **`obsidian-kb` emoji 联动收口**:emoji 不在 skill 硬编码,统一向 `emoji-helper` 查询;vault 的 `通用/规范/emoji速查表.md` 是常用集对照。card_type 图标每卡标题行首带一个,章节可配语义 emoji。
- `marketplace.json`:`./eval-report` → `./spec-doc`、`./vault-query` → `./obsidian-query`、code-skills 加 `./dev-flow`。
- `CLAUDE.md`:TODO 占位描述更新为现状(已实现 + 评估段后补)。
- **`obsidian-kb`/`obsidian-query` 技能组对齐与去冗余**:修 `vault-conventions.md`(card_type 表 6 类 + 文件名前缀、项目结构 需求/+wiki/+reference、扁平标签、补 `通用/技术/`)、周记卡片模板状态说明行(去 ⏸️/🔄 矛盾)、obsidian-query 的 `eval-report` 引用(改 spec-doc 评估段)、标签速查表补 `技术` 主题。vault 发现 + CLI 细节收口到 `vault-conventions.md` 两 SKILL 留指针;`/obsidian-query` 命令精简为只触发;obsidian-kb description 让出查询触发词给 obsidian-query 独占。

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
