# t-craft 开发约定

本仓库是个人工程技能 plugin 集。一个 marketplace(`t-craft`)挂多个分类 plugin。在此仓库内开发/维护 skill 时遵循以下约定。

## 体系定位(最顶层,决定一切内容去留)

t-craft **不是"教模型写代码"**——模型默认已是优秀的编码/写作助手。t-craft 是一套 **流程编排 + 规范落盘 + 双线并行** 的工程体系:

- **开发线**:`dev-flow` 调度六阶段(头脑风暴→方案→实现→验证→发布→沉淀),"处理到某阶段 → 触发对应规范"。
- **调研线**(与开发线并行):`paper-study` 调研论文 + 调研技术,沉淀知识。两线在周报三流汇合。
- **知识大脑**(横贯两线):`obsidian-kb` 是知识双向入口——主动沉淀(写)+ 自动快答(读),按目录隔离体系长成项目 wiki。

### 判断内容去留的唯一标准

> **模型默认能力已足够的内容 → 删;默认做不到的 → 留并前置。**

写/改任何 skill 前先问:"这段和模型默认会做的有区别吗?"

- **没区别 → 删**(通用编码常识:见名知义、拆函数、命名、注释哲学——留着纯稀释触发信号)。
- **有区别 → 留**:项目专属配置真源(ruff/clang-format)、附属文档里的具体清单(bug 检查/性能规则)、独特机制(vault 落盘/阶段调度/代码理解路由)、项目专属流程(git/版本)。

skill 是"默认行为的增量",不是"重写默认行为"。

## 核心原则:通用方法论 + 项目约定发现

每个 skill **只含通用方法论**,跨项目复用。项目特定约定(CHANGELOG 路径、版本真源、分支模型、make 命令、规范文档位置等)**不硬编码**,而是让 skill 在运行时按三层发现:

1. **约定优于配置**:探测标准位置(根目录 `CHANGELOG.md`、`version.json` / `pyproject.toml` / `package.json`、`docs/development.md` 等)。
2. **读项目 CLAUDE.md**:从中提取项目规则;若引用了规范文档,一并读。
3. **可选描述文件**:仅当约定偏离默认时,读 `.claude/skills-config.json` 之类的显式覆盖。

发现到就用,没发现用默认并提示用户。

## 分类 = 多 plugin

每个 plugin 有自己的 source 目录(`skills/<plugin>/`),skill 放在对应 plugin 目录下;**分类靠 `.claude-plugin/marketplace.json` 的 `plugins[]`**:每个 plugin 是一个分类,`source` 指向 `skills/<plugin>`,`skills` 数组列出所属 skill(路径相对 source)。命令放 plugin 的 `commands/`(自动发现)。参照 anthropics/skills。

当前分类:

- `code-skills`:代码相关(code-guidelines(编码总入口:跨语言准则 + karpathy 行为准则 / make-shortcut / format / brainstorm / code-intelligence / code-markers / code-smells 附属文档)/ project-doc(独立子 skill,含 prd/adr/test/review + 术语提炼 terminology)/ web-guidelines(Web/前端总入口,面向 SaaS 平台/应用界面 + 报告渲染不做营销页:应用型 UI + 设计与文案 + 报告渲染 + React 性能 + UI 审查)/ python-guidelines / cpp-guidelines / bash-guidelines(各含 format、review 附属文档)/ dev-flow / git-guidelines(含 commit、changelog、branch、readme 附属文档))+ 命令 `/tcraft-code-review` `/tcraft-project-doc` `/tcraft-brainstorm` `/tcraft-dev-flow` `/tcraft-release` `/tcraft-web`(commands/)
- `obsidian-skills`:Obsidian 知识库(obsidian-kb,vault 统一管理:落盘/查询/沉淀/快速问答/周报/emoji 参考;技术学习在 tech/ 逐渐沉淀;命令 `/tcraft-obsidian-kb` `/tcraft-obsidian-query` `/tcraft-weekly`)
- `research-skills`:科研管理(paper-study,论文阅读/笔记/待读队列,管 vault papers/;命令 `/tcraft-paper`)

> `dev-flow` 已实现;`brainstorm` 已并入 code-guidelines 附属文档;`obsidian-query`/`obsidian-answers` 已并入 obsidian-kb(模块二查询 / 模块五快速问答);`spec-doc` 已更名并抽为独立子 skill `project-doc`(含 prd/adr/test/review 附属文档)。研发流程预设提示词见 `docs/workflow-prompts.md`。

## 目录与命名

- `skills/<plugin>/<name>/SKILL.md`:按 plugin 分目录。
- 命令:`skills/<plugin>/commands/<cmd>.md`(plugin 的 `commands/` 自动发现)。
- 目录名、skill `name`:kebab-case,小写连字符。
- 资源放该 skill 自己的 `references/`(含命令用到的参考,挂在语义最相关的 skill 下,如 code-guidelines);跨 skill 共享时用相对路径引用。

## frontmatter

```markdown
---
name: my-skill
description: 做什么 + 何时触发。适度 pushy,即使用户没说 skill 名,意图匹配就触发。
---
```

只有 `name` 和 `description` 必填。`description` 是唯一触发机制。写好它是命中率的关键,遵循以下原则:

### description 三原则(命中率的关键)

模型不是在读文档,而是拿用户 query 和 description 算语义相似度决定是否激活。据此:

1. **前置独特价值,而非默认行为**。模型本身已是优秀的代码 / 写作助手——"写 Python 时用""重构代码时用"这类描述,和模型的默认能力重叠,反而稀释触发信号,让模型觉得"这我本来就会,不用激活"。开头必须点明**这个 skill 比默认行为多了什么**:项目专属配置(ruff/mypy 真源)、附属文档里的具体清单(bug 检查表、性能规则)、独特机制(落 vault、阶段调度)。反面例子:"Python 编码约定,写 Python 时用";正面例子:"Python 项目工具真源与审查清单——要配 ruff/mypy、抓可变默认参数 / 异常吞咽这类工具管不到的 bug 时读"。

2. **写触发器,不写说明书**。description 是"当用户想做 X 时激活我",不是"我这个 skill 包含 A/B/C/D 功能"。用"何时用:①…②…"的场景列表,别堆功能清单。功能罗列越全,语义向量越平均化,匹配越模糊。

3. **短而准 > 长而全**。控制在 ~200-300 字。覆盖面靠正文和附属文档,不靠 description 堆场景。一个覆盖 8 件事的 800 字描述,不如一个点透 2-3 个核心触发场景的 250 字描述命中率高。

> 校准:写完问自己"这段和模型默认会做的有区别吗?没区别就是废话,删掉;有区别就前置。"

## 新增 skill 流程

1. 在 `skills/<plugin>/` 下新建 `<name>/SKILL.md`,参考现有 skill 的正文结构;description 按上节「三原则」写(前置独特价值、写触发器、短而准)。
2. 在 `.claude-plugin/marketplace.json` 里找到该 skill 所属分类的 plugin,在其 `skills` 数组追加 `"./<name>"`(相对 plugin source)。若新分类,新增一个 plugin 条目(`source: "./skills/<plugin>"`)。
3. 若是命令(非 skill),放 `skills/<plugin>/commands/<cmd>.md`(自动发现,不列进 `skills[]`)。
4. 正文遵循「通用方法 + 项目约定发现」。
5. 重装生效:`/plugin update` 或重启 Claude Code。

## 写作风格

- 解释「为什么」而不是堆 MUST/NEVER;让模型理解意图而非死记规则。
- 以项目文件实际内容为准,不凭记忆读项目约定。
- 写入类操作(改 CHANGELOG、动版本)前展示草稿给用户确认。
- 改 skill 结构 / 阶段 / 文档归属时,同步更新 `docs/system-map.html`(体系全景图)。
