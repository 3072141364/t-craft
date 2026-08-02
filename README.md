# t-craft

跨项目复用的工程技能集,以 Claude Code plugin 形式组织。结构参照 [anthropics/skills](https://github.com/anthropics/skills)。

每个 skill 只含**通用方法论**;项目特定约定(文件路径、版本真源、分支模型等)在运行时从项目 `CLAUDE.md` / 标准文件发现,**不硬编码**。同一个 skill 在任何项目都能用,新项目零配置即跑。

## 分类 = 多 plugin

一个 marketplace(`t-craft`)挂多个 plugin,每个 plugin 就是一个**分类**,按需安装。每个 plugin 有自己的 source 目录(`skills/<plugin>/`),skill 放在对应目录下;命令放 plugin 的 `commands/`(自动发现)。分类靠 `marketplace.json` 的 `plugins[]`(参照 anthropics/skills)。

| plugin(分类) | skill / 命令 | 作用 |
|---------------|--------------|------|
| `basic-skills`(基础工程约定) | `changelog` | 按 Keep a Changelog 维护 CHANGELOG,类别带 emoji |
| | `git-flow` | 分支/提交/CHANGELOG/封版工作流 |
| | `emoji-helper` | emoji 选择与应用(自带速查表) |
| | `brainstorm` ⚠️TODO | 需求深挖 / 头脑风暴(流程阶段①) |
| `code-skills`(代码相关) | `code-intelligence` | 代码阅读/理解路由:codegraph -> gitnexus -> grep/LSP |
| | `karpathy-guidelines` | 编码行为准则(Karpathy 原则) |
| | `code-format` | 格式化标准与工具:C++ Google/Python PEP8(ruff+mypy)/bash shfmt/.editorconfig |
| | `make-shortcut` | 把开发意图路由到 make 目标(format/test/lint/build/init/clean) |
| | `eval-report` ⚠️TODO | 评估 / 测试报告(流程阶段④,需求确认 + 回归) |
| | `/code-review`(命令) | 代码审查:常规/深度两档,VCS 无关,出报告(bash/python/cpp) |
| `obsidian-skills`(Obsidian 知识库) | `obsidian-kb` | 联通 Obsidian:方案/升级文档沉淀、知识卡片、标签 |
| | `vault-query` ⚠️TODO | vault 高效查询(概述 + 3-tier 读,省 token) |

## 结构

```
t-craft/
├── .claude-plugin/
│   └── marketplace.json          # marketplace,定义多个分类 plugin
├── skills/
│   ├── basic-skills/             # source: ./skills/basic-skills
│   │   ├── changelog/  git-flow/  emoji-helper/
│   ├── code-skills/              # source: ./skills/code-skills
│   │   ├── commands/code-review.md   # /code-review 命令(自动发现)
│   │   ├── references/{bash,python,cpp}-review.md
│   │   ├── code-intelligence/  karpathy-guidelines/  code-format/  make-shortcut/
│   └── obsidian-skills/          # source: ./skills/obsidian-skills
│       └── obsidian-kb/
├── template/
│   └── SKILL.md                  # 新建 skill 的模板
├── CLAUDE.md                     # 本仓库开发约定
└── README.md
```

## 安装

```
/plugin marketplace add 3072141364/t-craft
```

按分类装:

```
/plugin install basic-skills@t-craft      # changelog / git-flow / emoji
/plugin install code-skills@t-craft        # code-intelligence / karpathy-guidelines / code-format / make-shortcut + /code-review
/plugin install obsidian-skills@t-craft    # obsidian-kb
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

不含(由 skill 管):node / nvm(`code-intelligence/setup_env.sh`)、ruff / clang-format / LSP(`code-format/setup_format_tools.sh`)、docker(手动)。

## 新增一个 skill

1. 复制 `template/SKILL.md` 到 `skills/<plugin>/<name>/SKILL.md`,填写 name / description / 正文。
2. 在 `.claude-plugin/marketplace.json` 里找到该 skill 所属分类的 plugin,在其 `skills` 数组追加 `"./<name>"`(相对 plugin source)。若新分类,新增一个 plugin 条目(`source: "./skills/<plugin>"`)。
3. 若是命令(非 skill),放 `skills/<plugin>/commands/<cmd>.md`(自动发现,不列进 `skills[]`)。
4. 正文遵循「通用方法论 + 项目约定发现」(见 `CLAUDE.md`),不硬编码项目路径。
5. `/plugin update` 或重启 Claude Code 生效。

## 原则

- **通用方法进 skill,项目绑定靠发现**:skill 只装方法论;路径、版本真源、分支模型等读项目的 `CLAUDE.md` / 标准文件。
- **以文件实际内容为准**:不凭记忆读项目约定。
- **per-plugin 目录**:每个 plugin 自己的 source 目录(`skills/<plugin>/`),skill 与命令各归其位;分类由 marketplace.json 的多 plugin 表达(参照 anthropics/skills)。

## 参考

本项目参考、引用或调研过的仓库见 [REFERENCES.md](REFERENCES.md)。
