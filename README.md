# t-craft

跨项目复用的工程技能集,以 Claude Code plugin 形式组织。结构参照 [anthropics/skills](https://github.com/anthropics/skills)。

每个 skill 只含**通用方法论**;项目特定约定(文件路径、版本真源、分支模型等)在运行时从项目 `CLAUDE.md` / 标准文件发现,**不硬编码**。同一个 skill 在任何项目都能用,新项目零配置即跑。

## 分类 = 多 plugin

一个 marketplace(`t-craft`)挂多个 plugin,每个 plugin 就是一个**分类**,按需安装。每个 plugin 有自己的 source 目录(`skills/<plugin>/`),skill 放在对应目录下;命令放 plugin 的 `commands/`(自动发现)。分类靠 `marketplace.json` 的 `plugins[]`(参照 anthropics/skills)。

| plugin(分类) | skill / 命令 | 作用 |
|---------------|--------------|------|
| `code-skills`(代码相关) | `code-guidelines` | 跨语言编码准则与编码总入口:查语言 -> 激活 <lang>-guidelines;附属文档:代码理解路由、需求深挖/头脑风暴、karpathy 行为准则、make-shortcut、跨语言格式化、代码异味基线、注释标记 |
| | `project-doc` | 项目文档统一管理(离码文档,落 vault):prd(需求/方案)、adr(决策)、test(测试)、review(评估审查)各一篇附属文档 + 术语提炼(terminology,内置术语库 terms.json,降沟通成本) |
| | `python-guidelines` | Python 专项约定(命名/注释/类型注解);附属:format(ruff+mypy)、review |
| | `cpp-guidelines` | C++ 专项约定(Doxygen/Google 命名/RAII);附属:format(clang-format)、review |
| | `bash-guidelines` | bash 专项约定(三件套/引号/trap);附属:format(shfmt)、review |
| | `dev-flow` | 研发流程调度器:识别阶段 → 激活 skill → 流转提示;六阶段 ①→⑥ |
| | `git-guidelines` | Git 体系准则:四区模型、分支/提交工作流、远程协作、撤销决策表、冲突解决、stash/rebase/cherry-pick、.gitignore、tag、工作流模型;附属文档:commit 细则、changelog 维护、分支命名规范、README 写作细则 |
| | `web-guidelines` | Web/前端总入口(SaaS 平台/应用界面 + 报告渲染,不做营销页):**应用型 UI(app-ui-design,后台管理/SaaS 平台主参考)**、设计与文案(design-craft,钉主题/两遍法/避默认样式簇)、报告渲染(report-rendering,结论金字塔/图表选型/打印友好)、React/Next.js 性能准则(react-performance)、UI 审查(ui-review);设计与文案提炼自 anthropics/skills,React/审查提炼自 vercel-labs/agent-skills,应用 UI 与报告自研 |
| | `/tcraft-code-review`(命令) | 代码审查:影响面评估(轻)/ 全量评估(重)两档,双轴,VCS 无关,出报告(bash/python/cpp) |
| | `/tcraft-project-doc` `/tcraft-brainstorm` `/tcraft-dev-flow` `/tcraft-release` `/tcraft-web`(命令) | 流程入口:方案文档 / 头脑风暴 / 调度器 / 发布(提交→合并→版本升级→上线)/ 前端(工具 UI / React / UI 审查) |
| `obsidian-skills`(Obsidian 知识库) | `obsidian-kb` | vault 统一管理:落盘/查询(3-tier)/知识沉淀/快速问答/周报/emoji;技术学习在 tech/ 沉淀 |
| | `/tcraft-obsidian-kb` `/tcraft-obsidian-query` `/tcraft-weekly`(命令) | vault 管理入口(模块路由)/ 文档查询 / 建周报 |
| `research-skills`(科研管理) | `paper-study` | 论文研究管理:papers/ 一论文一卡、待读队列、阅读工作流(待读→粗读→精读→已读)、论文笔记 |
| | `/tcraft-paper`(命令) | 论文研究入口(收/读/笔记/队列) |

## 结构

```
t-craft/
├── .claude-plugin/
│   └── marketplace.json          # marketplace,定义多个分类 plugin
├── .claude/
│   └── skills-config.json        # 项目可选描述文件(vault 路径等)
├── CLAUDE.md                     # 本仓库开发约定
├── README.md
├── CHANGELOG.md
├── REFERENCES.md
├── docs/
│   ├── workflow-prompts.md       # 研发流程预设提示词
│   └── system-map.html           # 体系全景图(结构变化时同步更新)
├── scripts/
│   ├── setup-ubuntu.sh / setup-mac.sh
└── skills/
    ├── code-skills/              # source: ./skills/code-skills
    │   ├── commands/{tcraft-code-review,tcraft-project-doc,tcraft-dev-flow,tcraft-brainstorm,tcraft-release}.md
    │   ├── code-guidelines/(references/{brainstorm,code-intelligence,karpathy-guidelines,make-shortcut,format,code-markers,code-smells}.md + scripts/)
    │   ├── web-guidelines/(references/{app-ui-design,design-craft,report-rendering,react-performance,ui-review}.md)
    │   ├── project-doc/(references/{prd,adr,test,review,terminology}.md + terms.json(术语库))
    │   ├── python-guidelines/  cpp-guidelines/  bash-guidelines/  (references/{format,review}.md)
    │   ├── git-guidelines/(references/{commit,changelog,branch,readme}.md)
    │   └── dev-flow/
    ├── obsidian-skills/          # source: ./skills/obsidian-skills
    │   ├── obsidian-kb/(references/{vault-conventions,weekly,progress,query,answers,emoji-helper,emoji-cheatsheet,obsidian-syntax}.md + assets/templates/ + scripts/init_vault.sh)
    │   └── commands/{tcraft-obsidian-query,tcraft-obsidian-kb,tcraft-weekly}.md
    └── research-skills/          # source: ./skills/research-skills
        ├── paper-study/(references/{reading-flow,note}.md + assets/templates/{paper,reading-list}.md)
        └── commands/tcraft-paper.md
```

## 安装

```
/plugin marketplace add 3072141364/t-craft
```

按分类装:

```
/plugin install code-skills@t-craft        # code-guidelines(编码总入口)/ project-doc / web-guidelines(前端)/ python-guidelines / cpp-guidelines / bash-guidelines / dev-flow / git-guidelines + /tcraft-code-review /tcraft-project-doc /tcraft-brainstorm /tcraft-dev-flow /tcraft-release /tcraft-web
/plugin install obsidian-skills@t-craft    # obsidian-kb(vault 统一管理,含 emoji 参考)+ /tcraft-obsidian-kb /tcraft-obsidian-query /tcraft-weekly
/plugin install research-skills@t-craft  # paper-study(论文研究管理)+ /tcraft-paper
```

本地试装:`/plugin marketplace add /home/wz/workspace/t-craft`。

## 本地工具(让 Claude 更顺)

装些本地 CLI 工具,让 Claude Code 搜索 / 解析 / 操作更高效。按系统一键装:

```bash
bash scripts/setup-ubuntu.sh   # Ubuntu/Debian(apt)
bash scripts/setup-mac.sh      # macOS(Homebrew)
```

| 工具 | 用途 |
|------|------|
| ripgrep(rg) | 代码 / 文本搜索,Claude 的 grep 主力 |
| fd | 快速 find |
| jq / yq | JSON / YAML 解析 |
| tree | 目录结构 |
| tmux | 后台长任务 |
| ctags | 代码索引 |
| ffmpeg | 媒体(配 fireworks GIF) |
| glab / tea | GitLab / Gitea CLI(多 VCS) |
| uv | Python |

不含(由 skill 管):node / nvm(`code-guidelines/scripts/setup_env.sh`)、ruff / clang-format / LSP(`code-guidelines/scripts/setup_format_tools.sh`)、docker(手动)。

## 新增一个 skill

1. 在 `skills/<plugin>/` 下新建 `<name>/SKILL.md`(参考现有 skill 的 frontmatter 与正文结构),填写 name / description / 正文。
2. 在 `.claude-plugin/marketplace.json` 里找到该 skill 所属分类的 plugin,在其 `skills` 数组追加 `"./<name>"`(相对 plugin source)。若新分类,新增一个 plugin 条目(`source: "./skills/<plugin>"`)。
3. 若是命令(非 skill),放 `skills/<plugin>/commands/<cmd>.md`(自动发现,不列进 `skills[]`)。
4. 正文遵循「通用方法论 + 项目约定发现」(见 `CLAUDE.md`),不硬编码项目路径。
5. `/plugin update` 或重启 Claude Code 生效。

## 原则

- **通用方法进 skill,项目绑定靠发现**:skill 只装方法论;路径、版本真源、分支模型等读项目的 `CLAUDE.md` / 标准文件。
- **以文件实际内容为准**:不凭记忆读项目约定。
- **per-plugin 目录**:每个 plugin 自己的 source 目录(`skills/<plugin>/`),skill 与命令各归其位;分类由 marketplace.json 的多 plugin 表达(参照 anthropics/skills)。

## 参考

- **命令速查**:全部 10 个快捷命令(研发流程 / 前端 / vault 管理 / 论文研究)的用法见 [docs/commands.md](docs/commands.md)。
- **体系全景**:整个研发体系(dev-flow 六阶段、随码/离码文档、skill 编队、vault 模型)的结构图见 [docs/system-map.html](docs/system-map.html)(浏览器打开)。
- 本项目参考、引用或调研过的仓库见 [REFERENCES.md](REFERENCES.md)。
