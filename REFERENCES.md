# 参考与引用的仓库

本仓库开发过程中参考、引用或调研过的 GitHub 仓库。按用途分类。

## 结构与约定参考

| 仓库 | 用途 |
|------|------|
| [anthropics/skills](https://github.com/anthropics/skills) | t-craft 的 plugin/skill 结构参照(per-plugin source 目录、marketplace 多 plugin 分类) |

## 直接集成(marketplace 外部 plugin)

| 仓库 | 用途 |
|------|------|
| [yizhiyanhua-ai/fireworks-tech-graph](https://github.com/yizhiyanhua-ai/fireworks-tech-graph) | 技术图生成(NL->SVG/PNG,14 图型,12 风格);作为外部 plugin 集成进 marketplace,obsidian-kb 写方案时联动画图 |

## 设计参考(调研后影响了 t-craft skill 设计)

| 仓库 | 影响了哪个 skill / 借鉴点 |
|------|---------------------------|
| [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) | obsidian-kb:Obsidian 语法(wikilink/callout/properties)、vault 联通方式(文件读写 + CLI) |
| [mattpocock/skills](https://github.com/mattpocock/skills) | code-review:双轴(Standards/Spec)+ Fowler 异味基线 + 两轴分开报告。**研发流程调度(brainstorm / dev-flow)参考此仓库**:`skills/engineering/` 下的 research、grill-with-docs、to-spec、triage、domain-modeling、tdd、diagnosing-bugs 可直接借鉴 |
| [obra/superpowers](https://github.com/obra/superpowers) | code-review:requesting/receiving 分离、流程纪律(verification-before-completion) |
| [awesome-skills/code-review-skill](https://github.com/awesome-skills/code-review-skill) | code-review:清单式检查 + 置信度过滤 + 渐进披露(核心+语言指南) |
| [turingmindai/turingmind-code-review](https://github.com/turingmindai/turingmind-code-review) | code-review:VCS 无关(纯 git diff)+ git hooks 主动触发 + 严重度报告 |
| [anthroos/claude-code-review-skill](https://github.com/anthroos/claude-code-review-skill) | code-review:git blame 跳预存 + `@review-ok` 行内静默 + 自动跳 trivial |
| [awesome-skills/mermaid-syntax-skill](https://github.com/awesome-skills/mermaid-syntax-skill) | 图表方案对比(mermaid 文本图,防语法错);未集成,fireworks 优先 |
| [Cocoon-AI/architecture-diagram-generator](https://github.com/Cocoon-AI/architecture-diagram-generator) | 图表方案对比(claude.ai 暗色架构 HTML);未集成 |
| [daydaylee1227/Blog #24](https://github.com/daydaylee1227/Blog/issues/24) | git-guidelines:Git 四区模型、fetch 详解、撤销三式、分支管理规范、stash |
| [Dataquest: 10 Git Skills](https://www.dataquest.io/blog/10-git-skills-you-still-need-to-know-for-version-control/) | git-guidelines:原子提交、revert 优先于 reset、merge 冲突处理、PR 协作准则 |

## 工具与依赖(setup 脚本引用)

| 仓库 | 用途 |
|------|------|
| [nvm-sh/nvm](https://github.com/nvm-sh/nvm) | Node 版本管理(code-guidelines/scripts/setup_env.sh、scripts/setup-ubuntu.sh) |
| [astral-sh/uv](https://github.com/astral-sh/uv) | Python 环境管理(code-guidelines/scripts/setup_format_tools.sh、scripts/setup-*.sh) |
| [mikefarah/yq](https://github.com/mikefarah/yq) | YAML 处理(scripts/setup-ubuntu.sh 下二进制) |
| [Homebrew/install](https://github.com/Homebrew/install) | macOS Homebrew 安装(scripts/setup-mac.sh) |
| [gitlab-org/cli](https://gitlab.com/gitlab-org/cli) | GitLab CLI `glab`(scripts/setup-*.sh 推荐) |
| [gitea/tea](https://gitea.com/gitea/tea) | Gitea CLI(scripts/setup-*.sh 推荐) |

## 代码智能工具

| 仓库 | 用途 |
|------|------|
| [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) | 代码知识图谱 MCP;code-intelligence(code-guidelines 附属文档)路由的深度分析工具;`gitnexus-*` 子 skill 由其 `analyze` 生成 |
| codegraph(npm 包) | 代码调用图 CLI;code-intelligence(code-guidelines 附属文档)路由的日常工具 |

## 官方插件库

| 仓库 | 用途 |
|------|------|
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Claude 官方插件 marketplace;code-intelligence(code-guidelines 附属文档)引用其 `*-lsp` 插件(pyright-lsp、clangd-lsp 等) |

## 调研过但未采用

| 仓库 | 说明 |
|------|------|
| [trailofbits/skills](https://github.com/trailofbits/skills) | 安全审计 skill 集(30 个),未采用 |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 跨平台企业 skill 大全(345 个),未采用 |
| [JeremyMorgan/Claude-Code-Reviewing-Prompts](https://github.com/JeremyMorgan/Claude-Code-Reviewing-Prompts) | review 提示词集,非 skill |
| [yeameen/claude-code-review-council](https://github.com/yeameen/claude-code-review-council) | 多模型议会审查,需多 CLI |
| [VassoD/claude-code-reviewer](https://github.com/VassoD/claude-code-reviewer) | 独立 Python 脚本,非 diff-based |
| [awesome-skills](https://github.com/awesome-skills) org 其他 | first-principles-skill、5-whys-skill、mobile-app-design、create-html-deck、memex、insights、manim-skill 等(各有用途,未集成) |

